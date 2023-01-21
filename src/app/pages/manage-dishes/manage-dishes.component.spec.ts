import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDishesComponent } from './manage-dishes.component';

describe('ManageDishesComponent', () => {
  let component: ManageDishesComponent;
  let fixture: ComponentFixture<ManageDishesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDishesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageDishesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
