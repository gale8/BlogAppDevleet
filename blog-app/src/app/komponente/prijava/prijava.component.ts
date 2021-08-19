import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {AvtentikacijaService} from "../../storitve/avtentikacija.service";

@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.css']
})
export class PrijavaComponent implements OnInit {

  naslov = "Basic-ish AF Blogs";

  prijavaPodatki = {
    username: "",
    geslo: ""
  };

  praznaPolja = false;
  napakaPriPrijavi = false;

  infoPolje = false;


  constructor(private router: Router,
              private avtentikacijaService: AvtentikacijaService
  ) { }

  ngOnInit(): void {
    // preveri če je uporabnik prijavljen --> preusmeri na glavno stran če je
    this.avtentikacijaService.jePrijavljen()
      .catch()
      .then(res => {
        if(res) this.router.navigate(['/']);
      });
  }


  async prijava() {


    this.praznaPolja = false;
    this.napakaPriPrijavi = false;
    let username = this.prijavaPodatki.username;
    let password = this.prijavaPodatki.geslo;
    // filtriranje in preverjanje INPUT-a!!!
    if(username === "" || password === ""){
      this.praznaPolja = true;
    }else {
      // posli podatke na streznik za avtorizacijo s pomocjo SERVICE-a
      this.avtentikacijaService.prijava(username,password)
        .then(response => {
          // poglej če je bila prijava uspešna ali ne!!
          if(response.code && response.message){
            this.napakaPriPrijavi = true;
            this.praznaPolja = false;
          } else {
            this.napakaPriPrijavi = false;
            this.praznaPolja = false;
            this.router.navigate(["/"]).then(() => {
              window.location.reload();
            });
          }
        });
    }
  }
  // funkcija za TOGGLE info
  infoField() {
    this.infoPolje = !this.infoPolje;
  }

}
