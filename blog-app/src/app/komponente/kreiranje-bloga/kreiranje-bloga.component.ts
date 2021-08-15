import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { API } from 'aws-amplify';

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
    //avtor: "Gal Žagar" // TODO trenutno prijavljen uporabnik!!!
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
    var date = new Date();
    var datum = date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
    this.noviBlog.datum = datum;
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
      // Add your code here
    }).catch(error => {
        console.log(error.response);
      });
    this.router.navigate(['/']);
  }

}
