import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PatientModel } from 'src/app/models/patient/patient-model';
import { UserViewModel } from 'src/app/models/user/user-view-model';

@Component({
  selector: 'app-patient-create',
  templateUrl: './patient-create.component.html',
  styleUrls: ['./patient-create.component.scss']
})

export class PatientCreateComponent implements OnInit {

  // Patient create model
  patientCreateModel: PatientModel = new PatientModel();

  constructor(private toastrService: ToastrService, private router: Router, private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    let isUserLogin: boolean = this.checkUserLoginOrNot()!;

    if(isUserLogin) {
      this.spinnerService.show();
      this.spinnerService.hide();

      // Set gander id default = 0 - Select
      this.patientCreateModel.ganderId = 0;
      return;
    }
    else {
      this.toastrService.warning("Please, login first.", "Warning");
      return this.router.navigate(["/login"]);
    }
  }

  onClickCreatePatient(): void {
    
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
}