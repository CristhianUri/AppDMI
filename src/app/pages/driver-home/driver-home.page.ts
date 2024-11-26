import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';
import {  Router } from '@angular/router';
import { CobroSubjectService } from 'src/app/service/cobro-subject.service';
import { QrScannerServiceService } from 'src/app/service/qr-scanner-service.service';
import { NotificationServicesService } from '../../service/notification-services.service';
import { IonContent, IonApp,IonSpinner, IonRouterOutlet,IonButton } from '@ionic/angular/standalone';
import {  ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { Firestore,collection,doc,getDoc,addDoc,updateDoc } from '@angular/fire/firestore';
import { RegistroCobroObserverService } from 'src/app/service/registro-cobro-observer.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';  // Importación de la cámara
import { FirebaseService } from 'src/app/service/firebase.service';
import { Subscription } from 'rxjs';
import { SaldoService } from '../../service/saldo.service';
@Component({
  selector: 'app-driver-home',
  templateUrl: './driver-home.page.html',
  styleUrls: ['./driver-home.page.scss'],
  standalone: true,
  imports: [ZXingScannerModule,IonSpinner,IonContent,IonRouterOutlet , CommonModule, FormsModule,HeaderComponent,IonContent,IonButton]
})
export class DriverHomePage implements OnInit {
  title: string = 'Administrador';
  menuItem = [];
  allowedFormats: BarcodeFormat[] = [BarcodeFormat.QR_CODE];
  selectedAmount: number = 5; // Monto predeterminado
  scannerActive = false; // El escáner no está activo al inicio
  showStopButton = false; // Determina si mostrar el botón para detener el escáner
  notificationMessage: string = '';
  driverid : string='';
  driverBalance: number | null = null;
  isLoading: boolean = true;

  private subscriptions: Subscription[] = [];
  constructor(
    private router: Router,
    private qrService: QrScannerServiceService,
    private firebaseService: RegistroCobroObserverService,
    private notificacionService: NotificationServicesService,
    private firestore: Firestore,
    private cobroService: CobroSubjectService,
    private firebaseService2: FirebaseService,
    private SaldoService: SaldoService
  ) {}

  ngOnInit() {
    this.driverid = localStorage.getItem('uid');
    // Suscribirse al observable del monto seleccionado
    this.cobroService.montoSeleccionado$.subscribe(monto => {
      this.selectedAmount = monto;
      console.log(`Monto actualizado: ${this.selectedAmount} pesos`);
    });
   // const dsaldo = this.firebaseService2.obtenerSaldo(this.driverid);
    // Suscribirse a las notificaciones
    this.notificacionService.notificacionesdriver$.subscribe(message => {
      this.notificationMessage = message;
      setTimeout(() => { this.notificationMessage = ''; }, 5000); // Limpiar la notificación después de 5 segundos
    });

   /* this.subscriptions.push(
      this.SaldoService.listenToDocument('drivers', this.driverid).subscribe((data) => {
        this.driverBalance = data?.saldo || null;
      })
    );*/
    this.SaldoService.getDocumentOnce('drivers', this.driverid).then((data) => {
      this.driverBalance = data?.saldo || null;
      this.isLoading = false; // Detener el spinner cuando los datos estén listos
    });

    // Luego, nos suscribimos a los cambios en tiempo real
    this.subscriptions.push(
      this.SaldoService.listenToDocument('drivers', this.driverid).subscribe((data) => {
        this.driverBalance = data?.saldo || null;
      })
    );
  }
  

  // Método para activar el escáner y mostrar el botón de detener
  startScan(amount: number) {
    this.selectedAmount = amount; // Establece el monto seleccionado
    this.scannerActive = true; // Activar el escáner
    this.showStopButton = true; // Mostrar el botón para detener el escáner
    console.log(`Escáner iniciado para cobrar ${amount} pesos`);
  }

  // Método para detener el escáner
  stopScan() {
    this.scannerActive = false; // Desactivar el escáner
    this.showStopButton = false; // Ocultar el botón para detener el escáner
    console.log('Escáner detenido');
  }

  // Método para manejar el éxito del escaneo
  onScanSuccess(result: string) {
    this.stopScan(); // Detener el escáner inmediatamente
    console.log('QR escaneado exitosamente:', result);

    try {
      const qrData = JSON.parse(result);
      const qrTimestamp = new Date(qrData.timestamp);
      const currentTimestamp = new Date();

      const timeDifference = (currentTimestamp.getTime() - qrTimestamp.getTime()) / (1000 * 60);

      if (timeDifference > 30) {
        console.log('El QR ha expirado. Han pasado más de 30 minutos.');
        this.notificacionService.sendNotification('El QR ha expirado. Han pasado más de 30 minutos.');
        return;
      }

      console.log('QR válido. Procediendo con el cobro...');
      this.handlePayment(qrData.userId);
    } catch (error) {
      console.error('Error al procesar el QR:', error);
    }
  }

  // Método para manejar el cobro según el monto seleccionado (5 o 6 pesos)
  async handlePayment(studentId: string) {
    console.log(`Realizando cobro de ${this.selectedAmount} pesos al estudiante con ID: ${studentId}`);

    // Aquí solo pasamos el userId para hacer la búsqueda y el cobro
    await this.makePayment(studentId);
  }

  // Función que realiza el cobro y actualiza Firestore
  async makePayment(studentId: string) {
    const studentRef = doc(this.firestore, 'students', studentId);
    const studentDoc = await getDoc(studentRef);

    if (studentDoc.exists()) {
      const studentData = studentDoc.data();
      const currentBalance = studentData['saldo'];

      if (currentBalance >= this.selectedAmount) {
        // Actualizar el saldo del estudiante
        const newStudentBalance = currentBalance - this.selectedAmount;
        await updateDoc(studentRef, { saldo: newStudentBalance });

        // Registrar el cobro en la colección 'cobros'
        const cobroRef = collection(this.firestore, 'cobros');
        await addDoc(cobroRef, {
          studentId,
          amount: this.selectedAmount,
          driverId: this.driverid, // ID del chofer
          date: new Date().toISOString(),
        });
        await this.firebaseService2.actualizarSaldo(this.driverid, this.selectedAmount);
        // Crear una notificación de éxito solo una vez
        await this.createNotification(
          studentId,
          `Se descontaron ${this.selectedAmount} pesos de tu saldo.`
        );

        console.log('Pago realizado exitosamente');
        this.scannerActive = false;
      } else {
        // Notificación de saldo insuficiente
        if (!this.notificationMessage.includes('Saldo insuficiente')) {
          this.notificacionService.sendNotification('Saldo insuficiente');
        }
        console.log('Saldo insuficiente');
        this.scannerActive = false;
      }
    } else {
      // Notificación de estudiante no encontrado
      if (!this.notificationMessage.includes('Estudiante no encontrado')) {
        this.notificacionService.sendNotification('Estudiante no encontrado');
      }
      console.log('Estudiante no encontrado');
      this.scannerActive = false;
    }
  }

  // Método para usar la cámara de Capacitor
  async scanQRCodeWithCamera() {
    try {
      const photo = await Camera.getPhoto({
        quality: 100,
        source: CameraSource.Camera, // Usa la cámara
        resultType: CameraResultType.Uri // Devuelve la URL de la imagen
      });

      console.log('Foto capturada:', photo);
      // Aquí puedes procesar la imagen para obtener el QR
      // Ejemplo: Usar alguna librería para leer el código QR de la imagen
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
    }
  }
  async createNotification(studentId: string, message: string) {
    const notificationsRef = collection(this.firestore, 'notifications');
    await addDoc(notificationsRef, {
      studentId,
      message,
      timestamp: new Date().toISOString(),
      read: false, // Inicialmente, la notificación no ha sido leída
    });
  }



}
