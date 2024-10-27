import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonSelect, IonSelectOption, IonRouterOutlet, IonLabel } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import { FirebaseService } from '../../../service/firebase.service';
import { UtilsService } from 'src/app/service/utils.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserGeneric } from 'src/app/model/user.model';

@Component({
  selector: 'app-admin-register-chofer',
  templateUrl: './admin-register-chofer.page.html',
  styleUrls: ['./admin-register-chofer.page.scss'],
  standalone: true,
  imports: [IonLabel, IonContent, ReactiveFormsModule, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, HeaderComponent, CustomInputComponent, IonButton, IonItem, IonList, IonSelect, IonSelectOption, IonRouterOutlet]
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
    { title: 'Historial de recargas', route: '/admin-payment-history' },
    { title: 'Registrar', route: '/admin-register-chofer' },
    { title: 'Lista de conductores', route: '/admin-list' }
  ];

  constructor(private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() { }

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
