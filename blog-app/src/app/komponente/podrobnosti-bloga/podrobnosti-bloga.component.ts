import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Blog} from "../../modeli/Blog";
import {switchMap} from "rxjs/operators";
import {DatabaseService} from "../../storitve/database.service";
import {AvtentikacijaService} from "../../storitve/avtentikacija.service";
import {Komentar} from "../../modeli/Komentar";
import {Auth} from "aws-amplify";
import {main} from "@angular/compiler-cli/src/main";

@Component({
  selector: 'app-podrobnosti-bloga',
  templateUrl: './podrobnosti-bloga.component.html',
  styleUrls: ['./podrobnosti-bloga.component.css']
})
export class PodrobnostiBlogaComponent implements OnInit {

  blog : Blog = new Blog("","","","","","");
  jeLastnik = false;
  jePrijavljen = false;
  trenutniPrijavljen = "";

  mainCommentTable : Komentar[] = []; // glavna tabela komentarjev, ki pripadajo blogu!!!

  noviKomentar = {
    PK: "",
    vsebina: "",
    upvotes: [],
    avtor: ""
  };

  skID = "";

  noviPodKomentar = {
    PK: "",
    vsebina: "",
    upvotes: [],
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
          //console.log(id);
          return this.databaseService.getBlogById(id!);
        }))
      .subscribe((blog: Blog) => {
        this.blog = blog;
        //console.log(blog);
        // PRIDOBI VSE KOMENTARJE BLOGA!!
        this.databaseService.getComments(this.blog.PK)
          .catch()
          .then(comments => {
            //console.log(comments);
            this.mainCommentTable = comments
          });
        // preveri če je trenutno prijavljeni uporabnik avtor bloga!!!
        this.avtentikacijaService.getUsername()
          .catch(err => console.log(err))
          .then(username => {
            this.trenutniPrijavljen = username as string;
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

    this.databaseService.createComment(this.noviKomentar)
      .then(comment => {
        //console.log(comment);
        // dodaj novi comment v tabelo
        let novi = new Komentar(comment.PK, comment.SK, comment.vsebina, comment.upvotes, comment.avtor, []);
        this.mainCommentTable.push(novi);
      }).catch(err => console.log(err));

  }

  // fun za dodajanja KOMENTARJA nekemu KOMENTARJU!
  async dodajPodKomentar(event: any) {
    // get PK of parent comment!!!
    const pk = event.target.komentarId.value;
    this.noviPodKomentar.PK = pk;
    // dodaj avtorja
    await this.avtentikacijaService.getUsername().then(username => this.noviPodKomentar.avtor = username).catch(err => console.log(err));
    //console.log(this.noviPodKomentar);

    this.databaseService.createComment(this.noviPodKomentar)
      .then(comment => {
        this.noviPodKomentar.vsebina = "";
        this.databaseService.addCommentToTab(comment,comment.PK,this.mainCommentTable);
      }).catch(err => console.log(err));
  }

  upvote(pk:string, sk:string) {
    var PK = pk.split("#")[0]+"%23"+pk.split("#")[1];
    var SK = sk.split("#")[0]+"%23"+sk.split("#")[1];

    this.glasuj(PK,SK,1);
  }

  downvote(pk:string, sk:string) {
    var PK = pk.split("#")[0]+"%23"+pk.split("#")[1];
    var SK = sk.split("#")[0]+"%23"+sk.split("#")[1];

    this.glasuj(PK,SK,-1);
  }

  glasuj(PK: string, SK: string, glas: number) {
    var jeGlasoval = false;
    // get comment
    this.databaseService.getCommentById(PK,SK)
      .catch(err => console.log(err))
      .then(res => {
        var komentar = res as Komentar;
        // poglej če je avtor že upvote-al ta komentar!
        for (var i = 0; i<komentar.upvotes.length; i++) {
          var vote = komentar.upvotes[i];
          if(vote.avtor == this.trenutniPrijavljen && vote.vote == 1){
            jeGlasoval = true;
            var novi = {
              avtor: vote.avtor,
              vote: 0
            };
            // odstrani element
            komentar.upvotes.splice(i,i+1);
            komentar.upvotes.push(novi);
            break;
          }
        }
        if(!jeGlasoval) {
          var noviGlas = {
            avtor: this.trenutniPrijavljen,
            vote: glas
          };
          // dodaj glas če oseba še ni glasovala!
          komentar.upvotes.push(noviGlas);
          console.log(komentar.upvotes)
        }
        // UPDATE votes table!
        this.databaseService.updateCommentVote(komentar)
          .catch(err => console.log(err))
          .then(res => {
            // PRIDOBI VSE KOMENTARJE BLOGA!!
            this.databaseService.getComments(this.blog.PK)
              .catch()
              .then(comments => {
                //console.log(comments);
                this.mainCommentTable = comments
              });
          });
      });
  }


  // fun izracuna st. glasov za VSAK komentar!!
  vrniStGlasov(votesTab: any[]) {
    var vsotaGlasov = 0;
    for (var i = 0; i<votesTab.length; i++) {
      vsotaGlasov += votesTab[i].vote;
    }
    return vsotaGlasov;
  }


}
