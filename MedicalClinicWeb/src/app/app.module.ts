import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UserCreateComponent } from './components/user/user-create/user-create.component';
import { LoginComponent } from './components/login/login.component';
import { PatientCreateComponent } from './components/patient/patient-create/patient-create.component';
import { PatientListComponent } from './components/patient/patient-list/patient-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { UpcommingPatientListComponent } from './components/patient/upcomming-patient-list/upcomming-patient-list.component';
import { PatientEditComponent } from './components/patient/patient-edit/patient-edit.component';
import { UserEditComponent } from './components/user/user-edit/user-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    UserListComponent,
    UserCreateComponent,
    LoginComponent,
    PatientCreateComponent,
    PatientListComponent,
    ProfileComponent,
    UpcommingPatientListComponent,
    PatientEditComponent,
    UserEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
