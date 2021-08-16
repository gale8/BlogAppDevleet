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
}
