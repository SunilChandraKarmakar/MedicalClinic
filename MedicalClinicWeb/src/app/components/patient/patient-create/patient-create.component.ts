import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PatientModel } from 'src/app/models/patient/patient-model';
import { UserViewModel } from 'src/app/models/user/user-view-model';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient-create',
  templateUrl: './patient-create.component.html',
  styleUrls: ['./patient-create.component.scss']
})

export class PatientCreateComponent implements OnInit {

  // Patient create model
  patientCreateModel: PatientModel = new PatientModel();

  constructor(private toastrService: ToastrService, private router: Router, private spinnerService: NgxSpinnerService,
    private patientService: PatientService) { }

  ngOnInit() {
    let isUserLogin: boolean = this.checkUserLoginOrNot()!;

    if(isUserLogin) {
      // Set gander id default = 0 - Select
      this.patientCreateModel.ganderId = 0;
      return;
    }
    else {
      this.toastrService.warning("Please, login first.", "Warning");
      return this.router.navigate(["/login"]);
    }
  }

  // Create patient
  onClickCreatePatient(): void {
    let isFormValidationSuccess: boolean = this.checkFormValidation();

    if(isFormValidationSuccess) {
      this.spinnerService.show();
      this.patientService.create(this.patientCreateModel).subscribe((result: PatientModel) => {
        this.spinnerService.hide();
        this.toastrService.success("Patient create successfull.", "Successfull.");
        return this.router.navigate(["/upcomming_patient_list"]);
      },
      (error: any) => {
        this.spinnerService.hide();
        return this.toastrService.error("Patient cannot create! Try again.", "Error");
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
      return true;
    }
  }

  // Form validation
  private checkFormValidation(): boolean { 
    if(this.patientCreateModel.firstName == undefined || this.patientCreateModel.firstName == null || this.patientCreateModel.firstName == "") {
      this.toastrService.warning("Please, provied first name.", "Warning");
      return false;
    }

    if(this.patientCreateModel.lastName == undefined || this.patientCreateModel.lastName == null || this.patientCreateModel.lastName == "") {
      this.toastrService.warning("Please, provied last name.", "Warning");
      return false;
    }

    if(this.patientCreateModel.age == undefined || this.patientCreateModel.age == null || this.patientCreateModel.age <= 0) {
      this.toastrService.warning("Please, provied age.", "Warning");
      return false;
    }

    if(this.patientCreateModel.ganderId == undefined || this.patientCreateModel.ganderId == null || this.patientCreateModel.ganderId == 0) {
      this.toastrService.warning("Please, provied gander.", "Warning");
      return false;
    }

    if(this.patientCreateModel.doctorName == undefined || this.patientCreateModel.doctorName == null 
      || this.patientCreateModel.doctorName == "") {
      this.toastrService.warning("Please, provied doctor name.", "Warning");
      return false;
    }

    if(this.patientCreateModel.AppointmentDate == undefined || this.patientCreateModel.AppointmentDate == null) {
      this.toastrService.warning("Please, provied appointment date.", "Warning");
      return false;
    }

    if(this.patientCreateModel.problemDescription == undefined || this.patientCreateModel.problemDescription == null 
      || this.patientCreateModel.problemDescription == "") {
      this.toastrService.warning("Please, provied disease description.", "Warning");
      return false;
    }

    return true;
  }
}