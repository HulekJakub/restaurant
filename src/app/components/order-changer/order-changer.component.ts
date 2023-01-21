import {
  Component,
  EventEmitter,
  Input,
  Output,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-order-changer',
  templateUrl: './order-changer.component.html',
  styleUrls: ['./order-changer.component.css'],
})
export class OrderChangerComponent {
  @Input() maxValue: number = 0;
  @Input() disabled: boolean;
  @Input() dishId: number;
  @Input() value = 0;

  constructor(private store: StoreService) {}

  public orderAmountChanged() {
    this.store.updateOrder(this.dishId, this.value);
  }

  public handlePlusClick(event: Event) {
    event.stopPropagation();
    this.value += 1;
    this.orderAmountChanged();
  }

  public handleMinusClick(event: Event) {
    event.stopPropagation();
    this.value -= 1;
    this.orderAmountChanged();
  }
}
