import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserUpsertViewModel } from '../models/user/user-upsert-view-model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private appBaseUrl: string = 'https://localhost:7156/api/';
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private httpClient: HttpClient) { }

  create(createModel: UserUpsertViewModel): Observable<UserUpsertViewModel> {
    const createUserUrl: string = `${this.appBaseUrl}user/create`;
    return this.httpClient.post<UserUpsertViewModel>(createUserUrl, createModel, this.httpOptions);
  }
}