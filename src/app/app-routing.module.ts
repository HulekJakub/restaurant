import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DishesComponent } from './pages/dishes/dishes.component';
import { HomeComponent } from './pages/home/home.component';
import { BasketComponent } from './pages/basket/basket.component';
import { NewDishComponent } from './pages/new-dish/new-dish.component';
import { PageNotFoundComponent } from './pages/not-found/not-found.component';
import { DishDetailsComponent } from './pages/dish-details/dish-details.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { UserComponent } from './pages/user/user.component';
import { AdminComponent } from './pages/admin/admin.component';
import { AuthGuard } from './auth.guard';
import { ManageDishesComponent } from './pages/manage-dishes/manage-dishes.component';

const routes: Routes = [
  { path: 'menu', component: DishesComponent },
  {
    path: 'dish/:id',
    component: DishDetailsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'home', component: HomeComponent },
  {
    path: 'newDish/:id',
    component: NewDishComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['MANAGER', 'ADMIN'],
    },
  },
  {
    path: 'manageDishes',
    component: ManageDishesComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['MANAGER', 'ADMIN'],
    },
  },
  {
    path: 'basket',
    component: BasketComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['USER'],
    },
  },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {
      roles: ['ADMIN'],
    },
  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
