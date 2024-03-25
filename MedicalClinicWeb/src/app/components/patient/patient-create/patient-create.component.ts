import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserType } from 'src/app/models/constant/user-type.enum';
import { PatientCreateModel } from 'src/app/models/patient/patient-create-model';
import { UserViewModel } from 'src/app/models/user/user-view-model';
import { PatientService } from 'src/app/services/patient.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-patient-create',
  templateUrl: './patient-create.component.html',
  styleUrls: ['./patient-create.component.scss']
})

export class PatientCreateComponent implements OnInit {

  // Patient create model
  patientCreateModel: PatientCreateModel = new PatientCreateModel();

  // Login user info
  loginUserId: string | undefined;
  loginUserTypeId: number | undefined;

  // User data source
  users: UserViewModel[] = [];

  constructor(private toastrService: ToastrService, private router: Router, private spinnerService: NgxSpinnerService,
    private patientService: PatientService, private userService: UserService) { }

  ngOnInit() {
    let isUserLogin: boolean = this.checkUserLoginOrNot()!;

    if(isUserLogin) {
      // Set gander id default = 0 - Select
      this.patientCreateModel.ganderId = 0;
      this.patientCreateModel.userId = "0";
      this.getUsers();
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

      // Set doctro 
      if(this.loginUserTypeId == UserType.Normal) {
        this.patientCreateModel.userId = this.loginUserId!;
      }

      this.patientService.create(this.patientCreateModel).subscribe((result: PatientCreateModel) => {
        this.spinnerService.hide();
        this.toastrService.success("Patient create successfull.", "Successfull.");
        return this.router.navigate(["/upcomming_patient_list"]);
      },
      (error: any) => {
        this.spinnerService.hide();
        return this.toastrService.error("Patient cannot create! Try again.", "Error");
      });
    }
  }

  // Check user login or not
  private checkUserLoginOrNot(): boolean | undefined {
    let loginUserInfo: UserViewModel = JSON.parse(localStorage.getItem("loginUserInfo")!);

    if (loginUserInfo == null || loginUserInfo == undefined || loginUserInfo.userTypeId == UserType.Admin) {
      return false;
    }
    else {
      this.loginUserId = loginUserInfo.id;
      this.loginUserTypeId = loginUserInfo.userTypeId;
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

    if((this.loginUserTypeId == UserType.Manager) && (this.patientCreateModel.userId == undefined || this.patientCreateModel.userId == null 
      || this.patientCreateModel.userId == "" || this.patientCreateModel.userId == "0")) {
      this.toastrService.warning("Please, select doctor name.", "Warning");
      return false;
    }

    if(this.patientCreateModel.appointmentDate == undefined || this.patientCreateModel.appointmentDate == null) {
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

  // Get user without admin and manager
  private getUsers(): void {
    this.spinnerService.show();
    this.userService.getUsers().subscribe((result: UserViewModel[]) => {
      this.users = result.filter(x => x.userTypeId != 2 && x.userTypeId  != 3);
      this.spinnerService.hide();
      return;
    },
    (errpr: any) => {
      this.spinnerService.hide();
      this.toastrService.error("Doctor cannot load! Please, try again.", "Error");
      return;
    })
  }
}