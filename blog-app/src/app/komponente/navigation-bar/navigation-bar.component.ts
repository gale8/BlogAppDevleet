import {Component, OnInit, SimpleChanges} from '@angular/core';
import {Router} from "@angular/router";
import {AvtentikacijaService} from "../../storitve/avtentikacija.service";

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.css']
})
export class NavigationBarComponent implements OnInit {
  title = 'blog-app';
  prijavljen = false;
  username = "";

  constructor(private router: Router, private avtentikacijaService: AvtentikacijaService) {}

  ngOnInit(): void {
    //console.log("NAVIGATION INIT");
    this.getPrijavljen();
  }

  async odjava() {
    this.avtentikacijaService.odjava()
      .catch()
      .then(rez =>{
        this.prijavljen = false;
        this.router.navigate(['prijava'])
      });
  }

  async getPrijavljen() {
    await this.avtentikacijaService.jePrijavljen()
      .then(res => {
        //console.log("get je PRIJAVLJEN: ");
        this.avtentikacijaService.getUsername().then(username => this.username = username);
        this.prijavljen = res;
      });
  }

  jePrijavljen() {
    return this.prijavljen;
  }
}
