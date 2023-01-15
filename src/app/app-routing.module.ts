import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DishesComponent } from './pages/dishes/dishes.component';
import { HomeComponent } from './pages/home/home.component';
import { BasketComponent } from './pages/basket/basket.component';
import { NewDishComponent } from './pages/new-dish/new-dish.component';
import { PageNotFoundComponent } from './pages/not-found/not-found.component';
import { DishDetailsComponent } from './pages/dish-details/dish-details.component';

const routes: Routes = [
  { path: 'menu', component: DishesComponent },
  { path: 'menu/:id', component: DishDetailsComponent },
  { path: 'home', component: HomeComponent },
  { path: 'new-dish', component: NewDishComponent },
  { path: 'basket', component: BasketComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
