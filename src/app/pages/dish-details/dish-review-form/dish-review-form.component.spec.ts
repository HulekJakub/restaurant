import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DishReviewFormComponent } from './dish-review-form.component';

describe('DishReviewFormComponent', () => {
  let component: DishReviewFormComponent;
  let fixture: ComponentFixture<DishReviewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DishReviewFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DishReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
