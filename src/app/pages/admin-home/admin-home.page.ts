import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FirebaseService } from 'src/app/service/firebase.service';


@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.page.html',
  styleUrls: ['./admin-home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, CustomInputComponent, RouterLink, HeaderComponent]
})
export class AdminHomePage implements OnInit {

  form = new FormGroup ({
    
    email : new FormControl('', [Validators.required,Validators.email]),
    saldo: new FormControl('', [Validators.required,Validators.maxLength(10),Validators.minLength(10)]),
    saldo2: new FormControl('', [Validators.required,Validators.maxLength(10),Validators.minLength(10)]),
  });
  title: string = 'Recargar';
  menuItem = [
    {title:'inicio',route:'/admin-home'},
    { title: 'Historial de recargas', route: '/admin-payment-history' },
    { title: 'Registrar', route: '/admin-register-chofer' },
    { title: 'Lista de conductores', route: '/admin-list' },

    // Agrega más elementos específicos para esta página
  ];
  userName: string | null = null;
  
  constructor(private router: Router, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.userName$.subscribe(name => this.userName = name);
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
