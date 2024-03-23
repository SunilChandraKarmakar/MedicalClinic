import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserUpdateViewModel } from 'src/app/models/user/user-update-view-model';
import { UserViewModel } from 'src/app/models/user/user-view-model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})

export class UserEditComponent implements OnInit {

  // User create model
  userUpdateModel: UserUpdateViewModel = new UserUpdateViewModel();

  // Selected user id
  private _userId: string | undefined;

  constructor(private userService: UserService, private toastrService: ToastrService, private router: Router, 
    private spinnerService: NgxSpinnerService, private activeRoute: ActivatedRoute) { }


  ngOnInit() {
    let isUserLogin: boolean = this.checkUserLoginOrNot()!;

    if(isUserLogin) {
      this.getUserId();
      this.getUserbyId();
      return;
    }
    else {
      this.toastrService.warning("Please, login first.", "Warning");
      return this.router.navigate(["/login"]);
    }
  }

  private getUserId(): void {
    this.activeRoute.params.subscribe(params => { 
      this._userId = params["id"];
    });
  }

  private getUserbyId(): void {
    this.spinnerService.show();
    this.userService.get(this._userId!).subscribe((result: UserUpdateViewModel) => {
      this.userUpdateModel = result;
      this.spinnerService.hide();
      return;
    },
    (error: any) => {
      this.spinnerService.hide();
      this.toastrService.error("User cannot find! Please, try again.", "Error");
      return;
    })
  }

  // Update user
  onUpdateUser(): void {
    let isFormValidationSuccess: boolean = this.checkFormValidation();

    if(isFormValidationSuccess) {
      // this.spinnerService.show();
      // this.userService.(this.userUpdateModel).subscribe((result: UserUpdateViewModel) => {
      //   this.spinnerService.hide();
      //   this.toastrService.success("User create successfull.", "Successfull");
      //   return this.router.navigate(["/user_list"]);
      // },
      // (error: any) => {
      //   this.spinnerService.hide();
      //   this.toastrService.error("User cannot created! Try again.", "Error");
      // });
    }
  }

  // Form validation
  private checkFormValidation(): boolean {
    if(this.userUpdateModel.firstName == undefined || this.userUpdateModel.firstName == "" || this.userUpdateModel.firstName == null) {
      this.toastrService.warning("Please, provied first name.", "Warning");
      return false;
    }

    if(this.userUpdateModel.lastName == undefined || this.userUpdateModel.lastName == "" || this.userUpdateModel.lastName == null) {
      this.toastrService.warning("Please, provied last name.", "Warning");
      return false; 
    }

    if(this.userUpdateModel.email == undefined || this.userUpdateModel.email == "" || this.userUpdateModel.email == null) {
      this.toastrService.warning("Please, provied valid email address.", "Warning");
      return false; 
    }

    if(this.userUpdateModel.password == undefined || this.userUpdateModel.password == "" || this.userUpdateModel.password == null) {
      this.toastrService.warning("Please, provied password.", "Warning");
      return false;
    }

    if(this.userUpdateModel.phoneNumber == undefined || this.userUpdateModel.phoneNumber == "" || this.userUpdateModel.phoneNumber == null) {
      this.toastrService.warning("Please, provied phone number.", "Warning");
      return false;
    }

    if(this.userUpdateModel.userTypeId == undefined || this.userUpdateModel.userTypeId == null) {
      this.toastrService.warning("Please, provied user type.", "Warning");
      return false;
    }

    return true;
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