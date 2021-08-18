import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Blog} from "../../modeli/Blog";
import {switchMap} from "rxjs/operators";
import {DatabaseService} from "../../storitve/database.service";
import {AvtentikacijaService} from "../../storitve/avtentikacija.service";
import {Komentar} from "../../modeli/Komentar";
import {Auth} from "aws-amplify";

@Component({
  selector: 'app-podrobnosti-bloga',
  templateUrl: './podrobnosti-bloga.component.html',
  styleUrls: ['./podrobnosti-bloga.component.css']
})
export class PodrobnostiBlogaComponent implements OnInit {

  blog : Blog = new Blog("","","","","","");
  jeLastnik = false;
  jePrijavljen = false;

  mainCommentTable : Komentar[] = []; // glavna tabela komentarjev, ki pripadajo blogu!!!

  noviKomentar = {
    PK: "",
    vsebina: "",
    upvotes: 0,
    avtor: ""
  };

  skID = "";

  noviPodKomentar = {
    PK: "",
    vsebina: "",
    upvotes: 0,
    avtor: ""
  };

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
        // PRIDOBI VSE KOMENTARJE BLOGA!!
        this.databaseService.getComments(this.blog.PK)
          .catch()
          .then(comments => {
            console.log(comments);
            this.mainCommentTable = comments
          });
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

  // fun za dodajanje GLAVNEGA komentarja blogu!!!
  async dodajKomentar() {
    // dodaj avtorja
    await this.avtentikacijaService.getUsername().then(username => this.noviKomentar.avtor = username).catch(err => console.log(err));
    this.noviKomentar.PK = this.blog.PK;
    // pridobi JWT zeton
    let jwt = "";
    await Auth.currentSession().then(res => {
      jwt = res.getAccessToken().getJwtToken();
    });

    this.databaseService.createComment(this.noviKomentar)
      .then(comment => {
        console.log(comment);
        // dodaj novi comment v tabelo
        let novi = new Komentar(comment.PK, comment.SK, comment.vsebina, comment.upvotes, comment.avtor, []);
        this.mainCommentTable.unshift(novi);
      }).catch(err => console.log(err));

  }

  async dodajPodKomentar(event: any) {
    // get PK of parent comment!!!
    const pk = event.target.komentarId.value;
    this.noviPodKomentar.PK = pk;
    // dodaj avtorja
    await this.avtentikacijaService.getUsername().then(username => this.noviPodKomentar.avtor = username).catch(err => console.log(err));
    console.log(this.noviPodKomentar);

    this.databaseService.createComment(this.noviPodKomentar)
      .then(comment => {
        console.log(comment);
      }).catch(err => console.log(err));
  }


}
