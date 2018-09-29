import { NgModule } from "@angular/core";

import { PagesRoutingModule } from "./pages-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AgmCoreModule } from "@agm/core";
import { BsDropdownModule, ModalModule } from "ngx-bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";

@NgModule({
  imports: [
    PagesRoutingModule,
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
  declarations: [LoginComponent, RegisterComponent]
})
export class PagesModule {}
