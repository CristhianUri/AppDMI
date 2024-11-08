import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FirebaseService } from '../service/firebase.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private firebaseService: FirebaseService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const expectedRole = route.data['role'];

    return this.firebaseService.userRole$.pipe(
      map(role => {
        if (role !== expectedRole) {
          // Redirigir solo si el rol no coincide y no es null
          if (role) {
            this.router.navigate(['/home']);
            return false;
          }
          // Si no hay rol, redirigir a la página de autenticación
          this.router.navigate(['/auth']);
          return false;
        }
        return true; // Permitir acceso
      })
    );
  }
}
