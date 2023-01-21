import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StoreService } from './store/store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(protected store: StoreService, private router: Router){}

  userLoggedSubscription: Subscription;
  userLogged: boolean = false;
  userRolesSubscription: Subscription;
  userRoles: string[] = [];
  userNameSubscription: Subscription;
  userName: string = "";

  ngOnInit() {
    this.userNameSubscription = this.store.getStream('email').subscribe((email) => {
      this.userName = email;
    });
    this.userLoggedSubscription = this.store.getStream('userLogged').subscribe((logged) => {
      this.userLogged = logged;
    });
    this.userRolesSubscription = this.store.getStream('userRoles').subscribe((roles) => {
      this.userRoles = roles;
    });
  }

  ngOnDestroy() {
    this.userLoggedSubscription.unsubscribe();
    this.userRolesSubscription.unsubscribe();
    this.userNameSubscription.unsubscribe();
  }

  async logout() {
    await this.store.logout();
    this.router.navigate(['/login']);
  }
}
