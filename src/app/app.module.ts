import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DishCardComponent } from './pages/dishes/dish-card/dish-card.component';
import { DishesComponent } from './pages/dishes/dishes.component';
import { OrderChangerComponent } from './components/order-changer/order-changer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { FilterDishesPipe } from './pipes/filter-dishes/filter-dishes.pipe';
import { DishFilterComponent } from './components/dish-filter/dish-filter.component';
import { HomeComponent } from './pages/home/home.component';
import { BasketComponent } from './pages/basket/basket.component';
import { NewDishComponent } from './pages/new-dish/new-dish.component';
import { PageNotFoundComponent } from './pages/not-found/not-found.component';
import { DishDetailsComponent } from './pages/dish-details/dish-details.component';
import { DishReviewFormComponent } from './pages/dish-details/dish-review-form/dish-review-form.component';
import { DishRatingComponent } from './components/dish-rating/dish-rating.component';
import { RatingsListComponent } from './pages/dish-details/ratings-list/ratings-list.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { PaginationComponent } from './components/pagination/pagination.component';
import { PaginationPipe } from './pipes/pagination/pagination.pipe';
import { MatListModule } from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { RegisterComponent } from './pages/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    DishCardComponent,
    DishesComponent,
    DishesComponent,
    OrderChangerComponent,
    FilterDishesPipe,
    PaginationPipe,
    DishFilterComponent,
    HomeComponent,
    BasketComponent,
    NewDishComponent,
    PageNotFoundComponent,
    DishDetailsComponent,
    DishReviewFormComponent,
    DishRatingComponent,
    RatingsListComponent,
    PaginationComponent,
    RegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonToggleModule,
    MatListModule,
    MatSelectModule,
    MatDividerModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
