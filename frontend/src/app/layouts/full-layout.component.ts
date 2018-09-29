import { Component, OnInit } from "@angular/core";
import { HttpRequestService } from "../service/http-request.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "./full-layout.component.html"
})
export class FullLayoutComponent implements OnInit {
  public disabled = false;
  public status: { isopen: boolean } = { isopen: false };
  access_token: any;
  userRole: any;
  userId: any;
  profileImageUrl: string;
  user: any;

  public toggled(open: boolean): void {
    console.log("Dropdown is now: ", open);
  }

  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }
  ngOnInit(): void {

    //get user image by userId
    this.httpService
      .getImageUrlByUserId(this.userId, this.access_token)
      .subscribe(
        url => {
          if (url.image == "File not found")
            this.profileImageUrl = "../../../assets/img/avatar.jpg";
          else this.profileImageUrl = url.image.url;
        },
        err => {
          if (err.status == 401 || err.status == 0) {
            localStorage.clear();
            this.router.navigate(["/../pages/login"]);
          } else console.error(err);
        }
      );

      //get user detail by id
      this.httpService.getUserById (this.userId, this.access_token)
      .subscribe(
        user => {
          this.user = user;
        },
        err => {
          if (err.status == 401 || err.status == 0) {
            localStorage.clear();
            this.router.navigate(["/../pages/login"]);
          } else console.error(err);
        }
      );
  }

  constructor(private httpService: HttpRequestService, private router: Router) {
    if (JSON.parse(localStorage.getItem("user")))
      this.access_token = JSON.parse(localStorage.getItem("user")).id;
    this.userId = JSON.parse(localStorage.getItem("user")).userId;
    this.userRole = JSON.parse(localStorage.getItem("user")).userRole;
  }

  //logout function
  logout() {
    if (this.access_token) {
      this.httpService.logout(this.access_token).subscribe(res => {
        localStorage.clear();
        this.router.navigate(["/../../pages/login"]);
      });
    } else {
      localStorage.clear();
      this.router.navigate(["/../../pages/login"]);
    }
  }
}
