import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserCreateComponent } from './components/user/user-create/user-create.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: "full" },
  // { path: '**', component: LoginComponent, pathMatch: "full" }, 
  { path: 'user-list', component: UserListComponent, pathMatch: 'full' },
  { path: 'user-create', component: UserCreateComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
