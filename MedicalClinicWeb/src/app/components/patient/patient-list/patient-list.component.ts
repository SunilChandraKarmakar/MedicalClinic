import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserType } from 'src/app/models/constant/user-type.enum';
import { PatientViewModel } from 'src/app/models/patient/patient-view-model';
import { UserViewModel } from 'src/app/models/user/user-view-model';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})

export class PatientListComponent implements OnInit {

  constructor(private patientService: PatientService, private spinnerService: NgxSpinnerService, private toastrService: ToastrService,
    private router: Router) { }

  // Login user type
  isAdminUser: boolean = false;
  private _loginUserTypeId: number | undefined;
  private _loginUserId: string | undefined;

  // Previous patient data source
  previousPatients: PatientViewModel[] = [];

  // Search patient property
  searchPatient: string | undefined;

  ngOnInit() {
    let isUserLogin: boolean = this.checkUserLoginOrNot()!;

    if(isUserLogin) {
      this.getPerviousPatients();
      return;
    }
    else {
      this.toastrService.warning("Please, login first.", "Warning");
      return this.router.navigate(["/login"]);
    }
  }

  private getPerviousPatients(): void {
    this.spinnerService.show();
    if(this._loginUserTypeId != UserType.Normal) {
      this.patientService.getPreviousPatients().subscribe((result: PatientViewModel[]) => {
        this.previousPatients = result;
        this.spinnerService.hide();
      },
      (error: any) => {
        this.spinnerService.hide();
        this.toastrService.error("Previous patient cannot load! Please, try again.", "Error");
      })
    }
    else {
      this.patientService.getPreviousPatientsByDoctroId(this._loginUserId!).subscribe((result: PatientViewModel[]) => {
        this.previousPatients = result;
        this.spinnerService.hide();
      },
      (error: any) => {
        this.spinnerService.hide();
        this.toastrService.error("Previous patient cannot load! Please, try again.", "Error");
      })
    }
  }

  // Check user login or not
  private checkUserLoginOrNot(): boolean | undefined {
    let loginUserInfo: UserViewModel = JSON.parse(localStorage.getItem("loginUserInfo")!);

    if (loginUserInfo == null || loginUserInfo == undefined) {
      return false;
    }
    else {

      this._loginUserTypeId = loginUserInfo.userTypeId;
      this._loginUserId = loginUserInfo.id;
      
      // Checl login user type 
      if(loginUserInfo.userTypeId == UserType.Admin) {
        this.isAdminUser = true;
      }

      return true;
    }
  }

  // Search patient
  onClickSearchPatient(): void {
    if(this.searchPatient == undefined || this.searchPatient == null || this.searchPatient == "") {
      this.toastrService.warning("Please, provied information.", "Warning");
      return;
    }
    else {
      this.previousPatients = this.previousPatients.filter((x: PatientViewModel) => 
        x.firstName.toLowerCase().includes(this.searchPatient?.toLowerCase()!) ||
        // x.lastName.toLowerCase().includes(this.searchPatient?.toLowerCase()!) || 
        x.phoneNumber.toLowerCase().includes(this.searchPatient?.toLowerCase()!) ||
        x.email.toLowerCase().includes(this.searchPatient?.toLowerCase()!) ||
        x.doctroName.toLowerCase().includes(this.searchPatient?.toLowerCase()!));
      return;
    }
  }

  onClickResetSearch(): void {
    this.getPerviousPatients();
    this.searchPatient = undefined;
  }

  onDeleteUpcommingPatient(patiendId: number): void {
    if(patiendId == undefined || patiendId == null) {
      this.toastrService.warning("Please, provied valid patient id! Try again.", "Warning.");
      return;
    }

    this.spinnerService.show();
    this.patientService.delete(patiendId).subscribe((result: number) => {
      this.getPerviousPatients();
      this.spinnerService.hide();
      this.toastrService.success("Selected patient deleted.", "Success.");
      return;
    },
    (error: any) => {
      this.spinnerService.hide();
      this.toastrService.error("Selected patient cannot deleted! Try again.", "Error");
      return;
    })
  }

  onClickUpdateClient(id: number): void {
    this.router.navigate([`/patient_update/previous_patient_list/${id}`]);
  }
}