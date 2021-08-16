import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {AvtentikacijaService} from "../../storitve/avtentikacija.service";
import {DatabaseService} from "../../storitve/database.service";
import {Blog} from "../../modeli/Blog";
import {switchMap} from "rxjs/operators";
import { API } from 'aws-amplify';

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
          // preveri če uporabnik JE DEJANSKI AVTOR tega bloga!!!
          if(username !== this.prvotniBlog.avtor)
            this.router.navigate(['/']);
        });
      });
  }

  urediBlog() {
    //console.log(this.prvotniBlog);
    const myInit = {
      body: {
        PK: this.prvotniBlog.PK,
        SK: this.prvotniBlog.SK,
        naslov: this.prvotniBlog.naslov,
        vsebina: this.prvotniBlog.vsebina,
        avtor: this.prvotniBlog.avtor
      }, // vneseni podatki!
      headers: {},
    };
    this.databaseService.updateBlogById(myInit)
      .then(res => {
        console.log("USPESNO posodobljen blog");
        this.router.navigate(['blogi/'+this.prvotniBlog.PK]);
      })
      .catch(err => console.log("Napaka pri posodabljanju!! ERR: "+err))
  }

  izbrisiBlog() {
    this.databaseService.deleteBlogById(this.prvotniBlog.avtor,this.prvotniBlog.PK)
      .then(res => {
        console.log("Uspesno izbrisan Blog!!");
        // nazaj na domačo stran!!
        this.router.navigate(['/']);
      })
      .catch(err => console.log("Napaka pri odstranjevanju bloga!!"));
  }

}
