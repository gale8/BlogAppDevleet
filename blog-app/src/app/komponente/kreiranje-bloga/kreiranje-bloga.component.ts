import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { API } from 'aws-amplify';
import {AvtentikacijaService} from "../../storitve/avtentikacija.service";

@Component({
  selector: 'app-kreiranje-bloga',
  templateUrl: './kreiranje-bloga.component.html',
  styleUrls: ['./kreiranje-bloga.component.css']
})
export class KreiranjeBlogaComponent implements OnInit {

  naslov = "Kreiraj blog";

  noviBlog = {
    naslov: "",
    vsebina: "",
    datum: "",
    avtor: "" // trenutno prijavljen uporabnik!!!
  };

  constructor(private router: Router,  private avtentikacijaService: AvtentikacijaService) { }

  ngOnInit(): void {
    // preveri ce je uporabnik prijavljen
    if(!this.avtentikacijaService.jePrijavljen())
      this.router.navigate(['/']);

    var date = new Date();
    var datum = date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
    this.noviBlog.datum = datum;

    this.avtentikacijaService.getUsername().catch()
      .then(user => this.noviBlog["avtor"] = user);

  }

  kreirajBlog() {
    // TODO filtriranje in preverjanje INPUT-a!!!
    console.log(this.noviBlog);
    // posli podatke na streznik
    const myInit = {
      body: this.noviBlog, // vneseni podatki!
      headers: {},
    };
    API.post("blogAppApi","/blogs",myInit)
      .then(response => {
        console.log(response);
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
          .then(res => this.router.navigate(['/']))
          .catch(error => console.log(error.response));
    }).catch(error => {
        console.log(error.response);
    });
  }

}
