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

  createNewBlog(blog: any) {
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

  updateBlogById(initParams: any) {

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
}
