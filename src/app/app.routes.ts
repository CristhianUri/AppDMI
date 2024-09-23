import { Routes } from '@angular/router';

export const routes: Routes = [
 {
  path: '',
  loadComponent: ()=> import('./home/home.page').then(m=>m.HomePage)
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
  }
];
