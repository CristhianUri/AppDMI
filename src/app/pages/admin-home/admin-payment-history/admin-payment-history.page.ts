import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/service/firebase.service';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-admin-payment-history',
  templateUrl: './admin-payment-history.page.html',
  styleUrls: ['./admin-payment-history.page.scss'],
  standalone: true,
  imports: [IonRouterOutlet, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,HeaderComponent]
})
export class AdminPaymentHistoryPage implements OnInit {
  menuItem = [
    {title:'inicio',route:'/admin-home'},
    { title: 'Historial de recargas', route: '/admin-payment-history' },
    { title: 'Registrar', route: '/admin-register-chofer' },
    { title: 'Lista de conductores', route: '/admin-list' },

    // Agrega más elementos específicos para esta página
  ];
  constructor(private router: Router, private firebaseService: FirebaseService) { }

  ngOnInit() {
   
    // Verificar si el usuario está autenticado
    const uid = localStorage.getItem('uid'); // Obtener el uid del localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('role')
    if (!isLoggedIn && !uid && !role) {
      this.router.navigate(['/auth']); // Redirige a la página de autenticación si no está autenticado
    } else {
      this.firebaseService.fetchUserDataByUid(uid); // Obtiene datos del usuario
    }
  }

}
