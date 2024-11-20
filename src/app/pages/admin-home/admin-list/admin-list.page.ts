import { Component, inject, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule, AlertController, MenuController } from '@ionic/angular';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FirebaseService, } from 'src/app/service/firebase.service';
import { IonContent, IonList, IonItem, IonLabel, IonButton,IonSegment, IonSegmentButton, IonSpinner, IonRouterOutlet } from '@ionic/angular/standalone';



@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.page.html',
  styleUrls: ['./admin-list.page.scss'],
  standalone: true,
  imports: [IonSpinner,IonSegment,IonSegmentButton,IonRouterOutlet,IonContent,IonList,IonItem,IonLabel,IonButton,CommonModule, FormsModule, ReactiveFormsModule, HeaderComponent]
})
export class AdminListPage implements OnInit {
  users: any[] = [];
  collectionName: string = 'drivers'; // Inicializamos con "admins"
  isLoading: boolean = false;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
     // O 'admins', dependiendo de lo que necesites
    this.loadUsers(); // Carga inicial con la colección "admins"
    
  }

  /**
   * Carga los usuarios de la colección seleccionada.
   */
  async loadUsers() {
    if (this.isLoading) return; // Evita cargar si ya se está cargando
  
    this.isLoading = true;
  
    try {
      console.log(`Cargando usuarios de la colección ${this.collectionName}`); // Verifica cuál colección se está cargando
      const result = await this.firebaseService.getAllUsers(this.collectionName);
      this.users = result;
    } catch (error) {
      console.error(`Error cargando datos de ${this.collectionName}:`, error);
    } finally {
      this.isLoading = false;
    }
  }
  
  
  /**
   * Cambia entre las colecciones (Choferes / Administradores) y recarga los datos.
   * @param newCollection Nueva colección seleccionada.
   */
  changeCollection(newCollection: string) {
    console.log('Cambio de colección a:', newCollection); // Verifica el valor recibido
    console.log('Colección actual:', this.collectionName); // Verifica el valor de la colección actual
  
    // Normaliza ambos valores (por ejemplo, eliminando espacios)
    if (this.collectionName.trim() == newCollection.trim()) {
      console.log('Colección antes de actualizar:', this.collectionName);
      this.collectionName = newCollection; // Actualiza la colección
  
      console.log('Colección después de actualizar:', this.collectionName);
      this.users = []; // Limpia la lista de usuarios antes de recargar
      this.loadUsers(); // Recarga los usuarios de la nueva colección
    } else {
      console.log('La colección no cambió. No es necesario recargar.');
    }
  }
  
  

  editUser(user: any) {
    console.log('Editando:', user);
    // Implementa lógica de edición aquí
  }

  async deleteUser(userId: string) {
    try {
      await this.firebaseService.deleteDocument(this.collectionName, userId);
      // Actualiza la lista local para eliminar el usuario
      this.users = this.users.filter(user => user.uid !== userId); // Cambiar 'id' por 'uid'
    } catch (error) {
      console.error('Error eliminando usuario:', error);
    }
  }
  formatPhoneNumber(phone: number): string {
    // Convertir el número a cadena
    const phoneStr = phone.toString();
  
    // Asegurarse de que el teléfono tenga 10 dígitos
    if (phoneStr.length === 10) {
      // Formatear como (XXX) XXX-XXXX
      return phoneStr.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    }
  
    // Si no tiene el formato esperado, devolver el número tal cual
    return phoneStr;
  }
  
}
