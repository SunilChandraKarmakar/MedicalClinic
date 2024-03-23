import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserCreateComponent } from './components/user/user-create/user-create.component';
import { LoginComponent } from './components/login/login.component';
import { PatientCreateComponent } from './components/patient/patient-create/patient-create.component';
import { PatientListComponent } from './components/patient/patient-list/patient-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UpcommingPatientListComponent } from './components/patient/upcomming-patient-list/upcomming-patient-list.component';
import { PatientEditComponent } from './components/patient/patient-edit/patient-edit.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: "full" },
  { path: 'login', component: LoginComponent, pathMatch: "full" }, 
  { path: 'user_list', component: UserListComponent, pathMatch: 'full' },
  { path: 'user_create', component: UserCreateComponent, pathMatch: 'full' },
  { path: 'user_edit/:id', component: UserEditComponent, pathMatch: 'full' },
  { path: 'patient_create', component: PatientCreateComponent, pathMatch: 'full' },
  { path: 'patient_update/:path/:id', component: PatientEditComponent, pathMatch: 'full' },
  { path: 'previous_patient_list', component: PatientListComponent, pathMatch: 'full' },
  { path: 'upcomming_patient_list', component: UpcommingPatientListComponent, pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }