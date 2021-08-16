import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AvtentikacijaService} from "../../storitve/avtentikacija.service";
import {DatabaseService} from "../../storitve/database.service";
import {Blog} from "../../modeli/Blog";
import {switchMap} from "rxjs/operators";

@Component({
  selector: 'app-uredi-blog',
  templateUrl: './uredi-blog.component.html',
  styleUrls: ['./uredi-blog.component.css']
})
export class UrediBlogComponent implements OnInit {

  naslov = "Uredi blog";

  prvotniBlog : Blog = new Blog("","","","","","");

  constructor(private pot: ActivatedRoute,
              private router: Router,
              private avtentikacijaService: AvtentikacijaService,
              private databaseService: DatabaseService
  ) { }

  ngOnInit(): void {
    // najprej preveri, če je uporabnik prijavljen!
    if(!this.avtentikacijaService.jePrijavljen())
      this.router.navigate(['prijava']);
    // pridobi iskani blog
    this.pot.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const id = params.get('blogId');
          console.log(id);
          return this.databaseService.getBlogById(id!);
        })
      ).subscribe((blog: Blog) => {
        this.prvotniBlog = blog;
      // preveri če je trenutno prijavljeni uporabnik avtor bloga!!! ČE NI preusmeri na domačo stran
      this.avtentikacijaService.getUsername()
        .catch(err => console.log(err))
        .then(username => {
          if(username !== this.prvotniBlog.avtor)
            this.router.navigate(['/']);
        });
      });
  }

  urediBlog() {

  }

}
