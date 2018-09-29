import {
  Component,
  OnInit,
  NgZone,
  ViewContainerRef,
  ElementRef,
  ViewChild
} from "@angular/core";
import {} from "@types/googlemaps";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { MapsAPILoader } from "@agm/core";
import { Router } from "@angular/router";
import { HttpRequestService } from "app/service/http-request.service";
import { PasswordValidation } from "../../customValidator/passwordValidation";

@Component({
  templateUrl: "register.component.html",
  styleUrls: ["register.component.css"]
})
export class RegisterComponent implements OnInit {
  signUpForm: FormGroup;
  private signUpError: boolean = false;
  lat: number;
  lng: number;
  zoom: any = 12;
  map: any;
  src_marker: google.maps.Marker;

  @ViewChild("search")
  public originSearch: ElementRef;
  emailSend: boolean;

  constructor(
    private fb: FormBuilder,
    private httpService: HttpRequestService,
    private router: Router,
    private mapsApiLoader: MapsAPILoader,
    private ngZone: NgZone,
    vcr: ViewContainerRef
  ) {
    this.signUpFormInitializer();
  }

  ngOnInit() {
    // map code...
    this.mapsApiLoader.load().then(() => {
      // get user Current Location...
      this.userCurrentLocation().then(position => {
        this.initializeMap()
          .then(map => {
            this.map = map;
            this.autocompletePlaces();
          })
          .catch(error => {
            console.log(error);
          });
      });
    });
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
   @description: Initialize signUp Form
   **/
  signUpFormInitializer() {
    this.signUpForm = this.fb.group(
      {
        email: [
          "",
          [
            Validators.required,
            Validators.pattern(
              "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
            )
          ]
        ],
        username: ["", [Validators.required]],
        mobile: [
          "",
          [Validators.required, Validators.pattern("[789][0-9]{11}")]
        ],
        dob: ["", [Validators.required]],
        lat: [""],
        lng: [""],
        password: [
          "",
          [
            Validators.required,
            Validators.pattern(
              "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}"
            )
          ]
        ],
        confirmPassword: ["", [Validators.required]]
      },
      {
        validator: PasswordValidation.MatchPassword
      }
    );
  }

  /*** 
   @description: submit function on signUp form
  **/
  submitSignUpForm() {
    this.signUpForm.controls["lat"].setValue(this.lat);
    this.signUpForm.controls["lng"].setValue(this.lng);
    this.httpService.signup(this.signUpForm.value).subscribe(
      user => {
        window.scroll(0, 0);
        this.emailSend = true;
        setTimeout(() => {
          this.emailSend = false;
          this.router.navigate(["/../../pages/login"]);
        }, 3000);
      },
      err => {
        window.scroll(0, 0);
        this.signUpError = true;
        setTimeout(() => {
          this.signUpError = false;
        }, 3000);
      }
    );
  }
}
