import { adminGuardGuard } from './guard/admin-guard.guard';
import { Routes } from '@angular/router';
import { authGuard } from './guard/auth.guard';


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
    loadComponent: () => import('./pages/student-home/student-home.page').then( m => m.StudentHomePage), 
    canActivate:[authGuard],
    data: { role: 'Student' }
  },

  {
    path: 'admin-home',
    loadComponent: () => import('./pages/admin-home/admin-home.page').then( m => m.AdminHomePage),
   canActivate:[adminGuardGuard],
    data: { role: 'Admin' }
  },
  {
    path: 'admin-list',
    loadComponent: () => import('./pages/admin-home/admin-list/admin-list.page').then( m => m.AdminListPage),
   canActivate:[adminGuardGuard],
    data: { role: 'Admin' }
  
  },
  {
    path: 'admin-register-chofer',
    loadComponent: () => import('./pages/admin-home/admin-register-chofer/admin-register-chofer.page').then( m => m.AdminRegisterChoferPage),
   canActivate:[adminGuardGuard],
   data: { role: 'Admin' }
  
  },

  {
    path: 'driver-home',
    loadComponent: () => import('./pages/driver-home/driver-home.page').then( m => m.DriverHomePage),
    canActivate:[authGuard],
    data: { role: 'Driver' }
  },
  {
    path: 'history-payment',
    loadComponent: () => import('./pages/admin-home/history-payment/history-payment.page').then( m => m.HistoryPaymentPage),
    canActivate:[adminGuardGuard],
   data: { role: 'Admin' }
  }



];
