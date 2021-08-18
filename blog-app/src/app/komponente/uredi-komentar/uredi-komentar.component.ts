import { Component, OnInit } from '@angular/core';
import { Auth, API } from 'aws-amplify';
import {ActivatedRoute, ParamMap, Params, Router} from "@angular/router";
import {AvtentikacijaService} from "../../storitve/avtentikacija.service";
import {DatabaseService} from "../../storitve/database.service";
import {switchMap} from "rxjs/operators";
import {Komentar} from "../../modeli/Komentar";

@Component({
  selector: 'app-uredi-komentar',
  templateUrl: './uredi-komentar.component.html',
  styleUrls: ['./uredi-komentar.component.css']
})
export class UrediKomentarComponent implements OnInit {

  naslov = "Uredi komentar";

  prvotniKomentar = new Komentar("","","",0,"",[]);

  constructor(private router: Router,
              private avtentikacijaService: AvtentikacijaService,
              private databaseService: DatabaseService,
              private pot: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // najprej preveri, če je uporabnik prijavljen!
    if(!this.avtentikacijaService.jePrijavljen())
      this.router.navigate(['prijava']);

    // pridobi komentar iz pb!
    this.pot.paramMap
      .pipe(
        switchMap( (params: ParamMap) => {
          const param = params.get("komentarId")?.split("COMMENT#")!;
          var pk = "";
          var sk = "";
          if(param.length > 2){
            pk = "COMMENT%23"+param[1];
            sk = "COMMENT%23"+param[2];
          }else {
            pk = param[0].split("#")[0]+"%23"+param[0].split("#")[1];
            sk = "COMMENT%23"+param[1];
          }
          return this.databaseService.getCommentById(pk,sk);
        })
      ).subscribe(comment => {
      console.log(comment);
      this.prvotniKomentar = comment;
        this.avtentikacijaService.getUsername()
          .catch(err => console.log(err))
          .then(username => {
            // preveri če uporabnik JE DEJANSKI AVTOR tega bloga!!!
            if(username !== this.prvotniKomentar.avtor)
              this.router.navigate(['/']);
          });
    });

  }

  urediKomentar() {
    // posodobi blog
    this.databaseService.updateCommentById(this.prvotniKomentar)
      .catch(err => console.log(err))
      .then(res => {
        this.router.navigate(['/']);
      });
  }

  izbrisiKomentar() {

  }

}
