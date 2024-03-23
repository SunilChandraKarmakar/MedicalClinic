import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserViewModel } from 'src/app/models/user/user-view-model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})

export class UserListComponent implements OnInit {

  // Login user id
  private _loginUserId: string | undefined;

  // User data source
  users: UserViewModel[] = [];

  constructor(private userService: UserService, private toastrService: ToastrService, private router: Router, 
    private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    let isUserLogin: boolean = this.checkUserLoginOrNot()!;

    if(isUserLogin) {
      this.getAllUsers();
      return;
    }
    else {
      this.toastrService.warning("Please, login first.", "Warning");
      return this.router.navigate(["/login"]);
    }
  }

  private getAllUsers(): void {
    this.spinnerService.show();
    this.userService.getUsers().subscribe((result: UserViewModel[]) => {
      this.spinnerService.hide();
      this.users = result;
    },
    (error: any) => {
      this.spinnerService.hide();
      this.toastrService.error("Users cannot show! Try again.", "Error");
    })
  }

  onClickDeleteUser(userId: string): void {
    if(userId == undefined || userId == null || userId == "") {
      this.toastrService.warning("Please, provied valid user id", "Warning.");
      return;
    }

    if(this._loginUserId == userId) {
      this.toastrService.warning("You cannot delete your self!", "Warning.");
      return;
    }

    this.spinnerService.show();
    this.userService.delete(userId).subscribe((result: string) => {
      this.getAllUsers();
      this.spinnerService.hide();
      this.toastrService.success("User deleted.", "Success.");
      return;
    },
    (error: any) => {
      this.spinnerService.hide();
      this.toastrService.error("User cannot deleted! Please, try again.", "Error.");
      return;
    })
  }

  // Check user login or not
  private checkUserLoginOrNot(): boolean | undefined {
    let loginUserInfo: UserViewModel = JSON.parse(localStorage.getItem("loginUserInfo")!);

    if (loginUserInfo == null || loginUserInfo == undefined) {
      return false;
    }
    else {
      this._loginUserId = loginUserInfo.id;
      return true;
    }
  }

  onClickUserUpdate(userId: string): void {
    if(userId == undefined || userId == null || userId == "") {
      this.toastrService.warning("User id cannot found! Try again.", "Warning.");
      return;
    }

    this.router.navigate([`/user_edit/${userId}`]);
  }
}