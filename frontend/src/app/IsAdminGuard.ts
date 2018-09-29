import { CanActivate } from "@angular/router";
import { HttpRequestService } from "./service/http-request.service";
import { Injectable } from "@angular/core";


@Injectable()
export class IsAdminGuard implements CanActivate {
  userId: any;
  access_token: any;

  constructor(private httpService: HttpRequestService) {
    this.userId = JSON.parse(localStorage.getItem("user")).userId;
    this.access_token = JSON.parse(localStorage.getItem("user")).id;
  }

  canActivate() {
    let userId = JSON.parse(localStorage.getItem("user")).userId;
    let access_token = JSON.parse(localStorage.getItem("user")).id;
    let role = JSON.parse(localStorage.getItem("user")).userRole;

    if (userId && access_token && role == "admin") {
        return true;
    } else return false;
  }
}
