import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { UsersDetailComponent } from './users-detail/users-detail.component';
import { PhotoComponent } from './photo/photo.component';
import { PhotoDetailComponent } from './photo-detail/photo-detail.component';

const routes: Routes = [
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  	{ path: 'dashboard', component: DashboardComponent },
  	{ path: 'detail_user/:id', component: UsersDetailComponent },
  	{ path: 'users', component: UsersComponent },
  	{ path: 'detail_photo/:id', component: PhotoDetailComponent },
  	{ path: 'photos', component: PhotoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
