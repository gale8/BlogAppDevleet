import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { API } from 'aws-amplify';
import {AvtentikacijaService} from "../../storitve/avtentikacija.service";
import {DatabaseService} from "../../storitve/database.service";

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

  constructor(private router: Router,
              private avtentikacijaService: AvtentikacijaService,
              private databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    // preveri ce je uporabnik prijavljen
    this.avtentikacijaService.jePrijavljen().then(res => {
      if(!res) {
        this.router.navigate(['/']);
      }
    });

    var date = new Date();
    var datum = date.getDate()+"."+(date.getMonth()+1)+"."+date.getFullYear();
    this.noviBlog.datum = datum;

    this.avtentikacijaService.getUsername().catch()
      .then(user => this.noviBlog["avtor"] = user);

  }

  kreirajBlog() {
    // TODO filtriranje in preverjanje INPUT-a!!!
    console.log(this.noviBlog);
    this.databaseService.createNewBlog(this.noviBlog)
      .catch(err => console.log("Napaka pri kreiranju!! ERR: "+err))
      .then(res => this.router.navigate(['']))
  }

}
