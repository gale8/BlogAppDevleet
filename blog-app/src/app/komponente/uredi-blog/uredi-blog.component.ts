import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-uredi-blog',
  templateUrl: './uredi-blog.component.html',
  styleUrls: ['./uredi-blog.component.css']
})
export class UrediBlogComponent implements OnInit {

  naslov = "Uredi blog";

  prvotniBlog = {
    naslov: "This was my World.",
    vsebina: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    slika: null,
    avtor: "Gal Žagar" // TODO trenutno prijavljen uporabnik!!!
  };

  constructor() { }

  ngOnInit(): void {
  }

  urediBlog() {

  }

}
