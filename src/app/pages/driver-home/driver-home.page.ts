import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from '../../service/firebase.service';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-driver-home',
  templateUrl: './driver-home.page.html',
  styleUrls: ['./driver-home.page.scss'],
  standalone: true,
  imports: [IonicModule , CommonModule, FormsModule,HeaderComponent]
})
export class DriverHomePage implements OnInit {
  title: string = 'Administrador';
  menuItem = [];
  constructor(private router: Router, private firebaseService:FirebaseService) { }

  ngOnInit() {
     // Verificar si el usuario está autenticado
     const uid = localStorage.getItem('uid'); // Obtener el uid del localStorage
     const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
   
     if (!isLoggedIn || !uid) {
       this.router.navigate(['/auth']); // Redirige a la página de autenticación si no está autenticado
     } else {
       this.firebaseService.fetchUserDataByUid(uid); // Obtiene datos del usuario
     }
  }

}
