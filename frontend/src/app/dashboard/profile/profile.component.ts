import {
  Component,
  OnInit,
  NgZone,
  ViewContainerRef,
  ViewChild,
  ElementRef,
  TemplateRef
} from "@angular/core";
import {} from "@types/googlemaps";
import { MapsAPILoader } from "@agm/core";
import { FormBuilder, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { BsModalRef, BsModalService } from "ngx-bootstrap";
import { Router } from "@angular/router";
import { HttpRequestService } from "../../service/http-request.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  lat: number;
  lng: number;
  zoom: any = 8;
  map: any;
  userId: any;

  src_marker: google.maps.Marker;
  updateUserForm: any;
  profileImageUrl: any;
  access_token: string;

  @ViewChild("search")
  public originSearch: ElementRef;
  fileError: string;
  userData: any;

  modalRef: BsModalRef;
  userRole: any;
  marker_map_view: google.maps.Marker;
  map_view: google.maps.Map;
  userAuthenticated : boolean = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private httpService: HttpRequestService,
    private mapsApiLoader: MapsAPILoader,
    private router: Router,
    private ngZone: NgZone,
    vcr: ViewContainerRef
  ) {
    this.updateUserFormInitializer();
    this.userId = JSON.parse(localStorage.getItem("user")).userId;
    this.access_token = JSON.parse(localStorage.getItem("user")).id;
    this.userRole = JSON.parse(localStorage.getItem("user")).userRole;
  }

  /***
   @description: updateuserForminitializer
   **/
  updateUserFormInitializer() {
    this.updateUserForm = this.fb.group({
      dob: ["", [Validators.required]],
      lat: [""],
      lng: [""]
    });
  }

  // get user current location
  public userCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(
          position => {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
            resolve(position);
          },
          error => {
            this.lat = 50;
            this.lng = 50;
            resolve({ lat: this.lat, lng: this.lng });
          }
        );
    });
  }

  /*** 
   @description: submit function on updateUserForm
  **/
  updateUser() {
    this.updateUserForm.controls["lat"].setValue(this.lat);
    this.updateUserForm.controls["lng"].setValue(this.lng);
    this.httpService
      .updateUserData(this.userId, this.access_token, this.updateUserForm.value)
      .subscribe(
        data => {
          this.httpService
            .getUserById(this.userId, this.access_token)
            .subscribe(
              user => {
                this.userData = user;
                this.marker_map_view.setAnimation(10.0);
                this.marker_map_view.setPosition(
                  new google.maps.LatLng(this.userData.lat, this.userData.lng)
                );
                this.map_view.panTo(
                  new google.maps.LatLng(this.userData.lat, this.userData.lng)
                );
              },
              err => console.error(err)
            );
        },
        err => {
          console.error(err);
          // window.scroll(0,0);
          // this.signUpError = true;
          // setTimeout(() => { this.signUpError = false; }, 3000);
        }
      );
  }

  ngOnInit() {
    this.httpService.getUserById(this.userId, this.access_token).subscribe(
      user => {
        this.userAuthenticated = true;
        // map code...
        this.mapsApiLoader.load().then(() => {
          // get user Current Location...
          this.userCurrentLocation().then(position => {
            this.initializeMap()
              .then(map => {
                this.map = map;
                this.autocompletePlaces();
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
                        this.router.navigate(["/../../pages/login"]);
                      } else console.error(err);
                    }
                  );
                //get user data by id
                this.httpService
                  .getUserById(this.userId, this.access_token)
                  .subscribe(
                    user => {
                      this.userData = user;
                      if (this.userData.lat && this.userData.lng) {
                        var coords = {
                          lat: this.userData.lat,
                          lng: this.userData.lng
                        };
                        this.map_view = new google.maps.Map(
                          document.getElementById("map-view"),
                          {
                            zoom: this.zoom,
                            center: coords,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                          }
                        );
                        this.marker_map_view = new google.maps.Marker({
                          position: {
                            lat: this.userData.lat,
                            lng: this.userData.lng
                          },
                          map: this.map_view,
                          draggable: false,
                          animation: google.maps.Animation.DROP,
                          title: "Your Address",
                          icon:
                            "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                        });
                      }
                    },
                    err => {
                      if (err.status == 401) {
                        localStorage.clear();
                        this.router.navigate(["/../../pages/login"]);
                      } else console.error(err);
                    }
                  );
              })
              .catch(error => {
                console.error(error);
              });
          });
        });
      },
      error => {
        if (error.status == 401) {
          localStorage.clear();
          this.router.navigate(["/../../pages/login"]);
        }
      }
    );
  }

  /**
   * map code but due to billing google map not working
   */
  public initializeMap() {
    return new Promise((resolve, reject) => {
      if (this.lat && this.lng) {
        var coords = {
          lat: this.lat,
          lng: this.lng
        };
        var map = new google.maps.Map(document.getElementById("map"), {
          zoom: this.zoom,
          center: coords,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        this.placeMapMarker(map);
        resolve(map);
      } else reject("source location can not identified");
    });
  }

  public placeMapMarker(map) {
    // source marker
    var marker = new google.maps.Marker({
      position: { lat: this.lat, lng: this.lng },
      map: map,
      draggable: true,
      animation: google.maps.Animation.DROP,
      title: "User current location",
      icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
    });

    // circle on current location
    var userLocation = new google.maps.Circle({
      strokeColor: "#0796ef",
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: "#76c2f2",
      fillOpacity: 0.35,
      map: map,
      center: { lat: this.lat, lng: this.lng },
      radius: 500
    });

    //click listener on source marker
    marker.addListener("click", () => {
      this.markerClicked(marker);
    });
    //drag_end event on source marker
    marker.addListener("dragend", () => {
      this.sourceMarkerDragEnd(marker);
    });

    this.src_marker = marker;
  }

  //click event listener on marker
  public markerClicked(marker) {
    if (marker.getAnimation() !== null) {
      marker.setAnimation(null);
    } else {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }
  }

  // source marker drag end event
  public sourceMarkerDragEnd(marker) {
    this.lat = marker.getPosition().lat();
    this.lng = marker.getPosition().lng();
  }

  //autocompleteplaces settings...
  public autocompletePlaces() {
    var autocompleteOrigin = new google.maps.places.Autocomplete(
      this.originSearch.nativeElement
    );

    //origin autocomplete listenera
    autocompleteOrigin.bindTo("bounds", this.map);
    autocompleteOrigin.addListener("place_changed", () => {
      this.ngZone.run(() => {
        let place: google.maps.places.PlaceResult = autocompleteOrigin.getPlace();

        if (place.geometry === undefined || place.geometry === null) return;
        //set latitude, longitude and zoom
        this.lat = place.geometry.location.lat();
        this.lng = place.geometry.location.lng();
        var latlng = new google.maps.LatLng(this.lat, this.lng);
        this.src_marker.setAnimation(10.0);
        this.src_marker.setPosition(latlng);
        this.map.panTo(latlng);
      });
    });
  }

  /**
   * @description file trigger function uploads profile image
   */
  profileImageUpload(fileInput: any) {
    let profileImage = {
      user_image: (document.getElementById("uploadProfile") as HTMLFormElement)
        .files[0]
    };
    this.validateFile(fileInput, profileImage);
  }

  //function checks file validity...
  public validateFile(fileInput, profileImage) {
    // uploadingFiles.file_type
    if (fileInput.target.value.indexOf("/") > 0) {
      //in windows...

      var fileName = fileInput.target.value.substring(
        fileInput.target.value.lastIndexOf("/"),
        fileInput.target.value.length
      );
      var fileExtension = fileName.substring(
        fileName.lastIndexOf("."),
        fileName.length
      );

      if (
        fileExtension == ".jpg" ||
        fileExtension == ".png" ||
        fileExtension == ".jpeg"
      ) {
        //now the file is valid...
        this.uploadFile(profileImage);
      } else this.fileError = "File type must be in jpg/png/jpeg";
    } else if (fileInput.target.value.indexOf("\\") > 0) {
      //in mac or linux...

      var fileName = fileInput.target.value.substring(
        fileInput.target.value.lastIndexOf("\\"),
        fileInput.target.value.length
      );
      var fileExtension = fileName.substring(
        fileName.lastIndexOf("."),
        fileName.length
      );

      if (
        fileExtension == ".jpg" ||
        fileExtension == ".png" ||
        fileExtension == ".jpeg"
      ) {
        //now the file is valid...
        this.uploadFile(profileImage);
      } else this.fileError = "File type must be in jpg/png/jpeg";
    }
  }

  //upload file..
  public uploadFile(profileImage) {
    let formData: FormData = new FormData();
    formData.append("Content-Type", "multipart/form-data");

    formData.append("image", profileImage.user_image);

    this.http
      .post(
        `http://localhost:3000/api/profileImages/user/${
          this.userId
        }/container/image/uploadImage?access_token=${this.access_token}`,
        formData
      )
      .subscribe(
        data => {
          this.fileError = null;
          this.httpService
            .getImageUrlByUserId(this.userId, this.access_token)
            .subscribe(
              url => {
                if (url.image == "File not found")
                  this.profileImageUrl = "../../../assets/imag/avatar.jpg";
                else this.profileImageUrl = url.image.url;
              },
              err => console.error(err)
            );
        },
        error => {
          console.error(error);
          this.fileError = `File not uploaded successfully ${error}`;
        }
      );
  }
}
