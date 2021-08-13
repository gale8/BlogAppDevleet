import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

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
    slika: null,
    avtor: "Gal Žagar" // TODO trenutno prijavljen uporabnik!!!
  };

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  kreirajBlog() {
    // TODO filtriranje in preverjanje INPUT-a!!!
    console.log(this.noviBlog);
    // TODO posli podatke na streznik
    this.router.navigate(['/']);
  }

}
