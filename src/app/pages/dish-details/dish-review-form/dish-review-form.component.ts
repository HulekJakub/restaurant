import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import { StoreService } from 'src/app/store/store.service';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DishRatingComponent } from 'src/app/components/dish-rating/dish-rating.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-dish-review-form',
  templateUrl: './dish-review-form.component.html',
  styleUrls: ['./dish-review-form.component.css'],
})
export class DishReviewFormComponent implements OnInit, OnDestroy {
  constructor(private fb: FormBuilder, private store: StoreService) {}
  @Input() dishId: number;
  @ViewChild('ratingComponent') ratingComponent: DishRatingComponent;

  myForm: FormGroup;
  rating: number = -1;
  orderDate: Date | null;
  curDate: Date = new Date();

  userIdSubscription?: Subscription;

  ngOnInit() {
    this.myForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      review: new FormControl('', [Validators.required]),
    });
  }

  onSubmit() {
    this.userIdSubscription = this.store
      .getStream('userId')
      .pipe(filter((userId) => userId != undefined))
      .subscribe((userId) => {
        this.store.addRating({
          userId: userId,
          dishId: this.dishId,
          rating: this.rating,
          nickname: this.myForm.value.name,
          review: this.myForm.value.review,
          orderDate: this.orderDate,
        });
        this.myForm.reset();
        this.ratingComponent.reset();
      });
  }

  public changeRating(event: number) {
    this.rating = event;
  }

  public dateChanged(event: MatDatepickerInputEvent<Date>) {
    this.orderDate = event.value;
  }

  ngOnDestroy() {
    this.userIdSubscription?.unsubscribe();
  }
}
