import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { DishRating } from 'src/app/store/datatypes';
import { StoreService } from 'src/app/store/store.service';
import { getDishRating } from 'src/app/store/utils';


@Component({
  selector: 'app-dish-rating',
  templateUrl: './dish-rating.component.html',
  styleUrls: ['./dish-rating.component.css'],
})
export class DishRatingComponent implements OnInit, OnDestroy {
  @Input('dishId') dishId: number;
  @Input('changeable') changeable: boolean = false;
  @Output() ratingChanged = new EventEmitter<number>();
  
  totalRating: DishRating;
  ratingsSubscription?: Subscription;
  maxRating: number = 5;
  showRating: number = 0;

  constructor(protected store: StoreService) {}
  ngOnInit() {
    if(!this.changeable) {
      this.ratingsSubscription = this.store.getStream('ratings').subscribe((data) => {
        this.totalRating = getDishRating(this.dishId, data);
        this.showRating = this.totalRating.rating;
      });
    }
  }

  ngOnDestroy() {
  this.ratingsSubscription?.unsubscribe();
  }
  stars() {
    return  Math.round(this.showRating);
  }
  borderStars() {
    return  Math.round(this.store.ratingGrades - this.showRating);
  }

  changeRating(rating: number) {
    this.showRating = rating;
    this.ratingChanged.emit(rating);
  }

  public reset(){
    this.showRating = 0;
    this.ratingChanged.emit(this.showRating);
  }
}
