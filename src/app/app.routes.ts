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
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password.page').then( m => m.ForgotPasswordPage)
  },
  {
    path: 'student-home',
    loadComponent: () => import('./pages/student-home/student-home.page').then( m => m.StudentHomePage)
  },
  {
    path: 'drives-home',
    loadComponent: () => import('./pages/drives-home/drives-home.page').then( m => m.DrivesHomePage)
  },
  {
    path: 'admin-home',
    loadComponent: () => import('./pages/admin-home/admin-home.page').then( m => m.AdminHomePage)
  }
];
