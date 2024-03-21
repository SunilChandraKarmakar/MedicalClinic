import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserViewModel } from './models/user/user-view-model';
import { UserType } from './models/constant/user-type.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  
  // Login user type property
  isAdmin: boolean = false;
  isManager: boolean = false;
  isNormalUser: boolean = false;

  constructor(private tosterService: ToastrService, private router: Router) {
   
  }

  onClickLogout(): void {
    this.tosterService.success("Logout Successfull.", "Successfull.");
    localStorage.removeItem('loginUserInfo');
    this.router.navigate(['/login']);
  }

  get isUserLogin(): boolean {
    let userInfo: UserViewModel = JSON.parse(localStorage.getItem('loginUserInfo')!);
    
    if(userInfo != undefined && userInfo.userTypeId == UserType.Normal) {
      this.isNormalUser = true;
      return true;
    }
    else if(userInfo != undefined && userInfo.userTypeId == UserType.Manager) {
      this.isManager = true;
      return true;
    }
    else if(userInfo != undefined && userInfo.userTypeId == UserType.Admin){
      this.isAdmin = true;
      return true;
    }
    else {
      return false;
    }
  }
}