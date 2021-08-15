import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
import {Router} from "@angular/router";
import {AvtentikacijaService} from "../../storitve/avtentikacija.service";

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

  constructor(private router: Router, private avtentikacijaService: AvtentikacijaService) { }

  ngOnInit(): void {
    // preveri če je uporabnik prijavljen --> preusmeri na glavno stran če je
    this.avtentikacijaService.jePrijavljen()
      .catch()
      .then(res => {
        if(res) this.router.navigate(['/']);
      });
  }

  async registracija() {
    let username = this.registracijaPodatki.username;
    let password = this.registracijaPodatki.geslo;
    let email = this.registracijaPodatki.email;
    // TODO filtriranje in preverjanje INPUT-a!!!
    console.log(this.registracijaPodatki);
    // poslji podatke na streznik za avtorizacijo s pomocjo SERVICE-a
    this.avtentikacijaService.registracija(username,email,password)
      .catch()
      .then(user => this.router.navigate(['prijava']));
  }

}
