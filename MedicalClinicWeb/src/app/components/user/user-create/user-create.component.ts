
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserCreateViewModel } from 'src/app/models/user/user-create-view-model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})

export class UserCreateComponent implements OnInit {

  // User create model
  userCreateModel: UserCreateViewModel = new UserCreateViewModel();

  constructor(private userService: UserService, private toastrService: ToastrService, private router: Router, 
    private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
  }

  onCreateUser(): void {
    let isFormValidationSuccess: boolean = this.checkFormValidation();

    if(isFormValidationSuccess) {
      this.spinnerService.show();
      this.userService.create(this.userCreateModel).subscribe((result: UserCreateViewModel) => {
        this.spinnerService.hide();
        this.toastrService.success("User create successfull.", "Successfull");
        return this.router.navigate(["/user_list"]);
      },
      (error: any) => {
        this.spinnerService.hide();
        this.toastrService.error("User cannot created! Try again.", "Error");
      });
    }
  }

  private checkFormValidation(): boolean {
    if(this.userCreateModel.firstName == undefined || this.userCreateModel.firstName == "" || this.userCreateModel.firstName == null) {
      this.toastrService.warning("Please, provied first name.", "Warning");
      return false;
    }

    if(this.userCreateModel.lastName == undefined || this.userCreateModel.lastName == "" || this.userCreateModel.lastName == null) {
      this.toastrService.warning("Please, provied last name.", "Warning");
      return false; 
    }

    if(this.userCreateModel.email == undefined || this.userCreateModel.email == "" || this.userCreateModel.email == null) {
      this.toastrService.warning("Please, provied valid email address.", "Warning");
      return false; 
    }

    if(this.userCreateModel.password == undefined || this.userCreateModel.password == "" || this.userCreateModel.password == null) {
      this.toastrService.warning("Please, provied password.", "Warning");
      return false;
    }

    if(this.userCreateModel.phoneNumber == undefined || this.userCreateModel.phoneNumber == "" || this.userCreateModel.phoneNumber == null) {
      this.toastrService.warning("Please, provied phone number.", "Warning");
      return false;
    }

    if(this.userCreateModel.userTypeId == undefined || this.userCreateModel.userTypeId == null) {
      this.toastrService.warning("Please, provied user type.", "Warning");
      return false;
    }

    return true;
  }
}