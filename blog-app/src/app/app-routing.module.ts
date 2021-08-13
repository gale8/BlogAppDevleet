import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PrijavaComponent} from "./prijava/prijava.component";
import {RegistracijaComponent} from "./registracija/registracija.component";

const routes: Routes = [
  {path:'prijava', component: PrijavaComponent},
  {path:'registracija', component: RegistracijaComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
