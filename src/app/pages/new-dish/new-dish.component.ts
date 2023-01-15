import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-new-dish',
  templateUrl: './new-dish.component.html',
  styleUrls: ['./new-dish.component.css'],
})
export class NewDishComponent {
  constructor(
    private fb: FormBuilder,
    private store: StoreService,
    private router: Router
  ) {}

  myForm: FormGroup;
  cuisines: string[] = this.store.cuisines;
  categories: string[] = this.store.categories;
  a:any;

  ngOnInit() {
    this.resetForm();
  }

  resetForm() {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      cuisine: ['', Validators.required],
      categories: [{ value: [], disabled: false }, [Validators.required]],
      ingredients: ['', Validators.required],
      available: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      price: [
        '',
        [Validators.required, Validators.pattern('^([0-9]*[.])?[0-9]+$')],
      ],
      photos: ['', Validators.required],
    });
  }

  async onSubmit() {
    const newDish = {
      id: -1,
      name: this.myForm.value.name,
      description: this.myForm.value.description,
      cuisine: this.myForm.value.cuisine,
      categories: this.myForm.value.categories,
      ingredients: this.splitAndTrim(this.myForm.value.ingredients),
      available: parseInt(this.myForm.value.available),
      price: parseFloat(this.myForm.value.price),
      photos: this.splitAndTrim(this.myForm.value.photos),
    };

    this.resetForm();
    await this.store.addDish(newDish);
    this.router.navigate([`menu`]);
  }

  splitAndTrim(values: string): string[] {
    return values.split(',').map((val) => val.trim());
  }
}
