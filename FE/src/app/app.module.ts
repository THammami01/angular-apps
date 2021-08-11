import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  NoopAnimationsModule,
  BrowserAnimationsModule,
} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button/';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AppRoutingModule } from './app-routing.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import {
  EmployeesMgComponent,
  AddEmployeeDialog,
  UpdateEmployeeDialog,
  DeleteEmployeeDialog,
} from './dashboard/employees-mg/employees-mg.component';
import { LeavesMgComponent } from './dashboard/leaves-mg/leaves-mg.component';
import { SubmitNewLeaveComponent } from './dashboard/submit-new-leave/submit-new-leave.component';
import { ViewAllLeavesComponent } from './dashboard/view-all-leaves/view-all-leaves.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    PageNotFoundComponent,
    EmployeesMgComponent,
    LeavesMgComponent,
    AddEmployeeDialog,
    UpdateEmployeeDialog,
    DeleteEmployeeDialog,
    SubmitNewLeaveComponent,
    ViewAllLeavesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatTooltipModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatListModule,
    MatTableModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    CommonModule,
    MatSnackBarModule,
    MatStepperModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatButtonToggleModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
