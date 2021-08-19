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

  napakaPriRegistraciji = false;
  praznaPolja = false;

  infoPolje = false;

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

    this.praznaPolja = false;
    this.napakaPriRegistraciji = false;

    // TODO filtriranje in preverjanje INPUT-a!!!
    if(this.registracijaPodatki.ime === "" || this.registracijaPodatki.priimek === "" || this.registracijaPodatki.email === "" || this.registracijaPodatki.username === "" || this.registracijaPodatki.geslo === ""){
      this.praznaPolja = true;
    } else {
      console.log(this.registracijaPodatki);
      // poslji podatke na streznik za avtorizacijo s pomocjo SERVICE-a
      this.avtentikacijaService.registracija(username,email,password)
        .then(response => {
          // preveri če je bila registracija uspešna:
          if(response.message && response.code) {
            this.napakaPriRegistraciji = true;
            this.praznaPolja = false;
          } else {
            // uspešna registracija:
            this.router.navigate(['prijava']);
          }
        });
    }
  }

  infoField() {
    this.infoPolje = !this.infoPolje;
  }

}
