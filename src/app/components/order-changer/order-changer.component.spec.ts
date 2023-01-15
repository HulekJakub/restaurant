import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderChangerComponent } from './order-changer.component';

describe('OrderChangerComponent', () => {
  let component: OrderChangerComponent;
  let fixture: ComponentFixture<OrderChangerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderChangerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderChangerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
