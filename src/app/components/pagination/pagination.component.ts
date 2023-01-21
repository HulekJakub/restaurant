import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit, OnDestroy {
  @Input() itemsPerPage$: Observable<number>;
  @Input() currentPage: number = 0;
  @Output() currentPageChanged = new EventEmitter<number>();

  public lastPage: boolean = false;
  private dishesLength: number;
  private dishesLengthSubscription: Subscription;
  public itemsPerPage: number;
  private itemsPerPageSubscription: Subscription;

  constructor(private store: StoreService) {}

  public changePage(increment: number) {
    this.currentPage += increment;
    this.updatePagination();
  }

  updatePagination() {
    if(this.currentPage * this.itemsPerPage >= this.dishesLength) {
      this.currentPage -= 1
    }
    if(this.currentPage < 0) {
      this.currentPage = 0;
    }
    this.lastPage = (this.currentPage + 1) * this.itemsPerPage >= this.dishesLength;
    this.currentPageChanged.emit(this.currentPage);
  }

  public reset() {
    this.currentPage = 0;
  }

  public ngOnInit() {
    this.dishesLengthSubscription = this.store.getStream('dishes').subscribe(dishes => {
      this.dishesLength = dishes.length;
      this.updatePagination();
    })

    this.itemsPerPageSubscription = this.itemsPerPage$.subscribe((n) => {
      this.itemsPerPage = n;
      this.updatePagination();
    })
  }

  public ngOnDestroy() {
    this.dishesLengthSubscription.unsubscribe();
    this.itemsPerPageSubscription.unsubscribe();
  }
}

