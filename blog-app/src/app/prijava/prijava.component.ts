import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

  prijava() {
    // TODO filtriranje in preverjanje INPUT-a!!!
    console.log(this.prijavaPodatki.email+" || "+this.prijavaPodatki.geslo);
    // TODO posli podatke na streznik za avtorizacijo s pomocjo SERVICE-a!!!
  }

}
