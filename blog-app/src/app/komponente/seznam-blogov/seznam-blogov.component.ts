import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-seznam-blogov',
  templateUrl: './seznam-blogov.component.html',
  styleUrls: ['./seznam-blogov.component.css']
})
export class SeznamBlogovComponent implements OnInit {

  tabelaBlogov = [
    {naslov:"Its CORONA-19 time!!!", avtor: "DJ Braitche", content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."},
    {naslov:"What a hard life it is!", avtor: "Aljaž 'CJ' Sitar", content: "Opposed to using 'Content here, content here', making it look like readable English."},
    {naslov:"Let's GET a JOB", avtor: "Gal Žagar", content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."},
    {naslov:"Never gonna give you up", avtor: "Nik Gabritch", content: "The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."}
  ];

  constructor() { }

  ngOnInit(): void {
    this.jePrijavljen();
  }

  async jePrijavljen() {
    try {
      let currentUser = await Auth.currentUserInfo();
      console.log(currentUser);
    } catch (err) {
      console.log("Err retreiving current user's info: "+err);
    }
  }
}
