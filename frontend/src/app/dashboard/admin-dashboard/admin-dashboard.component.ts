import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpRequestService } from "../../service/http-request.service";
import {} from "@types/googlemaps";
import { MapsAPILoader } from "@agm/core";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"]
})
export class AdminDashboardComponent implements OnInit {
  access_token: any;
  usersArr: any;
  userId: any;
  zoom: any = 5;

  constructor(
    private httpService: HttpRequestService,
    private router: Router,
    private mapsApiLoader: MapsAPILoader
  ) {
    this.userId = JSON.parse(localStorage.getItem("user")).userId;
    this.access_token = JSON.parse(localStorage.getItem("user")).id;
  }

  ngOnInit() {
    // map code...
    this.mapsApiLoader.load().then(() => {
      var coords = {
        lat: 50,
        lng: 50
      };
      var map = new google.maps.Map(document.getElementById("map"), {
        zoom: this.zoom,
        center: coords,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });

      this.getAllUsers(map);
    });
  }

  //getAllUsers function
  getAllUsers(map) {
    this.httpService.getAllUsers(this.access_token).subscribe(
      data => {
        this.usersArr = data;
        if (this.usersArr.user[0].id == this.userId)
          this.usersArr.user.splice(0, 1);

        // set multiple marker
        for (var i = 0; i < this.usersArr.user.length; i++) {
          if (i == 0)
            map.panTo(
              new google.maps.LatLng(
                this.usersArr.user[0].lat,
                this.usersArr.user[0].lng
              )
            );

          // init markers
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(
              this.usersArr.user[i].lat,
              this.usersArr.user[i].lng
            ),
            map: map,
            title: this.usersArr.user[i].username + " location"
          });

          marker["content"] = `username : ${
            this.usersArr.user[i].username
          }  <br /> <hr /> email : ${this.usersArr.user[i].email}`;

          // process multiple info windows
          (function(marker, i) {
            // add click event
            google.maps.event.addListener(marker, "click", function() {
              let infowindow = new google.maps.InfoWindow({
                content: marker["content"]
              });
              infowindow.open(map, marker);
            });
          })(marker, i);
        }
      },
      error => {
        localStorage.clear();
        this.router.navigate(["../../pages/login"]);
      }
    );
  }

  //logout function
  logout() {
    this.httpService.logout(this.access_token).subscribe(res => {
      localStorage.clear();
      this.router.navigate(["../../pages/login"]);
    });
  }
}
