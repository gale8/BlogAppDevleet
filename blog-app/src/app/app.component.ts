import {AfterViewChecked, Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { Auth } from 'aws-amplify';
import {Router} from "@angular/router";
import {AvtentikacijaService} from "./storitve/avtentikacija.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges{
  title = 'blog-app';
  prijavljen = false;

  constructor(private router: Router, private avtentikacijaService: AvtentikacijaService) {}

  ngOnInit(): void {
    this.jePrijavljen();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.jePrijavljen();
  }

  async odjava() {
    this.avtentikacijaService.odjava()
      .catch()
      .then(rez =>{
        this.prijavljen = false;
        this.router.navigate(['prijava'])
      });
  }

  async jePrijavljen(){
    this.avtentikacijaService.jePrijavljen()
      .catch()
      .then(res => {
        this.prijavljen = res;
      });
  }
}
