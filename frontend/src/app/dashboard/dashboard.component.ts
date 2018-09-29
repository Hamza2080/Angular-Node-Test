import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequestService } from '../service/http-request.service';

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  userId: any;
  access_token: any;

  constructor(private router: Router, private httpService: HttpRequestService) {
    if (localStorage.getItem("user")) {
      this.userId = JSON.parse(localStorage.getItem("user")).userId;
      this.access_token = JSON.parse(localStorage.getItem("user")).id;
    } else {
      localStorage.clear();
      this.router.navigate(["/../../pages/login"]);
    }
  }

  ngOnInit() {
    if (this.userId && this.access_token) {
      this.httpService.getUserById(this.userId, this.access_token).subscribe(
        user => {
          this.router.navigate(["/" + this.router.url]);
        },
        err => {
          localStorage.clear();
          this.router.navigate(["/../../pages/login"]);
        }
      );
    }
  }
}
