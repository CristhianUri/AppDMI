import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonGrid,IonRow,IonCol,IonCard,IonCardHeader,IonCardTitle,IonCardSubtitle,IonButton,IonApp ,IonRouterOutlet,IonCardContent} from '@ionic/angular/standalone';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-history-payment',
  templateUrl: './history-payment.page.html',
  styleUrls: ['./history-payment.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule,IonContent, IonHeader, IonTitle, IonToolbar,IonGrid,IonApp,IonRow,IonCol,IonCard,IonCardHeader,IonCardTitle,IonCardContent,IonRouterOutlet,IonCardSubtitle,IonButton, HeaderComponent]
})
export class HistoryPaymentPage implements OnInit {
  recargas: any[] = [];
  lastVisible: any = null; // Último documento visible
  loading: boolean = false; // Indicador de carga
  noMoreData: boolean = false;

  title: string = 'Historial';
  cargo: string= 'Administrador'
  menuItem = [
    { title: 'Recargar', route: '/admin-home' },
    { title: 'Historial de recargas', route: '/history-payment' },
    { title: 'Registrar', route: '/admin-register-chofer' },
    { title: 'Lista de conductores', route: '/admin-list' },
    // Agrega más elementos específicos para esta página
  ];




  constructor(private firebaseService: FirebaseService) {}

  async ngOnInit() {
    await this.loadRecargas(); // Carga inicial
  }
  async loadRecargas() {
    if (this.loading || this.noMoreData) return; // Evita cargas múltiples

    this.loading = true; // Activa indicador de carga
    try {
      const { recargas, lastVisible } = await this.firebaseService.getRecargasPaginadas(this.lastVisible);
      this.recargas = [...this.recargas, ...recargas]; // Agrega nuevas recargas a la lista
      this.lastVisible = lastVisible;

      if (recargas.length < 5) {
        this.noMoreData = true; // Marca el fin si no hay más de 5 registros
      }
    } catch (error) {
      console.error('Error al cargar recargas:', error);
    } finally {
      this.loading = false; // Desactiva indicador de carga
    }
  }
}
