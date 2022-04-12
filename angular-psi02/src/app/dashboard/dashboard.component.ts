import { Component, OnInit } from '@angular/core';
import { Photo } from '../photo';
import { PhotoService } from '../photo.service';
import { User } from '../user';
import { UserService } from '../user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	photos: Photo[] = [];
  requested_photos: Photo[] = [];
  user: User;

  options: String[] = ["recent", "popular"];

  constructor(private photoService: PhotoService,
              private location: Location) { }

  ngOnInit(): void {
  	this.photoService.getPhotos().subscribe(photos => { 
		this.photos = photos;
		this.photos.reverse();
		this.changeView("recent");
	});
  }

  getRecentPhotos(): void {
	  this.requested_photos = this.photos.slice(0, 49);
  }

  getPopularPhotos(): void {
	  this.requested_photos.sort((a,b) => a.num_likes - b.num_likes);
	  this.requested_photos.reverse();
  }

  changeView(option): void {
    if(option === "recent") {
      this.getRecentPhotos();
    } else if(option === "popular") {
      this.getPopularPhotos();
    }
  }

}
