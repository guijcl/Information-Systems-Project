import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../user';
import { Photo } from '../photo';
import { PhotoService } from '../photo.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-photo-detail',
  templateUrl: './photo-detail.component.html',
  styleUrls: ['./photo-detail.component.css']
})
export class PhotoDetailComponent implements OnInit {

  photo: Photo;
  logdin: boolean;
  user: User;
  users: User[];
  favr: boolean;
  liked: boolean;
  mine: boolean = false;
  input: string;
  href: string = "";

  constructor(
	private route: ActivatedRoute,
	private router: Router,
    private photoService: PhotoService,
	private userService: UserService,
    private location: Location
  ) { }

  ngOnInit(): void {
	  if(this.userService.getCurrentUser()) {
		  this.userService.getUser(this.userService.getCurrentUser()._id).subscribe(user => {
			this.user = user;
			this.userService.setCurrentUser(user);
			this.logdin = this.userService.getLoginBool();
		  });
	  }
	  this.getPhoto();
	this.href = window.location.href;
  }

  getPhoto(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.photoService.getPhoto(id)
      .subscribe(photo => {
		  this.photo = photo;
		  if(this.userService.getCurrentUser()) {
			this.favr = this.user.user_favorited_photos.indexOf(photo._id) > -1;
			this.liked = this.user.user_liked_photos.indexOf(photo._id) > -1;
			if(this.user.user_uploaded_photos.includes(photo._id))
			  this.mine = true;
		  }
	   });
  }

  like(): void {
	this.user.user_liked_photos.push(this.photo._id);
	this.userService.updateUser(this.user).subscribe();
	this.liked = true;
	this.userService.setCurrentUser(this.user);
	
	this.photo.num_likes += 1;
	this.photoService.updatePhoto(this.photo).subscribe();
  }

  unlike(): void {
	this.user.user_liked_photos.splice(this.user.user_liked_photos.indexOf(this.photo._id), 1);
	this.userService.updateUser(this.user).subscribe();
	this.liked = false;
	this.userService.setCurrentUser(this.user);
	
	this.photo.num_likes -= 1;
	this.photoService.updatePhoto(this.photo).subscribe();
  }

  fav(): void {
	this.user.user_favorited_photos.push(this.photo._id);
	this.userService.updateUser(this.user).subscribe();
	this.favr = true;
	this.userService.setCurrentUser(this.user);
  }

  unfav(): void {
	this.user.user_favorited_photos.splice(this.user.user_favorited_photos.indexOf(this.photo._id), 1);
	this.userService.updateUser(this.user).subscribe();
	this.favr = false;
	this.userService.setCurrentUser(this.user);
  }

  remove(): void {
	  if(confirm("Are you sure you want to remove this photo?")) {
		  this.user.user_uploaded_photos.splice(this.user.user_uploaded_photos.indexOf(this.photo._id), 1);
		  if(this.user.user_liked_photos.includes(this.photo._id))
			this.user.user_liked_photos.splice(this.user.user_liked_photos.indexOf(this.photo._id), 1);
		  if(this.user.user_favorited_photos.includes(this.photo._id))
			this.user.user_favorited_photos.splice(this.user.user_favorited_photos.indexOf(this.photo._id), 1);

		  this.userService.getUsers().subscribe(users => {
			this.users = users;
			const temp_route = this.route;
			const uS = this.userService;
			this.users.forEach(function (u) {
				const id = temp_route.snapshot.paramMap.get('id');
				if(u.user_liked_photos.includes(id)) {
					u.user_liked_photos.splice(u.user_liked_photos.indexOf(id), 1);
					uS.updateUser(u).subscribe();
				 } if(u.user_favorited_photos.includes(id)) {
					u.user_favorited_photos.splice(u.user_favorited_photos.indexOf(id), 1);
					uS.updateUser(u).subscribe();
				 }
			  })
			this.photoService.deletePhoto(this.photo).subscribe(photo => {
				this.userService.setCurrentUser(this.user);
				this.userService.updateUser(this.user).subscribe(user => this.router.navigate(["../detail_user/", this.user._id]));
			});
		  });
	  }

  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => this.users = users);
  }

  copyMessage(val: string){
    const selBox = document.createElement('textarea');
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
}
