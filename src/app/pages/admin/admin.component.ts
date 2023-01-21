import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/store/datatypes';
import { StoreService } from 'src/app/store/store.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  constructor (protected store: StoreService) {}
  
  public users: User[] = [];
  public changed: boolean[] = [];

  async ngOnInit() {
    this.users = await this.store.getAllUsers();
    this.changed = this.users.map(user => false);
  }

  roleChanged(user: User) {
    this.changed[this.users.indexOf(user)] = true;    
  }

  toggleBan(user: User) {
    user.banned = !user.banned;
    this.changed[this.users.indexOf(user)] = true;    
  }

  async saveChanges() {
    this.users = await this.store.putUsers(this.users.filter((user, index) => this.changed[index]));
  }

}
