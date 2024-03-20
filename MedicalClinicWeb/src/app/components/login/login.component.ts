import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { LoginViewModel } from 'src/app/models/login/login-view-model';
import { UserViewModel } from 'src/app/models/user/user-view-model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  // Login model
  loginModel: LoginViewModel = new LoginViewModel();

  constructor(private userService: UserService, private router: Router, private toastrService: ToastrService, 
    private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
  }

  onClickLogin(): void {
    let isFormValidationSuccess: boolean = this.checkFormValidation();

    if(isFormValidationSuccess) {
      this.spinnerService.show();
      this.userService.login(this.loginModel).subscribe((result: UserViewModel) => {
        localStorage.setItem('loginUserInfo', JSON.stringify(result));
        this.spinnerService.hide();
        this.toastrService.success("Login Successfull", "Successfull");
        return this.router.navigate(["/user-list"]);
      },
      (error: any) => {
        this.spinnerService.hide();
        this.toastrService.error(error, "Error");
        console.log("Error :- ", error);
      })
    }
  }

  private checkFormValidation(): boolean {
    if(this.loginModel.email == undefined || this.loginModel.email == null || this.loginModel.email == "") {
      this.toastrService.warning("Please, provied valid email address.", "Warning");
      return false;
    }

    if(this.loginModel.password == undefined || this.loginModel.password == null || this.loginModel.password == "") {
      this.toastrService.warning("Please, provied password.", "Warning");
      return false;
    }

    return true;
  }
}