import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-registracija',
  templateUrl: './registracija.component.html',
  styleUrls: ['./registracija.component.css']
})
export class RegistracijaComponent implements OnInit {

  naslov = "Basic-ish AF Blogs";

  registracijaPodatki = {
    email: "",
    geslo: "",
    ime: "",
    priimek: "",
    username: ""
  };

  constructor() { }

  ngOnInit(): void {
  }

  registracija() {
    // TODO filtriranje in preverjanje INPUT-a!!!
    console.log(this.registracijaPodatki);
    // TODO posli podatke na streznik za avtorizacijo s pomocjo SERVICE-a!!!
  }

}
