import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PatientModel } from 'src/app/models/patient/patient-model';
import { UserViewModel } from 'src/app/models/user/user-view-model';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient-edit',
  templateUrl: './patient-edit.component.html',
  styleUrls: ['./patient-edit.component.scss']
})

export class PatientEditComponent implements OnInit {

  constructor(private activeRoute: ActivatedRoute, private spinnerService: NgxSpinnerService, private toastrService: ToastrService, 
    private router: Router, private patientService: PatientService) { }

  // Patient id
  private _selectedPatientId: number | undefined; 

  // Patient edit model
  patientEditModel: PatientModel = new PatientModel();

  // Path navigation property
  path: string | undefined;

  ngOnInit() {
    let isUserLogin: boolean = this.checkUserLoginOrNot()!;

    if(isUserLogin) {
      this.getPatientIdWithState();
      this.getPatientById();
      return;
    }
    else {
      this.toastrService.warning("Please, login first.", "Warning");
      return this.router.navigate(["/login"]);
    }

  }

  private getPatientIdWithState(): void {
    this.activeRoute.params.subscribe(params => {
      this.path = "/" + params["path"]; 
      this._selectedPatientId = +params["id"];
    });
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

  onClickUpdatePatient(): void {
    let isFormValidationSuccess: boolean = this.checkFormValidation();

    if(isFormValidationSuccess) {
      this.spinnerService.show();
      this.patientService.update(this.patientEditModel.id, this.patientEditModel).subscribe((result: PatientModel) => {
        this.spinnerService.hide();
        this.toastrService.success("Patient update.", "Successfull.");
        return this.router.navigate([`${this.path}`]);
      },
      (error: any) => {
        this.spinnerService.hide();
        this.toastrService.error("Patient cannot updated! Please, try again.", "Error");
        return this.router.navigate([`${this.path}`]);
      })
    }
    else {
      return;
    }
  }

  private getPatientById(): void {
    this.spinnerService.show();
    this.patientService.get(this._selectedPatientId!).subscribe((result: PatientModel) => {
      this.patientEditModel = result;
      this.spinnerService.hide();
      return;
    },
    (error: any) => {
      this.spinnerService.hide();
      this.toastrService.error("Selected patient cannot load! Please, try again.", "Error");
      return;
    })
  }

  // Form validation
  private checkFormValidation(): boolean { 
    if(this.patientEditModel.firstName == undefined || this.patientEditModel.firstName == null || this.patientEditModel.firstName == "") {
      this.toastrService.warning("Please, provied first name.", "Warning");
      return false;
    }

    if(this.patientEditModel.lastName == undefined || this.patientEditModel.lastName == null || this.patientEditModel.lastName == "") {
      this.toastrService.warning("Please, provied last name.", "Warning");
      return false;
    }

    if(this.patientEditModel.age == undefined || this.patientEditModel.age == null || this.patientEditModel.age <= 0) {
      this.toastrService.warning("Please, provied age.", "Warning");
      return false;
    }

    if(this.patientEditModel.ganderId == undefined || this.patientEditModel.ganderId == null || this.patientEditModel.ganderId == 0) {
      this.toastrService.warning("Please, provied gander.", "Warning");
      return false;
    }

    if(this.patientEditModel.doctorName == undefined || this.patientEditModel.doctorName == null 
      || this.patientEditModel.doctorName == "") {
      this.toastrService.warning("Please, provied doctor name.", "Warning");
      return false;
    }

    if(this.patientEditModel.appointmentDate == undefined || this.patientEditModel.appointmentDate == null) {
      this.toastrService.warning("Please, provied appointment date.", "Warning");
      return false;
    }

    if(this.patientEditModel.problemDescription == undefined || this.patientEditModel.problemDescription == null 
      || this.patientEditModel.problemDescription == "") {
      this.toastrService.warning("Please, provied disease description.", "Warning");
      return false;
    }

    return true;
  }
}