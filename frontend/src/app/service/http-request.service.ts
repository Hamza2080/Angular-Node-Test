import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import { Observable } from "rxjs";
import "rxjs/Rx";

@Injectable()
export class HttpRequestService {
  private apiUrl: string; //apiUrl

  constructor(private http: Http) {
    this.apiUrl = "http://localhost:3000/api/";
  }

  /**
   * @description register new user
   * @input user: object
   * @output res: object
   */
  signup(user) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http
      .post(this.apiUrl + "appusers", JSON.stringify(user), {
        headers: headers
      })
      .map(res => res.json());
  }

  /**
   * @description login user
   * @input user: object
   * @output res: object
   */
  logout(accesstoken) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http
      .post(this.apiUrl + "appusers/logout?access_token=" + accesstoken, {
        headers: headers
      })
      .map(res => res.json());
  }

  /**
   * @description login user
   * @input user: object
   * @output res: object
   */
  login(credential) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http
      .post(this.apiUrl + "appusers/login", JSON.stringify(credential), {
        headers: headers
      })
      .map(res => res.json());
  }

  /**
   * @description updateuserData
   * @input userid : string
   *        user   : object
   * @output res: object
   */
  updateUserData(userId, access_token, user) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    return this.http
      .patch(
        this.apiUrl + "appusers/" + userId + "?access_token=" + access_token,
        JSON.stringify(user),
        {
          headers: headers
        }
      )
      .map(res => res.json());
  }

  /**
   * @description getImageUrlByUserId
   * @input userid : string
   * @output res: string
   */
  getImageUrlByUserId(userId, access_token) {
    return this.http
      .get(
        this.apiUrl +
          "profileImages/" +
          userId +
          "/imageUrlDownload?access_token=" +
          access_token
      )
      .map(res => res.json());
  }

  /**
   * @description getUserById
   * @input userid : string
   * @output res: object
   */
  getUserById(userId, access_token) {
    return this.http
      .get(this.apiUrl + "appusers/" + userId + "?access_token=" + access_token)
      .map(res => res.json());
  }

  /**
   * @description getAllUser
   * @input
   * @output res: object
   */
  getAllUsers(access_token) {
    return this.http
      .get(this.apiUrl + "appusers/getAllUser?access_token=" + access_token)
      .map(res => res.json());
  }
}
