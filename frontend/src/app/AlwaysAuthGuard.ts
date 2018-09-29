import { CanActivate, Router } from "@angular/router";
import { HttpRequestService } from "./service/http-request.service";
import { Injectable } from "@angular/core";

@Injectable()
export class AlwaysAuthGuard implements CanActivate {
  userId: any;
  access_token: any;

  constructor(private httpService: HttpRequestService, private router: Router) {}

  canActivate() {
    if (localStorage.getItem("user")) {
      this.userId = JSON.parse(localStorage.getItem("user")).userId;
      this.access_token = JSON.parse(localStorage.getItem("user")).id;
    }

    if (this.userId && this.access_token) return true;
     else {
      this.router.navigate(["/pages/login"]);
      return false;
    }
  }
}
