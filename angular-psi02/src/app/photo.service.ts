import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Photo } from './photo';

@Injectable({
  providedIn: 'root'
})

export class PhotoService {

  //private photosUrl = 'http://localhost:3052/catalog/';  // URL to web api
  private photosUrl = 'http://10.101.151.25:3052/catalog/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

    /** GET users from the server */
  getPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.photosUrl}photos`)
      .pipe(
        catchError(this.handleError<Photo[]>('getPhotos', []))
      );
  }

  /** GET user by id. Return `undefined` when id not found */
  getPhotoNo404<Data>(id: string): Observable<Photo> {
    const url = `${this.photosUrl}/photo/?id=${id}`;
    return this.http.get<Photo[]>(url)
      .pipe(
        map(users => users[0]), // returns a {0|1} element array
        catchError(this.handleError<Photo>(`getPhoto id=${id}`))
      );
  }

  /** GET user by id. Will 404 if id not found */
  getPhoto(id: string): Observable<Photo> {
    const url = `${this.photosUrl}photo/${id}`;
    return this.http.get<Photo>(url).pipe(
      catchError(this.handleError<Photo>(`getPhoto id=${id}`))
    );
  }

  //////// Save methods //////////

  /** POST: add a new user to the server */
  addPhoto(photo: Photo): Observable<Photo> {
    return this.http.post<Photo>(`${this.photosUrl}photo/`, {"_photo": photo._photo, "name": photo.photo_name, "desc": photo.photo_desc, "likes": photo.num_likes}, this.httpOptions).pipe(
      catchError(this.handleError<Photo>('addPhoto'))
    );
  }

  /** DELETE: delete the user from the server */
  deletePhoto(photo: Photo | number): Observable<Photo> {
    const id = typeof photo === 'number' ? photo : photo._id;
    const url = `${this.photosUrl}photo/${id}`;

    return this.http.delete<Photo>(url, this.httpOptions).pipe(
      catchError(this.handleError<Photo>('deletePhoto'))
    );
  }

  /** PUT: update the user on the server */
  updatePhoto(photo: Photo): Observable<Photo> {
    return this.http.put<Photo>(`${this.photosUrl}photo/${photo._id}`, {"_photo": photo._photo, "name": photo.photo_name, "desc": photo.photo_desc, "likes": photo.num_likes}, this.httpOptions).pipe(
      catchError(this.handleError<Photo>('updatePhoto'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
		
	  alert(`${operation} failed: ${error.message}`);

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
