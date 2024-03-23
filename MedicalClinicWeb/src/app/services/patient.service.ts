import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PatientModel } from '../models/patient/patient-model';
import { Observable } from 'rxjs';
import { UserViewModel } from '../models/user/user-view-model';

@Injectable({
  providedIn: 'root'
})

export class PatientService {

  private appBaseUrl: string = 'https://localhost:7156/api/';

  constructor(private httpClient: HttpClient) { }

  getUpcommingPatients(): Observable<PatientModel[]> {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem("loginUserInfo")!);

    const asseccPermission = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${userInfo.token}`
    });    

    const getAllPatientUrl: string = `${this.appBaseUrl}patient/getUpcommingPatients`;
    return this.httpClient.get<PatientModel[]>(getAllPatientUrl, { headers: asseccPermission });
  }

  getPreviousPatients(): Observable<PatientModel[]> {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem("loginUserInfo")!);

    const asseccPermission = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${userInfo.token}`
    });    

    const getAllPatientUrl: string = `${this.appBaseUrl}patient/getPreviousPatients`;
    return this.httpClient.get<PatientModel[]>(getAllPatientUrl, { headers: asseccPermission });
  }

  get(id: number): Observable<PatientModel> {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem('loginUserInfo')!);
    
    const asseccPermission = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${userInfo.token}`
    });   

    const getPatientUrl: string = `${this.appBaseUrl}patient/getPatient/${id}`;
    return this.httpClient.get<PatientModel>(getPatientUrl, { headers: asseccPermission });
  }

  update(id: number, model: PatientModel): Observable<PatientModel> {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem('loginUserInfo')!);

    const asseccPermission = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${userInfo.token}`
    });   

    const editPatientUrl: string = `${this.appBaseUrl}patient/update/${id}`;
    return this.httpClient.put<PatientModel>(editPatientUrl, model, { headers: asseccPermission });
  }

  create(createModel: PatientModel): Observable<PatientModel> {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem('loginUserInfo')!);
    
    const asseccPermission = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${userInfo.token}`
    });  

    const createPatientUrl: string = `${this.appBaseUrl}patient/create`;
    return this.httpClient.post<PatientModel>(createPatientUrl, createModel, { headers: asseccPermission });
  }

  delete(id: number): Observable<number> {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem('loginUserInfo')!);

    const asseccPermission = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${userInfo.token}`
    });    

    const deletePatientUrl: string = `${this.appBaseUrl}patient/delete/${id}`;
    return this.httpClient.delete<number>(deletePatientUrl, { headers: asseccPermission });
  }  
}