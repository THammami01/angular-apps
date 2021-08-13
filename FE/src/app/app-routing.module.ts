import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeesMgComponent } from './dashboard/employees-mg/employees-mg.component';
import { LeavesMgComponent } from './dashboard/leaves-mg/leaves-mg.component';
import { SubmitNewLeaveComponent } from './dashboard/submit-new-leave/submit-new-leave.component';
import { ViewAllLeavesComponent } from './dashboard/view-all-leaves/view-all-leaves.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: 'employees',
        component: EmployeesMgComponent,
      },
      {
        path: 'leaves',
        component: LeavesMgComponent,
      },
      {
        path: 'submit-new-leave',
        component: SubmitNewLeaveComponent,
      },
      {
        path: 'view-all-leaves',
        component: ViewAllLeavesComponent,
      },
    ],
  },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
