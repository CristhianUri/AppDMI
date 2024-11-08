import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FirebaseService } from 'src/app/service/firebase.service';
import { UtilsService } from 'src/app/service/utils.service';
import { UserGeneric } from 'src/app/model/user.model';


@Component({
  selector: 'app-admin-register-chofer',
  templateUrl: './admin-register-chofer.page.html',
  styleUrls: ['./admin-register-chofer.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, CustomInputComponent, RouterLink, HeaderComponent]
})
export class AdminRegisterChoferPage implements OnInit {

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]),
    telefono: new FormControl('', [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)]), // Validador para número de teléfono
    role: new FormControl('', [Validators.required]) // Control para el rol
  });
  //services
  private firebaseService = inject(FirebaseService);
  utilSvc = inject(UtilsService);

  title: string = 'Recargar';
  menuItem = [
    {title:'inicio',route:'/admin-home'},
    { title: 'Historial de recargas', route: '/admin-payment-history' },
    { title: 'Registrar', route: '/admin-register-chofer' },
    { title: 'Lista de conductores', route: '/admin-list' },

    // Agrega más elementos específicos para esta página
  ];
  constructor(private router: Router, private alertCtrl: AlertController) { }

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

  async onSubmit() {
    if (this.form.valid) {
      console.log('Formulario enviado', this.form.value);
      // Aquí puedes realizar la lógica de envío del formulario
      
      const userGeneric: UserGeneric = {
        uid: '',
        name: this.form.value.name,
        email: this.form.value.email,
        password: this.form.value.password,
        rol: this.form.value.role,
        saldo: 0,
        fecha: new Date(),
        telefono: Number(this.form.value.telefono)
      }
      const loading = await this.utilSvc.loading('Registrando');
    loading.present();
    try {
      await this.firebaseService.registerUser(userGeneric);
      
    } catch (error) {
      await this.presentAlert("Email ya se encuentra en uso");
    }finally{
      loading.dismiss();
    }
  
    } else {
      await this.presentAlert("Porfacor llena todos los campos");
      return
    }
  }

  async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
