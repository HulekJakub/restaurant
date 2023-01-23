import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
  UrlTree,
} from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { StoreService } from './store/store.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard
  implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad
{
  constructor(private store: StoreService, private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    let url: string = state.url;
    return await this.checkUser(next, url);
  }
  async canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    return await this.canActivate(next, state);
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return true;
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]
  ): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }

  async checkUser(route: ActivatedRouteSnapshot, url: any): Promise<boolean> {
    const logged = await firstValueFrom(this.store.getStream('userLogged'));
    console.log(logged);
    
    if (logged) {
      if (!route.data['roles'] || route.data['roles'].length === 0) {
        return true;
      }

      const userRoles: string[] = await firstValueFrom(
        this.store.getStream('userRoles')
      );
      if (
        userRoles
          .map((role) => route.data['roles'].includes(role) === true)
          .reduce((acc, cur) => cur || acc, false)
      ) {
        return true;
      }
    }

    this.router.navigate(['/login']);
    return false;
  }
}
