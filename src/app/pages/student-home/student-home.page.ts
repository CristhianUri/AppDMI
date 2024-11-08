import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from '../../service/firebase.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.page.html',
  styleUrls: ['./student-home.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent]
})
export class StudentHomePage implements OnInit {
  title: string = 'Administrador';
  menuItem = [];
  userName: string | null = null;
  userRole: string = 'Estudiante';
  userBalance: number | null = null;

  constructor(private router: Router, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.userName$.subscribe(name => this.userName = name);

    this.firebaseService.userBalance$.subscribe(balance => {
      this.userBalance = balance !== null ? balance : Number(localStorage.getItem('balance'));
    });

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
