import { NgModule } from '@angular/core';
import { Routes,
     RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ProfileComponent } from './profile/profile.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'profile',
    pathMatch : 'full',
  },
  {
    path: '',
    data: {
      title: 'Dashboard'
    },
    children: [
      {
        path: 'profile',
        component: ProfileComponent,
        data: {
          title: 'user profile'
        }
      },
      {
        path: 'admin_view',
        component: AdminDashboardComponent,
        data: {
          title: 'admin view'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
