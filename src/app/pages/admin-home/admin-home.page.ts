import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FirebaseService } from 'src/app/service/firebase.service';
import { UtilsService } from 'src/app/service/utils.service';
import { MenuController } from '@ionic/angular';

import { IonContent, IonModal, IonHeader, IonButton, IonToolbar, IonList, IonTitle, IonItem, IonAvatar, IonGrid, IonRow, IonCol, IonImg, IonLabel, IonRouterOutlet, IonApp } from '@ionic/angular/standalone';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.page.html',
  styleUrls: ['./admin-home.page.scss'],
  standalone: true,
  imports: [IonApp, IonRouterOutlet, CommonModule, FormsModule, IonButton, ReactiveFormsModule, CustomInputComponent, HeaderComponent, IonContent, IonModal, IonHeader, IonToolbar, IonList, IonTitle, IonItem, IonAvatar, IonGrid, IonRow, IonCol, IonImg, IonLabel]
})
export class AdminHomePage implements OnInit {
  private utils = inject(UtilsService)
  form = new FormGroup({

    email: new FormControl('', [Validators.required, Validators.email]),
    saldo: new FormControl('', [Validators.required,]),
    saldo2: new FormControl('', [Validators.required,]),
  });
  title: string = 'Recargar';
  cargo: string= 'Administrador'
  menuItem = [
    { title: 'Recargar', route: '/admin-home' },
    { title: 'Historial de recargas', route: '/history-payment'},
    { title: 'Registrar', route: '/admin-register-chofer' },
    { title: 'Lista de conductores', route: '/admin-list' },
    // Agrega más elementos específicos para esta página
  ];
  userName: string | null = null;

  constructor(private menuCtrl: MenuController, private router: Router, private firebaseService: FirebaseService) { }

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
  async submit() {
    if (this.form.valid) {
      const email = this.form.value.email as string;
      const saldo = Number(this.form.value.saldo);
      const saldo2 = Number(this.form.value.saldo2);

      if (saldo === saldo2) {
        try {
          // Intentamos recargar saldo
          await this.firebaseService.recargarSaldo(email, saldo);

          // Muestra un mensaje de éxito

          await this.utils.Alerta('Exito','Recarga realizada con éxito.');
          // Limpia el formulario después de la recarga
          this.form.reset();  // Esto borra todos los campos del formulario
        } catch (error) {
          console.error(error);
          await this.utils.Alerta('Error', 'Ocurrió un problema al realizar la recarga.');
        }
      } else {
        await this.utils.Alerta('Error', 'Los campos de saldo deben coincidir.');
      }
    } else {
      await this.utils.Alerta('Error', 'Por favor, completa todos los campos correctamente.');
    }
  }
  openMenu() {
    this.menuCtrl.open('main-menu');
  }
}
