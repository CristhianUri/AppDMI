import { inject, Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, runTransaction, getDoc, updateDoc } from '@angular/fire/firestore';
import { NotificationServicesService } from './notification-services.service';

@Injectable({
  providedIn: 'root'
})
export class RegistroCobroObserverService {
  constructor(
    private firestore: Firestore,
    private notificationService: NotificationServicesService
  ) {}

  
  // Obtener información de un estudiante
  getStudent(userId: string) {
    const studentDoc = doc(this.firestore, 'students', userId); // Obtiene el documento del estudiante
    return getDoc(studentDoc); // Se usa getDoc para obtener el documento
  }

  // Actualizar saldo del estudiante
  updateStudentBalance(userId: string, newBalance: number) {
    const studentDoc = doc(this.firestore, 'students', userId); // Documento del estudiante
    return updateDoc(studentDoc, { balance: newBalance }); // Actualiza el saldo
  }

  // Actualizar saldo del chofer
  updateDriverBalance(driverId: string, newBalance: number) {
    const driverDoc = doc(this.firestore, 'drivers', driverId); // Documento del chofer
    return updateDoc(driverDoc, { balance: newBalance }); // Actualiza el saldo
  }

  // Registrar un cobro
  addCobro(cobro: any) {
    const cobrosCollection = collection(this.firestore, 'cobros'); // Accede a la colección 'cobros'
    return addDoc(cobrosCollection, cobro); // Añade el nuevo cobro
  }
}
