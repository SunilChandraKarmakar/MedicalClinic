import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserViewModel } from '../models/user/user-view-model';
import { PatientCreateModel } from '../models/patient/patient-create-model';
import { PatientViewModel } from '../models/patient/patient-view-model';
import { PatientEditModel } from '../models/patient/patient-edit-model';

@Injectable({
  providedIn: 'root'
})

export class PatientService {

  private appBaseUrl: string = 'https://localhost:7156/api/';

  constructor(private httpClient: HttpClient) { }

  getUpcommingPatients(): Observable<PatientViewModel[]> {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem("loginUserInfo")!);

    const asseccPermission = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${userInfo.token}`
    });    

    const getAllPatientUrl: string = `${this.appBaseUrl}patient/getUpcommingPatients`;
    return this.httpClient.get<PatientViewModel[]>(getAllPatientUrl, { headers: asseccPermission });
  }

  getUpcommingPatientsByDoctroId(doctroId: string): Observable<PatientViewModel[]> {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem("loginUserInfo")!);

    const asseccPermission = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${userInfo.token}`
    });    

    const getAllPatientUrl: string = `${this.appBaseUrl}patient/getUpcommingPatientsByDoctroId/${doctroId}`;
    return this.httpClient.get<PatientViewModel[]>(getAllPatientUrl, { headers: asseccPermission });
  }

  getPreviousPatients(): Observable<PatientViewModel[]> {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem("loginUserInfo")!);

    const asseccPermission = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${userInfo.token}`
    });    

    const getAllPatientUrl: string = `${this.appBaseUrl}patient/getPreviousPatients`;
    return this.httpClient.get<PatientViewModel[]>(getAllPatientUrl, { headers: asseccPermission });
  }

  getPreviousPatientsByDoctroId(doctroId: string): Observable<PatientViewModel[]> {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem("loginUserInfo")!);

    const asseccPermission = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${userInfo.token}`
    });    

    const getAllPatientUrl: string = `${this.appBaseUrl}patient/getPreviousPatientsByDoctroId/${doctroId}`;
    return this.httpClient.get<PatientViewModel[]>(getAllPatientUrl, { headers: asseccPermission });
  }

  get(id: number): Observable<PatientEditModel> {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem('loginUserInfo')!);
    
    const asseccPermission = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${userInfo.token}`
    });   

    const getPatientUrl: string = `${this.appBaseUrl}patient/getPatient/${id}`;
    return this.httpClient.get<PatientEditModel>(getPatientUrl, { headers: asseccPermission });
  }

  update(id: number, model: PatientEditModel): Observable<PatientEditModel> {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem('loginUserInfo')!);

    const asseccPermission = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${userInfo.token}`
    });   

    const editPatientUrl: string = `${this.appBaseUrl}patient/update/${id}`;
    return this.httpClient.put<PatientEditModel>(editPatientUrl, model, { headers: asseccPermission });
  }

  create(createModel: PatientCreateModel): Observable<PatientCreateModel> {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem('loginUserInfo')!);
    
    const asseccPermission = new HttpHeaders ({
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${userInfo.token}`
    });  

    const createPatientUrl: string = `${this.appBaseUrl}patient/create`;
    return this.httpClient.post<PatientCreateModel>(createPatientUrl, createModel, { headers: asseccPermission });
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