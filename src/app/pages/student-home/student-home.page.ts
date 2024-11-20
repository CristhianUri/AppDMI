import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonicModule, AlertController } from '@ionic/angular';
import { FirebaseService } from '../../service/firebase.service';
import { Router } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { NotificationServicesService } from '../../service/notification-services.service';
import { IonItem, IonRouterOutlet, IonContent, IonHeader, IonToolbar, IonTitle, IonAvatar, IonImg, IonLabel, IonButton } from '@ionic/angular/standalone';


@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.page.html',
  styleUrls: ['./student-home.page.scss'],
  standalone: true,
  imports: [IonItem,IonRouterOutlet,IonContent,IonHeader,IonToolbar,IonTitle,IonAvatar,IonImg,IonLabel,IonButton, CommonModule, FormsModule, HeaderComponent, QRCodeModule]
})
export class StudentHomePage implements OnInit {
  title: string = 'Administrador';
  qrData: string |  null = null;
  menuItem = [];
  userName: string | null = null;
  userRole: string = 'Estudiante';
  userBalance: number | null = null;
  notifications: any[] = [];

  constructor(private router: Router, 
    private firebaseService: FirebaseService,
    private notificationService: NotificationServicesService,
    private alertCtrl: AlertController,

  ) { }

  
  ngOnInit() {
    // Suscribirse al flujo de datos de usuario y saldo
    this.firebaseService.userName$.subscribe(name => this.userName = name);
    this.firebaseService.userBalance$.subscribe(balance => {
      this.userBalance = balance !== null ? balance : Number(localStorage.getItem('balance'));
    });

    const studentId = localStorage.getItem('uid');
    if (studentId) {
      // Escucha notificaciones en tiempo real
      this.notificationService.listenForNotifications(studentId);
      this.notificationService.notificaciones$.subscribe((notifications) => {
        this.notifications = notifications;
        if (notifications.length > 0) {
          this.showAlert(notifications[0].message, notifications[0].id);
        }
      });
    }
  }



  generateQrCode() {
    const userId = localStorage.getItem('uid');
    const localDate = new Date();
  
    // Ajustar la fecha a la zona horaria de México
    const timestamp = localDate.toLocaleString('en-US', { timeZone: 'America/Mexico_City' });

    this.qrData = JSON.stringify({ userId, timestamp });
  }

  async showAlert(message: string, notificationId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Notificación',
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // Marca la notificación como leída
            this.notificationService.markAsRead(notificationId);
            
          },
        },
      ],
    });
    await alert.present();
  }
}
