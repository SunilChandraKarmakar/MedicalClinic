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

  // User data source
  users: UserViewModel[] = [];

  constructor(private userService: UserService, private toastrService: ToastrService, private router: Router, 
    private spinnerService: NgxSpinnerService) { }

  ngOnInit() {
    this.getAllUsers();
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
}