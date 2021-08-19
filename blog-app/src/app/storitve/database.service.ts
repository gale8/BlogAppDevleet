import { Injectable } from '@angular/core';
import {API, Auth} from 'aws-amplify';
import {Blog} from "../modeli/Blog";
import {Komentar} from "../modeli/Komentar";
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  getBlogi() : Promise<any>{
    const myInit = {
      headers: {},
      response: true,
    };
    return API.get("blogAppApi","/blogs",myInit)
      .then(results => results.data)
      .catch(err => console.log(err));
  }

  getBlogById(id: string) : Promise<any> {
    const myInit = {
      headers: {},
      response: true,
    };
    return API.get("blogAppApi","/blogs/object/"+id.split("#")[1]+"/"+id.split("#")[1],myInit)
      .then(results => results.data)
      .catch(err => console.log(err));
  }

  createNewBlog(blog: any) : Promise<any> {
    // posli podatke na streznik
    const myInit = {
      body: blog, // vneseni podatki!
      headers: {},
    };
    return API.post("blogAppApi","/blogs",myInit)
      .then(response => {
        // kreiraj še en vnos samo z BLOG ID:
        var blog = {
          PK: response.data.SK,
          naslov: response.data.naslov,
          vsebina: response.data.vsebina,
          datum: response.data.datum,
          avtor: response.data.avtor
        };
        myInit.body = blog;
        API.post("blogAppApi","/blogs", myInit)
          .then(res => console.log(res))
          .catch(error => console.log(error.response));
      }).catch(error => {
      console.log(error.response);
    });
  }

  updateBlogById(initParams: any) : Promise<any> {

    return API.put("blogAppApi","/blogs",initParams)
      .then(response => {
        console.log(response);
        // kreiraj še en vnos samo z BLOG ID:
        initParams.body["blog"] = false;
        API.put("blogAppApi","/blogs", initParams)
          .then( response => response)
          .catch(error => console.log(error.response));
      }).catch(error => {
      console.log(error.response);
    });
  }

  async deleteBlogById(username: string, idBlog: string) : Promise<any> {
    // pridobi JWT zeton
    let jwt = "";
    await Auth.currentSession().then(res => { jwt = res.getAccessToken().getJwtToken(); });

    const myInit = {
      headers: {
        "X-Api-Key": jwt
      },
      body: {
        avtor: username,
        blog: true
      }
    };
    return API.del("blogAppApi","/blogs/object/"+idBlog.split("#")[1]+"/"+idBlog.split("#")[1],myInit)
      .then(res => {
        console.log(res);
        // izbriši še en zapis
        myInit.body.blog = false;
        API.del("blogAppApi","/blogs/object/"+username+"/"+idBlog.split("#")[1],myInit)
          .then(res => console.log(res))
          .catch(error => {
            console.log(error.response);
          });
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  /* ------------------- */
  /*     KOMENTARJI      */
  /* ------------------- */

  async getComments(blogId: string) : Promise<any> {
    const myInit = {
      headers: {},
      response: true
    };

    let vsiKomentarji : Komentar[] = [];

    await API.get("blogAppApi","/comments/BLOG%23"+blogId.split("#")[1],myInit)
      .then(res => {
        var comments = res.data;
        // dodaj glevne komentarje v tabelo!!
        for(var i = 0; i<comments.length; i++) {
          vsiKomentarji[i] = new Komentar(comments[i].PK,comments[i].SK,comments[i].vsebina,comments[i].upvotes,comments[i].avtor,[]);
        }
        this.getAllComments(vsiKomentarji,comments);
      })
      .catch(err => err.response);

    return vsiKomentarji;
  }
  // rekurzivna funkcija za pridobivanje VSEH komentarjev bloga!!
  async getAllComments(glavnaTabKomentarjev: any[], commTab: any[]) : Promise<any[]> {
    if(commTab == null) return [];
    else {
      for (var i = 0; i<commTab.length; i++){
        const myInit = {
          headers: {},
          response: true
        };
        //console.log(commTab[i].SK);
        await API.get("blogAppApi","/comments/COMMENT%23"+commTab[i].SK.split("#")[1],myInit)
          .then(res => {
            var comments = res.data;
            console.log(comments);
            // dobim PODKOMENTARJE enega komentarja!!!
            // podkomentarje dodaj na ustrezno mesto v glevni tabeli!
            for(var j = 0; j<comments.length; j++) {
              this.addCommentToTab(comments[j],comments[j].PK,glavnaTabKomentarjev);
            }
            // dig deeper
            return this.getAllComments(glavnaTabKomentarjev,comments);
          })
          .catch(err => {
            console.log(err);
            return [];
          });
      }
      return [];
    }
  }
  // funkcija za dodajanje komentarja na ustrezno mesto v tabeli!!
  addCommentToTab(newComment: any, parentCommentPk: string, glavnaTabKomentarjev: any) : void {
    if(glavnaTabKomentarjev == []) return;
    else {
      for (var i = 0; i<glavnaTabKomentarjev.length; i++) {
        if(glavnaTabKomentarjev[i].SK == newComment.PK) {
          let noviKomentar = new Komentar(newComment.PK,newComment.SK,newComment.vsebina,newComment.upvotes,newComment.avtor,[]);
          glavnaTabKomentarjev[i].komentarji.push(noviKomentar);
          return;
        }else {
          // dig deeper:
          this.addCommentToTab(newComment,parentCommentPk,glavnaTabKomentarjev[i].komentarji);
        }
      }
    }
  }

  getCommentById(pk: string, sk: string) : Promise<any> {
    const myInit = {
      headers:{
        //"X-Api-Key": jwt
      },
      response: true
    };
    return API.get("blogAppApi","/comments/object/"+pk+"/"+sk,myInit)
      .then(res => res.data)
      .catch(err => console.log(err));
  }


  createComment(comment: any) : Promise<any> {
    //console.log(jwt);
    // posli podatke na streznik
    const myInit = {
      body: comment, // vneseni podatki!
      headers: {
        //"X-Api-Key": jwt
      },
    };
    return API.post("blogAppApi","/comments",myInit)
      .then(response => {
        console.log(response);
        return response.data
      }).catch(error => {
        console.log(error.response);
      });
  }

  async updateCommentById(komentar: Komentar) : Promise<any> {
    // pridobi JWT zeton
    let jwt = "";
    await Auth.currentSession().then(res => { jwt = res.getAccessToken().getJwtToken(); });

    const myInit = {
      headers: {
        "X-Api-Key": jwt
      },
      body: komentar
    };
    return API.put("blogAppApi","/comments",myInit)
      .catch(err => console.log(err))
      .then(res => res.data);
  }

  // funkcija pripravi tabelo komentarjev primernih za izbris!
  async getCommentChain(mainCommentTab : Komentar[]) {
    var glavnaTabKomentarjev: Komentar[] = mainCommentTab;
    // sprehodi se skozi glavne komentarje in jih dodaj v tab
    await this.getAllComments(glavnaTabKomentarjev,mainCommentTab);
    return glavnaTabKomentarjev;
  }

  // fun za izbris COMMENT CHAIN-a!
  async deleteComments(commentChainArr: Komentar[], jwt: string, avtorKomentarja: string) : Promise<any>{
    console.log(avtorKomentarja);
    if(commentChainArr == []) return;
    else {
      for (var i = 0; i<commentChainArr.length; i++) {
        const myInit = {
          headers:{
            // API KEY
            "X-Api-Key": jwt
          },
          body:{
            avtorKomentarja: avtorKomentarja
          }
        };
        // set PK and SK:
        var pk = commentChainArr[i].PK.split("#")[0]+"%23"+commentChainArr[i].PK.split("#")[1];
        var sk = commentChainArr[i].SK.split("#")[0]+"%23"+commentChainArr[i].SK.split("#")[1];
        // izbriši komentarje
        await API.del("blogAppApi","/comments/object/"+pk+"/"+sk,myInit)
          .catch(err => console.log(err))
          .then(res => {
            // dig deeper
            this.deleteComments(commentChainArr[i].komentarji,jwt, avtorKomentarja);
          });
      }
    }
  }

  async updateCommentVote(komentar: Komentar) : Promise<any> {
    // pridobi JWT zeton
    let jwt = "";
    await Auth.currentSession().then(res => { jwt = res.getAccessToken().getJwtToken(); });

    const myInit = {
      headers: {
        "X-Api-Key": jwt
      },
      body: komentar
    };
    return API.put("blogAppApi","/comments/vote",myInit)
      .catch(err => console.log(err))
      .then(res => res.data);
  }
}
