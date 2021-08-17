import { Injectable } from '@angular/core';
import { Auth } from 'aws-amplify';
@Injectable({
  providedIn: 'root'
})
export class AvtentikacijaService {
  /* storitev zajema vse funkcije v povezavi z REGISTRACIJO, PRIJAVO in ODJAVO */
  constructor() { }
  /* funkcija za prijavo ze obstojecega uporabnika */
  async prijava(username: string, geslo: string): Promise<any> {
    try {
      let logInUser = await Auth.signIn(username,geslo);
      console.log(logInUser);
      return logInUser;
    } catch (loginErr) {
      console.log(loginErr);
      return null;
    }
  }

  /* funkcija za registracijo NOVEGA uporabnika */
  async registracija(username: string, email: string, password: string): Promise<any> {
    try {
      let newUser = await Auth.signUp({
        username,
        password,
        attributes: {
          email
        }
      });
      console.log(newUser);
      return newUser
    } catch (err) {
      console.log("Unsuccessful SignIn! ERRCODE: "+err);
      return null;
    }
  }
  /* funkcija za odjavo prijavljenega uporabnika */
  async odjava(): Promise<any> {
    try {
      return await Auth.signOut();
    } catch (err) {
      console.log("Err signing out: "+err);
      return null;
    }
  }
  /* funkcija za preverjanje ali je uporabnik prijavljen */
  async jePrijavljen(): Promise<any> {
    try {
      // pridobi informacije trenutno prijavljenega uporabnika
      let currentUser = await Auth.currentUserInfo();
      //console.log(currentUser.username);
      // preveri ali je prijavljen
      if(currentUser == null)
        return false;
      else
        return true;
    } catch (err) {
      console.log("Err retreiving current user's info: "+err);
      return false;
    }
  }
  /* funkcija pridobi uporabnisko ime trenutno prijavljenega uporabnika! */
  async getUsername() : Promise<string> {
    try {
      let currentUser = await Auth.currentUserInfo();
      console.log(currentUser);
      return currentUser.username;
    } catch (err) {
      console.log("Current user info ERR: "+err);
      return ""
    }
  }
}
