import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginData } from 'src/app/store/datatypes';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
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
    });
  }

  async onSubmit() {
    const newUser = {
      email: this.myForm.value.email,
      password: this.myForm.value.password,
    } as LoginData;
    
    this.store.login(newUser).subscribe((status: boolean) => {
      if(!status) {
        this.showSnackBar("Invalid credentials", "Ok");
        return;
      }
      this.resetForm();
      this.router.navigate([`menu`]).then(() => {
        this.showSnackBar("Login complete", "Great");
      });
    });
  }

  showSnackBar(message: string, button: string) {
    this.snackBar.open(message, button);
  }
}
