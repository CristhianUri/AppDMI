
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { FirebaseService } from '../service/firebase.service';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class adminGuardGuard implements CanActivate {

  constructor(private firebasseService: FirebaseService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    const expectedRole = route.data['role']; // Obtén el rol esperado
    return this.firebasseService.userRole$.pipe(
      map(role => {
        if (!role) {
          // Redirigir si no hay rol (no autenticado)
          this.router.navigate(['/auth']);
          return false;
        }
        if (role !== expectedRole) {
          // Redirigir si el rol no coincide
          this.router.navigate(['/home']);
          return false;
        }
        return true; // Permitir acceso
      })
    );
  }
  
}
