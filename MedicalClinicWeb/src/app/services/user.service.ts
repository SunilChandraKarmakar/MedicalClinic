import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserCreateViewModel } from '../models/user/user-create-view-model';
import { UserViewModel } from '../models/user/user-view-model';
import { LoginViewModel } from '../models/login/login-view-model';
import { UserUpdateViewModel } from '../models/user/user-update-view-model';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private appBaseUrl: string = 'https://localhost:7156/api/';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  getUsers(): Observable<UserViewModel[]> {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem("loginUserInfo")!);

    const asseccPermission = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${userInfo.token}`
    });    

    const getAllUsersUrl: string = `${this.appBaseUrl}user/getUsers`;
    return this.httpClient.get<UserViewModel[]>(getAllUsersUrl, { headers: asseccPermission });
  }

  get(id: string): Observable<UserUpdateViewModel> {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem("loginUserInfo")!);

    const asseccPermission = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${userInfo.token}`
    });   

    const getUserUrl: string = `${this.appBaseUrl}user/get/${id}`;
    return this.httpClient.get<UserUpdateViewModel>(getUserUrl, {headers: asseccPermission});
  }


  create(createModel: UserCreateViewModel): Observable<UserCreateViewModel> {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem("loginUserInfo")!);

    const asseccPermission = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${userInfo.token}`
    });   

    const createUserUrl: string = `${this.appBaseUrl}user/create`;
    return this.httpClient.post<UserCreateViewModel>(createUserUrl, createModel, { headers: asseccPermission });
  }

  login(model: LoginViewModel): Observable<UserViewModel> {
    const loginUserUrl: string = `${this.appBaseUrl}user/login`;
    return this.httpClient.post<UserViewModel>(loginUserUrl, model, this.httpOptions);
  }

  delete(id: string): Observable<string> {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem("loginUserInfo")!);
    
    const asseccPermission = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${userInfo.token}`
    });    

    const deleteUserUrl: string = `${this.appBaseUrl}user/delete/${id}`;
    return this.httpClient.delete<string>(deleteUserUrl, {headers: asseccPermission});
  }
}