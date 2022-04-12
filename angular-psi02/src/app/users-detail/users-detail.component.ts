import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../user';
import { UserService } from '../user.service';
import { Photo } from '../photo';
import { PhotoService } from '../photo.service';

@Component({
  selector: 'app-users-detail',
  templateUrl: './users-detail.component.html',
  styleUrls: ['./users-detail.component.css']
})
export class UsersDetailComponent implements OnInit {

  user: User;
  photo_str: string;
  requested_photos: Photo[] = [];

  select: boolean = false;
  temp_name: string = "";
  temp_desc: string = "";
  
  options: string[] = ["Uploaded", "Favorites"];
  
  folder_photos_demo: string[] = [];
  folder_photos: string[] = [];
  folder_photos_names: string[] = [];
  folder_upload_check: boolean = false;
  folder_desc: boolean = false;
  temp_desc_folder: string = "";
  index: number = -1;
  current_folder_photo: string = "";
  
  constructor(
  	private route: ActivatedRoute,
    private userService: UserService,
	private photoService: PhotoService,
    private location: Location
  ) { }

  ngOnInit(): void {
  	this.getUser();
  }

  getUser(): void {
	this.user = this.userService.getCurrentUser();
	this.getAllUserPhotos();
  }
  
  save(): void {
	  if(!this.temp_name) {
		  let photo_name = (document.getElementById("avatar") as HTMLInputElement).value;
		  photo_name = photo_name.replace("C:\\fakepath\\", "");
		  if(photo_name.includes(".jpg"))
			photo_name = photo_name.replace(".jpg", "");
		  else if(photo_name.includes(".png"))
			  photo_name = photo_name.replace(".png", "");
		  else if(photo_name.includes(".gif"))
			  photo_name = photo_name.replace(".gif", "");
		  this.temp_name = photo_name;
	  }
	  if(!this.temp_desc)
		  if(confirm("Are you sure you don't want any description?")) {
			  this.select = false;
			  this.temp_desc = " ";
		  } else {
			  this.temp_name = "";
			  this.temp_desc = "";
			  return;
		  }
	  
	  let error: string = "";
	  if(this.temp_name.length > 100 || this.temp_desc.length > 500) {
		  if(this.temp_name.length > 100) error += "Photo's name must be a maximum of 100 characters\n";
		  if(this.temp_desc.length > 500) error += "Photo's description must be a maximum of 500 characters\n";
		  alert("PHOTO UPLOAD FAILED\n" + error);
	  } else {
		  if(this.temp_name == "") this.temp_name = " ";
		  if(this.temp_desc == "") this.temp_desc = " ";
		  this.createNewPhoto(this.photo_str, this.temp_name, this.temp_desc, 0);
		  if(this.select) this.select = false;
		  this.photo_str = "";
		  this.temp_name = "";
		  this.temp_desc = "";
	  }
  }
  
  createNewPhoto(_photo: string, photo_name: string, photo_desc: string, num_likes: Number): void {
    this.photoService.addPhoto({ _photo, photo_name, photo_desc, num_likes } as Photo)
		.subscribe(photo => {
			this.user.user_uploaded_photos.push(photo._id);
			this.getAllUserPhotos();
			this.userService.setCurrentUser(this.user);
			this.userService.updateUser(this.user).subscribe();
		});
  }
  
  getAllUserPhotos(): void {
	  if(this.user.user_uploaded_photos) {
		  this.requested_photos = [];
		  for(var i = 0; i < this.user.user_uploaded_photos.length; i++) {
			  this.photoService.getPhoto(this.user.user_uploaded_photos[i]).subscribe(photo => { 
				this.requested_photos.push(photo);
			  });
		  }
	  }
  }
  
  getFavPhotos(): void {
	  if(this.user.user_favorited_photos) {
		  this.requested_photos = [];
		  for(var i = 0; i < this.user.user_favorited_photos.length; i++) {
			  this.photoService.getPhoto(this.user.user_favorited_photos[i]).subscribe(photo => { 
				this.requested_photos.push(photo);
			  });
		  }
	  }
  }
  
  changeViewU(option): void {
    if(option === "Uploaded") {
      this.getAllUserPhotos();
    } else if(option === "Favorites") {
      this.getFavPhotos();
    }
  }
  
  fileEvent(): void {
    const file = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
	reader.onload = (e: any) => {
		this.photo_str = reader.result as string;
	}
	this.select = true;
  } 
  
  get_folder(event): void {
	if (event.target.files.length > 0) {
        let files = event.target.files;
		for (var i = 0; i < files.length; i++) {
			let file = files[i];
			const reader = new FileReader();
			reader.readAsDataURL(file);
			
			var count = 0;
			var count_demo = 0;
			reader.onload = (e: any) => {
				if(!file.name.includes(".gif") && !file.name.includes(".mp4") && !file.name.includes(".mp3") && !file.name.includes(".wav")) {
					let result = reader.result as string;
					if(count_demo < 10) this.folder_photos_demo.push(result);
					this.folder_photos.push(result);
					this.folder_photos_names.push(file.name)
					count_demo += 1;
				}
				if(count == files.length - 1)
					this.folder_upload_check = true;
				count += 1;
			}
		}
	}
  }
  
  upload_folder(): void {
	  if(confirm("Do you want to give description to each Photo?")) {
		  this.folder_desc = true;
		  this.folder_upload_check = false;
		  this.folder_photos_demo = [];
		  this.current_folder_photo = this.folder_photos[0];
	  } else {
		  this.folder_upload_check = false;
		  this.folder_photos_demo = [];
		  
		  let count = 0;
		  for(var i = 0; i < this.folder_photos.length; i++) {
			  let photo_name = this.folder_photos_names[i];
			  if(photo_name.includes(".jpg"))
				photo_name = photo_name.replace(".jpg", "");
			  else if(photo_name.includes(".jpeg"))
				photo_name = photo_name.replace(".jpeg", "");
			  else if(photo_name.includes(".png"))
				  photo_name = photo_name.replace(".png", "");
			  else if(photo_name.includes(".gif"))
				  photo_name = photo_name.replace(".gif", "");
			  let _photo = this.folder_photos[i];
			  let photo_desc = " ";
			  let num_likes = 0;
			  this.photoService.addPhoto({ _photo, photo_name, photo_desc, num_likes } as Photo)
				.subscribe(photo => {
					count += 1;
					this.user.user_uploaded_photos.push(photo._id);
					this.userService.setCurrentUser(this.user);
					this.userService.updateUser(this.user).subscribe();
					if(count == this.folder_photos.length) {
						this.getAllUserPhotos();
						this.folder_photos = [];
						this.folder_photos_names = [];
					}
				});
		  }
	  }
  }
  
  @ViewChild('myInput') myInputVariable;
  cancel_upload_folder(): void {
	  this.folder_photos_demo = [];
	  this.folder_photos = [];
	  this.folder_photos_names = [];
	  this.myInputVariable.nativeElement.value = "";
	  this.folder_upload_check = false;
  }
  
  uploadPhotoFromFolder(): void {
	  this.index += 1;
	  let photo_name = this.folder_photos_names[this.index];
	  if(photo_name.includes(".jpg"))
		photo_name = photo_name.replace(".jpg", "");
	  else if(photo_name.includes(".png"))
		  photo_name = photo_name.replace(".png", "");
	  else if(photo_name.includes(".gif"))
		  photo_name = photo_name.replace(".gif", "");
	  if(this.temp_desc_folder == "") this.temp_desc_folder = " ";
	  this.createNewPhoto(this.folder_photos[this.index], photo_name, this.temp_desc_folder, 0);
	  this.temp_desc_folder = "";
	  if(this.index == this.folder_photos.length - 1) {
		  this.folder_upload_check = false;
		  this.folder_desc = false;
		  this.folder_photos = [];
		  this.folder_photos_names = [];
	  }
	  this.current_folder_photo = this.folder_photos[this.index + 1];
  }
  
  skipUploadPhotoFromFolder(): void {
	  this.index += 1;
	  if(this.index == this.folder_photos.length - 1) {
		  this.folder_upload_check = false;
		  this.folder_desc = false;
		  this.folder_photos = [];
		  this.folder_photos_names = [];
	  }
	  this.current_folder_photo = this.folder_photos[this.index + 1];
  }

}
