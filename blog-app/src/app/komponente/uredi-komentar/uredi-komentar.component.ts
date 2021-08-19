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

  prvotniKomentar = new Komentar("","","",[],"",[]);

  praznaPolja = false;
  napakaPriVnosu = false;

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
    this.praznaPolja = false;
    this.napakaPriVnosu = false;
    // filtritraj vnos:
    if(this.prvotniKomentar.vsebina === "") {
      this.praznaPolja = true;
    } else {
      // posodobi komentar
      this.databaseService.updateCommentById(this.prvotniKomentar)
        .catch(err => {
          console.log(err);
          this.napakaPriVnosu = true;
          this.praznaPolja = false;
        })
        .then(res => {
          this.praznaPolja = false;
          this.napakaPriVnosu = false;
          this.router.navigate(['/']);
        });
    }
  }

  async izbrisiKomentar() {
    // pridobi JWT zeton
    let jwt = "";
    await Auth.currentSession().then(res => { jwt = res.getAccessToken().getJwtToken(); });

    this.prvotniKomentar.komentarji = [];
    this.databaseService.getCommentChain([this.prvotniKomentar])
      .catch(err => console.log(err))
      .then(res => {
        var commentChain = res as Komentar[];
        // izbrisi komentarje ki so v vrnjeni tabeli!!
        this.databaseService.deleteComments(commentChain,jwt,commentChain[0].avtor)
          .catch(err => console.log(err))
          .then(res => {
            console.log("Uspesno izbrisan comment chain!");
            this.router.navigate(["/"]);
          });
      });
  }

}
