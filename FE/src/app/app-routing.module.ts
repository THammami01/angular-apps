import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddComponent } from './add/add.component';
import { EditComponent } from './edit/edit.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'patients', pathMatch: 'full', redirectTo: 'patients/view-all' },
  { path: 'patients/view-all', component: DashboardComponent },
  { path: 'patients/add', component: AddComponent },
  { path: 'patients/:id/edit', component: EditComponent },
  // { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
  { path: '**', pathMatch: 'full', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
