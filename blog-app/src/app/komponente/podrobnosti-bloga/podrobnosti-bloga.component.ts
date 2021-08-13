import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-podrobnosti-bloga',
  templateUrl: './podrobnosti-bloga.component.html',
  styleUrls: ['./podrobnosti-bloga.component.css']
})
export class PodrobnostiBlogaComponent implements OnInit {

  blogInfo = {
    naslov:"Its CORONA-19 time!!!",
    avtor: "DJ Braitche",
    content: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
  }

  constructor() { }

  ngOnInit(): void {
  }

}
