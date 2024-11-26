import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonicModule, AlertController } from '@ionic/angular';
import { FirebaseService } from '../../service/firebase.service';
import { Router } from '@angular/router';
import { QRCodeModule } from 'angularx-qrcode';
import { NotificationServicesService } from '../../service/notification-services.service';
import { IonItem, IonSpinner,IonRouterOutlet, IonContent, IonHeader, IonToolbar, IonTitle, IonAvatar, IonImg, IonLabel, IonButton } from '@ionic/angular/standalone';
import { SaldoService } from '../../service/saldo.service';


@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.page.html',
  styleUrls: ['./student-home.page.scss'],
  standalone: true,
  imports: [IonItem,IonSpinner,IonRouterOutlet,IonContent,IonHeader,IonToolbar,IonTitle,IonAvatar,IonImg,IonLabel,IonButton, CommonModule, FormsModule, HeaderComponent, QRCodeModule]
})
export class StudentHomePage implements OnInit {
  title: string = 'Administrador';
  qrData: string |  null = null;
  menuItem = [];
  userName: string | null = null;
  userRole: string = 'Estudiante';
  userBalance: number | null = null;
  notifications: any[] = [];

  ////
  studentBalance: number | null = null;
  isLoading: boolean = true;

  private subscriptions: Subscription[] = [];
  constructor(private router: Router, 
    private firebaseService: FirebaseService,
    private notificationService: NotificationServicesService,
    private alertCtrl: AlertController,
    private SaldoService: SaldoService
  ) { }

  
  ngOnInit() {
    const studentId = localStorage.getItem('uid');
    // Suscribirse al flujo de datos de usuario y saldo
    this.firebaseService.userName$.subscribe(name => this.userName = name);
    this.firebaseService.userBalance$.subscribe(balance => {
      this.userBalance = balance !== null ? balance : Number(localStorage.getItem('balance'));
    });
    
    // Primero obtenemos los datos iniciales
    this.SaldoService.getDocumentOnce('students', studentId).then((data) => {
      this.studentBalance = data?.saldo || null;
      this.isLoading = false; // Detener el spinner cuando los datos estén listos
    });

    // Luego, nos suscribimos a los cambios en tiempo real
    this.subscriptions.push(
      this.SaldoService.listenToDocument('students', studentId).subscribe((data) => {
        this.studentBalance = data?.saldo || null;
      })
    );
   /* const studentId = localStorage.getItem('uid');
    if (studentId) {
      // Escucha notificaciones en tiempo real
      this.notificationService.listenForNotifications(studentId);
      this.notificationService.notificaciones$.subscribe((notifications) => {
        this.notifications = notifications;
        if (notifications.length > 0) {
          this.showAlert(notifications[0].message, notifications[0].id);
        }
      });
    }*/
    
    if (studentId) {
      // Escucha las notificaciones en tiempo real para el estudiante
      this.notificationService.listenForNotifications(studentId);
  
      this.notificationService.notificaciones$.subscribe((notificaciones) => {
        // Mostrar solo una alerta a la vez
        if (notificaciones.length > 0) {
          const latestNotification = notificaciones[0]; // La notificación más reciente
          if (!this.isNotificationDisplayed(latestNotification.id)) {
            this.showAlert(latestNotification.message, latestNotification.id);
          }
        }
      });
    }
  }
// Controla si una notificación ya fue mostrada
private displayedNotifications: Set<string> = new Set();

isNotificationDisplayed(notificationId: string): boolean {
  if (this.displayedNotifications.has(notificationId)) {
    return true;
  }
  this.displayedNotifications.add(notificationId);
  return false;
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
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
