import { NgModule } from "@angular/core";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";

import { DashboardComponent } from "./dashboard.component";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { ModalModule } from "ngx-bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { AgmCoreModule } from "@agm/core";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";
import { ProfileComponent } from "./profile/profile.component";

@NgModule({
  imports: [
    DashboardRoutingModule,
    BsDropdownModule,
    ReactiveFormsModule,
    CommonModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    HttpClientModule,
    /*
    agm maps for angular...
    */
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyCdRjEKrzYALbcgy8UqardJa0n54Lml3XU",
      libraries: ["geometry", "places"]
    })
  ],
  declarations: [DashboardComponent, AdminDashboardComponent, ProfileComponent]
})
export class DashboardModule {}
