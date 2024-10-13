import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonSelect, IonSelectOption,IonRouterOutlet } from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';

@Component({
  selector: 'app-admin-register-chofer',
  templateUrl: './admin-register-chofer.page.html',
  styleUrls: ['./admin-register-chofer.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, HeaderComponent,CustomInputComponent, IonButton, IonItem, IonList, IonSelect, IonSelectOption, IonRouterOutlet]
})
export class AdminRegisterChoferPage implements OnInit {

  title: string = 'Recargar';
  menuItem = [
    { title: 'Recargar', route: '/admin-home' },
    { title: 'Historial de recargas', route: '/admin-payment-history' },
    { title: 'Lista de conductores', route: '/admin-list' }

    // Agrega más elementos específicos para esta página
  ];

  constructor() { }

  ngOnInit() {
  }

}
