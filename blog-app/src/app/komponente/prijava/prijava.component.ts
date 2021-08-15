import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';
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
    email: "",
    geslo: ""
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


  async prijava() {
    let username = this.prijavaPodatki.email;
    let password = this.prijavaPodatki.geslo;
    // TODO filtriranje in preverjanje INPUT-a!!!
    console.log(this.prijavaPodatki.email+" || "+this.prijavaPodatki.geslo);

    // posli podatke na streznik za avtorizacijo s pomocjo SERVICE-a
    this.avtentikacijaService.prijava(username,password)
      .catch(err => console.log("Napaka pri prijavi!!"))
      .then(uporabnik => this.router.navigate(["/"]));

  }

}
