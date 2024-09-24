import { Routes } from '@angular/router';

export const routes: Routes = [
 {
  path: '',
  loadComponent: ()=> import('./pages/auth/auth.page').then(m=>m.AuthPage)
 },
 {
  path: 'home',
  loadComponent: ()=> import('./home/home.page').then(m=>m.HomePage)
 },
  {
    path: 'registrar',
    loadComponent: () => import('./registrar/registrar.page').then( m => m.RegistrarPage)
  },
  {
    path: 'actualizar',
    loadComponent: () => import('./actualizar/actualizar.page').then( m => m.ActualizarPage)
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth.page').then( m => m.AuthPage)
  },
  {
    path: 'sing-up',
    loadComponent: () => import('./pages/auth/sing-up/sing-up.page').then( m => m.SingUpPage)
  }
];
