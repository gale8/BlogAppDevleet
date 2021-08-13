import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PrijavaComponent} from "./komponente/prijava/prijava.component";
import {RegistracijaComponent} from "./komponente/registracija/registracija.component";
import {SeznamBlogovComponent} from "./komponente/seznam-blogov/seznam-blogov.component";

const routes: Routes = [
  {path:'prijava', component: PrijavaComponent},
  {path:'registracija', component: RegistracijaComponent},
  {path: '', component: SeznamBlogovComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
