import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //private usersUrl = 'http://localhost:3052/catalog/'; // URL to web api
  private usersUrl = 'http://10.101.151.25:3052/catalog/';  // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

    /** GET users from the server */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.usersUrl}users`)
      .pipe(
        catchError(this.handleError<User[]>('getUsers', []))
      );
  }

  /** GET user by id. Return `undefined` when id not found */
  getUserNo404<Data>(id: string): Observable<User> {
    const url = `${this.usersUrl}/user/?id=${id}`;
    return this.http.get<User[]>(url)
      .pipe(
        map(users => users[0]), // returns a {0|1} element array
        catchError(this.handleError<User>(`getUser id=${id}`))
      );
  }

  /** GET user by id. Will 404 if id not found */
  getUser(id: string): Observable<User> {
    const url = `${this.usersUrl}user/${id}`;
    return this.http.get<User>(url).pipe(
      catchError(this.handleError<User>(`getUser id=${id}`))
    );
  }

  //////// Save methods //////////

  /** POST: add a new user to the server */
  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.usersUrl}user/`, {"name":user.user_name, "pass": user.user_pass}, this.httpOptions).pipe(
      catchError(this.handleError<User>('addUser'))
    );
  }

  /** DELETE: delete the user from the server */
  deleteUser(user: User | number): Observable<User> {
    const id = typeof user === 'number' ? user : user._id;
    const url = `${this.usersUrl}user/${id}`;

    return this.http.delete<User>(url, this.httpOptions).pipe(
      catchError(this.handleError<User>('deleteUser'))
    );
  }

  /** PUT: update the user on the server */
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.usersUrl}user/${user._id}`, {"name": user.user_name, "pass": user.user_pass, 
      "liked": user.user_liked_photos, "favorited": user.user_favorited_photos, "uploaded": user.user_uploaded_photos}, this.httpOptions).pipe(
      catchError(this.handleError<User>('updateUser'))
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

  public setCurrentUser(user: User): void {
    window.sessionStorage.setItem("current_user", JSON.stringify(user));
	//this.current_user = user;
  }

  public getCurrentUser(): User {
	  if(JSON.parse(sessionStorage.getItem("current_user")))
		return JSON.parse(window.sessionStorage.getItem("current_user"));
	return null;
  }
  
  public removeCurrentUser(): void {
	  if(JSON.parse(sessionStorage.getItem("current_user")))
		  window.sessionStorage.removeItem("current_user")
  }
  
  public setLoginBool(log: boolean): void {
	  window.sessionStorage.setItem("logged", JSON.stringify(log));
  }
  
  public getLoginBool(): boolean {
	  if(JSON.parse(sessionStorage.getItem("logged")))
		  return JSON.parse(window.sessionStorage.getItem("logged"));
	  return false;
  }

}
