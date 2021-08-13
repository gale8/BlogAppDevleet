import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";

/* KOMPONENTE */
import { AppComponent } from './app.component';
import { PrijavaComponent } from './komponente/prijava/prijava.component';
import { RegistracijaComponent } from './komponente/registracija/registracija.component';
import {SeznamBlogovComponent} from "./komponente/seznam-blogov/seznam-blogov.component";
import { PodrobnostiBlogaComponent } from './komponente/podrobnosti-bloga/podrobnosti-bloga.component';
import { KreiranjeBlogaComponent } from './komponente/kreiranje-bloga/kreiranje-bloga.component';
import { UrediBlogComponent } from './komponente/uredi-blog/uredi-blog.component';

@NgModule({
  declarations: [
    AppComponent,
    PrijavaComponent,
    RegistracijaComponent,
    SeznamBlogovComponent,
    PodrobnostiBlogaComponent,
    KreiranjeBlogaComponent,
    UrediBlogComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
