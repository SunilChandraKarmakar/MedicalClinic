import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserCreateViewModel } from '../models/user/user-create-view-model';
import { UserViewModel } from '../models/user/user-view-model';
import { LoginViewModel } from '../models/login/login-view-model';

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
    // let userInfo: UserViewModel = JSON.parse(localStorage.getItem("loginUserInfo")!);
    // const asseccPermission = new HttpHeaders ({
    //   'Content-Type': 'application/json',
    //   'Authorization' : `Bearer ${userInfo.token}`
    // });    

    const getAllUsersUrl: string = `${this.appBaseUrl}user/getUsers`;
    return this.httpClient.get<UserViewModel[]>(getAllUsersUrl);
  }

  create(createModel: UserCreateViewModel): Observable<UserCreateViewModel> {
    const createUserUrl: string = `${this.appBaseUrl}user/create`;
    return this.httpClient.post<UserCreateViewModel>(createUserUrl, createModel, this.httpOptions);
  }

  login(model: LoginViewModel): Observable<UserViewModel> {
    const loginUserUrl: string = `${this.appBaseUrl}user/login`;
    return this.httpClient.post<UserViewModel>(loginUserUrl, model, this.httpOptions);
  }
}