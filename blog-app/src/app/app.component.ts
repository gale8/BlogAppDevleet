import {AfterViewChecked, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { Auth } from 'aws-amplify';
import {Router} from "@angular/router";
import {AvtentikacijaService} from "./storitve/avtentikacija.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private router: Router, private avtentikacijaService: AvtentikacijaService) {}

  ngOnInit(): void {
  }

}
