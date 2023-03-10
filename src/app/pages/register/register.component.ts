import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginData } from 'src/app/store/datatypes';
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
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  myForm: FormGroup;

  ngOnInit() {
    this.resetForm();
  }

  resetForm() {
    this.myForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
    });
    this.myForm.addValidators(this.passwordsValidator);
  }

  async onSubmit() {
    const newUser = {
      email: this.myForm.value.email,
      password: this.myForm.value.password,
    } as LoginData;

    this.store.register(newUser).subscribe((status: boolean) => {
      if(!status) {
        this.showSnackBar("This account already exists", "Ok");
        return;
      }
      this.resetForm();
      this.router.navigate([`login`]).then(() => {
        this.showSnackBar("Registration complete", "Great");
      });
    });
  }

  showSnackBar(message: string, button: string) {
    this.snackBar.open(message, button);
  }

  passwordsValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const repeatPassword = control.get('repeatPassword');
  
    return password && repeatPassword && password.value !== repeatPassword.value ? { passwordsNotEqual: true } : null;
  };
}
