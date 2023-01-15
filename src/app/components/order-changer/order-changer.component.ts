import {
  Component,
  EventEmitter,
  Input,
  Output,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-order-changer',
  templateUrl: './order-changer.component.html',
  styleUrls: ['./order-changer.component.css'],
})
export class OrderChangerComponent {
  @Input() maxValue: number;
  @Output() valueChanged = new EventEmitter<number>();
  @ViewChild('counter') counter: ElementRef;
  @Input() value = 0;

  public handlePlusClick(event: Event) {
    event.stopPropagation();
    this.value += 1;
    this.valueChanged.emit(this.value);
  }

  public handleMinusClick(event: Event) {
    event.stopPropagation();
    this.value -= 1;
    this.valueChanged.emit(this.value);
  }
}
