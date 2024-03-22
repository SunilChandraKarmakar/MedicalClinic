import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PatientModel } from 'src/app/models/patient/patient-model';
import { UserViewModel } from 'src/app/models/user/user-view-model';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-upcomming-patient-list',
  templateUrl: './upcomming-patient-list.component.html',
  styleUrls: ['./upcomming-patient-list.component.scss']
})

export class UpcommingPatientListComponent implements OnInit {

  constructor(private patientService: PatientService, private spinnerService: NgxSpinnerService, private toastrService: ToastrService,
    private router: Router) { }

  // Upcomming patient data source
  upcommingPatients: PatientModel[] = [];

  // Search patient property
  searchPatient: string | undefined;

  ngOnInit() {
    let isUserLogin: boolean = this.checkUserLoginOrNot()!;

    if(isUserLogin) {
      this.getUpcommingPatients();
      return;
    }
    else {
      this.toastrService.warning("Please, login first.", "Warning");
      return this.router.navigate(["/login"]);
    }
  }

  private getUpcommingPatients(): void {
    this.spinnerService.show();
    this.patientService.getPatients().subscribe((result: PatientModel[]) => {
      this.upcommingPatients = result;
      this.spinnerService.hide();
    },
    (error: any) => {
      this.spinnerService.hide();
      this.toastrService.error("Upcomming patient cannot load! Please, try again.", "Error");
    })
  }

  // Check user login or not
  private checkUserLoginOrNot(): boolean | undefined {
    let loginUserInfo: UserViewModel = JSON.parse(localStorage.getItem("loginUserInfo")!);

    if (loginUserInfo == null || loginUserInfo == undefined) {
      return false;
    }
    else {
      return true;
    }
  }

  onClickSearchPatient(): void {
    if(this.searchPatient == undefined || this.searchPatient == null || this.searchPatient == "") {
      this.toastrService.warning("Please, provied information.", "Warning");
      return;
    }
    else {
      this.upcommingPatients = this.upcommingPatients.filter((x: PatientModel) => 
        x.firstName.toLowerCase().includes(this.searchPatient?.toLowerCase()!) ||
        x.lastName.toLowerCase().includes(this.searchPatient?.toLowerCase()!) || 
        x.phoneNumber.toLowerCase().includes(this.searchPatient?.toLowerCase()!) ||
        x.email.toLowerCase().includes(this.searchPatient?.toLowerCase()!) ||
        x.doctorName.toLowerCase().includes(this.searchPatient?.toLowerCase()!));
      return;
    }
  }

  onClickResetSearch(): void {
    this.getUpcommingPatients();
  }
}