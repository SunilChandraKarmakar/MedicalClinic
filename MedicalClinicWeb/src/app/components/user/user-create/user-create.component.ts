import { Component, OnInit } from '@angular/core';
import { UserUpsertViewModel } from 'src/app/models/user/user-upsert-view-model';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})

export class UserCreateComponent implements OnInit {

  // User create model
  userCreateModel: UserUpsertViewModel = new UserUpsertViewModel();

  constructor() { }

  ngOnInit() {
  }

}