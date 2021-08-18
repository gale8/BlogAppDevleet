import { Injectable } from '@angular/core';
import { API } from 'aws-amplify';
import {Blog} from "../modeli/Blog";
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  getBlogi() : Promise<any>{
    const myInit = {
      headers: {},
      response: true,
    };
    return API.get("blogAppApi","/blogs",myInit)
      .then(results => results.data)
      .catch(err => console.log(err));
  }

  getBlogById(id: string) : Promise<any> {
    const myInit = {
      headers: {},
      response: true,
    };
    return API.get("blogAppApi","/blogs/object/"+id.split("#")[1]+"/"+id.split("#")[1],myInit)
      .then(results => results.data)
      .catch(err => console.log(err));
  }

  createNewBlog(blog: any) : Promise<any> {
    // posli podatke na streznik
    const myInit = {
      body: blog, // vneseni podatki!
      headers: {},
    };
    return API.post("blogAppApi","/blogs",myInit)
      .then(response => {
        // kreiraj še en vnos samo z BLOG ID:
        var blog = {
          PK: response.data.SK,
          naslov: response.data.naslov,
          vsebina: response.data.vsebina,
          datum: response.data.datum,
          avtor: response.data.avtor
        };
        myInit.body = blog;
        API.post("blogAppApi","/blogs", myInit)
          .then(res => console.log(res))
          .catch(error => console.log(error.response));
      }).catch(error => {
      console.log(error.response);
    });
  }

  updateBlogById(initParams: any) : Promise<any> {

    return API.put("blogAppApi","/blogs",initParams)
      .then(response => {
        console.log(response);
        // kreiraj še en vnos samo z BLOG ID:
        initParams.body["avtor"] = "";
        API.put("blogAppApi","/blogs", initParams)
          .then()
          .catch(error => console.log(error.response));
      }).catch(error => {
      console.log(error.response);
    });
  }

  deleteBlogById(username: string, idBlog: string) : Promise<any> {
    const myInit = {
      headers: {},
      body: {
        izbrisiAvtorja: ""
      }
    };
    return API.del("blogAppApi","/blogs/object/"+idBlog.split("#")[1]+"/"+idBlog.split("#")[1],myInit)
      .then(res => {
        // izbriši še en zapis
        console.log("USPESNO IZBRISAN BLOG BLOG");
        myInit.body.izbrisiAvtorja = username;
        API.del("blogAppApi","/blogs/object/"+username+"/"+idBlog.split("#")[1],myInit)
          .then(res => console.log("USPESNO IZBRISAN USER BLOG"))
          .catch(error => {
            console.log(error.response);
          });
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  /* ------------------- */
  /*     KOMENTARJI      */
  /* ------------------- */

  createComment(comment: any, jwt: any) : Promise<any> {
    //console.log(jwt);
    // posli podatke na streznik
    const myInit = {
      body: comment, // vneseni podatki!
      headers: {
        //"X-Api-Key": jwt
      },
    };
    return API.post("blogAppApi","/comments",myInit)
      .then(response => {
        console.log(response);
        return response.data
      }).catch(error => {
        console.log(error.response);
      });
  }
}
