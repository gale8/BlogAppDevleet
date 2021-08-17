import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Blog} from "../../modeli/Blog";
import {switchMap} from "rxjs/operators";
import {DatabaseService} from "../../storitve/database.service";
import {AvtentikacijaService} from "../../storitve/avtentikacija.service";

@Component({
  selector: 'app-podrobnosti-bloga',
  templateUrl: './podrobnosti-bloga.component.html',
  styleUrls: ['./podrobnosti-bloga.component.css']
})
export class PodrobnostiBlogaComponent implements OnInit {

  blog : Blog = new Blog("","","","","","");
  jeLastnik = false;
  jePrijavljen = false;

  komentarji = [
    {vsebina: "To je en komentar.", datum: "17.8.2021", avtor: "gale8"},
    {vsebina: "Njusss.", datum: "11.8.2021", avtor: "andrej"},
    {vsebina: "Baje model, kr neki basaš!", datum: "15.8.2021", avtor: "gale8"},
    {vsebina: "Ja pa ja kreten!!", datum: "17.8.2021", avtor: "andrej"}
  ];

  constructor(private pot: ActivatedRoute,
              private databaseService: DatabaseService,
              private avtentikacijaService: AvtentikacijaService,
              private router: Router
  ) { }

  ngOnInit(): void {

    this.avtentikacijaService.jePrijavljen()
      .then(res => this.jePrijavljen = res).catch(err => this.router.navigate(['/']));

    // pridobi BLOG z id-jem blogId
    this.pot.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const id = params.get('blogId');
          console.log(id);
          return this.databaseService.getBlogById(id!);
        }))
      .subscribe((blog: Blog) => {
        this.blog = blog;
        console.log(blog);
        // preveri če je trenutno prijavljeni uporabnik avtor bloga!!!
        this.avtentikacijaService.getUsername()
          .catch(err => console.log(err))
          .then(username => {
            if(username === blog.avtor)
              this.jeLastnik = true;
          });
      });
  }

  urediBlog() {
    if(this.jeLastnik)
      this.router.navigate(['urediBlog/'+this.blog.PK]);
    else
      console.log("Akcija onemogočena! Nisi lastnik bloga!!!");
  }

  dodajKomentar() {

  }


}
