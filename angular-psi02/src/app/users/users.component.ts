import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { User } from '../user';
import { Photo } from '../photo';
import { PhotoService } from '../photo.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

	temp_name: string = "";
	temp_pass: string = "";

	user: User;
	users: User[] = [];
    uploaded: string[] = [];
    logged: boolean = false;

  constructor(private userService: UserService,
              private photoService: PhotoService,
              private location: Location,
              private router: Router) { }

  ngOnInit(): void {
	  if(this.userService.getCurrentUser()) {
		  this.user = this.userService.getCurrentUser();
	  	  this.logged = this.userService.getLoginBool();
	  }
	  this.getUsers();
  }

  login(): void {
	this.userService.getUsers().subscribe(users => { 
		var find: boolean = false;
		for(var i = 0; i < users.length; i++) {
			if(users[i].user_name === this.temp_name) {
				find = true;
				if(users[i].user_pass !== this.temp_pass) {
					alert("LOGIN FAILED: WRONG PASSWORD");
					return;
				}
				this.userService.setLoginBool(true);
				this.userService.updateUser(users[i]).subscribe();
				
				if(find) {
				  this.logged = true;
				  this.user = users[i];
				  this.uploaded = this.user.user_uploaded_photos;
				  this.userService.setCurrentUser(this.user);
				  if(this.uploaded.length > 0)
					this.router.navigate(["/detail_user/", this.user._id]);
				}
				return;
			}
		}
		if(!find) {
			alert("LOGIN FAILED: INVALID NAME");
		}
	}); 
  }

  logout(): void {
    this.userService.setLoginBool(false);
    this.logged = this.userService.getLoginBool();
    this.userService.updateUser(this.user).subscribe();
	this.userService.removeCurrentUser();
  }

  register(): void {
    const name_aux = this.temp_name;
	var unique_check: boolean = true;
    this.users.forEach(function (u) {
      if(u.user_name === name_aux) {
		unique_check = false;
        alert("LOGIN FAILED: USERNAME ALREADY EXISTS");
        return;
      }
    })
	if(unique_check) {
		let check_name = /^[A-Za-z0-9]+$/;
		let check_pass = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9]).*$/;
		let user_error = "";
		let pass_error = "";
		if(name_aux.length < 3 || !check_name.test(name_aux)) {
		  if(name_aux.length < 3) user_error += "The Username must contain 3 or more characters\n";
		  if(!check_name.test(name_aux)) user_error += "The Username can only have letters or numbers\n";
		  alert("LOGIN FAILED: USERNAME DOESN'T MATCH THE REQUIREMENTS\n\n" + user_error);
		  return;
		} else if (this.temp_pass.length < 8 || !check_pass.test(this.temp_pass)) {
		  if(this.temp_pass.length < 8) pass_error += "The Password must contain 8 or more characters\n";
		  if(!/^(?=.*?[a-z]).*$/.test(this.temp_pass)) pass_error += "The Password must include at least one lowercase letter\n";
		  if(!/^(?=.*?[A-Z]).*$/.test(this.temp_pass)) pass_error += "The Password must include at least one uppercase letter\n";
		  if(!/^(?=.*?[0-9]).*$/.test(this.temp_pass)) pass_error += "The Password must include at least one digit\n";
		  alert("LOGIN FAILED: PASSWORD DOESN'T MATCH THE REQUIREMENTS\n\n" + pass_error);
		  return;
		}
		this.addUser(name_aux, this.temp_pass);
		window.location.reload();
	}
  }

  getUsers(): void {
    this.userService.getUsers()
      .subscribe(users => this.users = users);  
  }

  addUser(user_name: string, user_pass: string) {
    if (!user_name || !user_pass) { return; }
    this.userService.addUser({ user_name, user_pass } as User).subscribe();
  }
  
  requirements(): void {
	  alert("REQUIREMENTS:\n\n The Username must be unique, contain 3 or more characters and can only contain letters or numbers.\n" + 
	  "The Password must be 8 or more characters long, including at least one uppercase letter, one lowercase letter and one digit.");
  }

}
