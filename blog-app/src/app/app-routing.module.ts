import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PrijavaComponent} from "./komponente/prijava/prijava.component";
import {RegistracijaComponent} from "./komponente/registracija/registracija.component";
import {SeznamBlogovComponent} from "./komponente/seznam-blogov/seznam-blogov.component";
import {PodrobnostiBlogaComponent} from "./komponente/podrobnosti-bloga/podrobnosti-bloga.component";
import {KreiranjeBlogaComponent} from "./komponente/kreiranje-bloga/kreiranje-bloga.component";

const routes: Routes = [
  {path:'prijava', component: PrijavaComponent},
  {path:'registracija', component: RegistracijaComponent},
  {path: '', component: SeznamBlogovComponent},
  {path: 'podrobnosti', component: PodrobnostiBlogaComponent},
  {path: 'kreirajBlog', component: KreiranjeBlogaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
