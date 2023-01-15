import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(
    private fb: FormBuilder,
    private store: StoreService,
    private router: Router
  ) {}

  myForm: FormGroup;

  ngOnInit() {
    this.resetForm();
  }

  resetForm() {
    this.myForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
    });
  }

  async onSubmit() {

    // this.resetForm();
    // await this.store.addDish(newDish);
    // this.router.navigate([`menu`]);
  }

}
