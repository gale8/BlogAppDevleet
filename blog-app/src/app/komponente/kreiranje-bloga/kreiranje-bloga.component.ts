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

  praznaPolja = false;

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
    this.praznaPolja = false;
    // filtriranje in preverjanje INPUT-a!!!
    if(this.noviBlog.naslov === "" || this.noviBlog.vsebina === "") {
      this.praznaPolja = true;
    } else {
      this.praznaPolja = false;
      //console.log(this.noviBlog);
      this.databaseService.createNewBlog(this.noviBlog)
        .catch(err => {
          this.praznaPolja = true;
          console.log("Napaka pri kreiranju!! ERR: "+err);
        })
        .then(res => {
          this.praznaPolja = false;
          this.router.navigate([''])
        });
    }
  }

}
