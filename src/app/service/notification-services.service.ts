import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Firestore, collection, query, where, onSnapshot, doc, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class NotificationServicesService {

  private notificaciones = new BehaviorSubject<any[]>([]);
  private notificacionesdriver = new BehaviorSubject<string>('');
  notificacionesdriver$= this.notificacionesdriver.asObservable();
  notificaciones$ = this.notificaciones.asObservable();
  constructor(private firestore: Firestore) {}
  // Enviar una notificación
  sendNotification(mensaje: string) {
    this.notificacionesdriver.next(mensaje);

  }
  listenForNotifications(studentId: string) {
    const notificationsRef = collection(this.firestore, 'notifications');
    const q = query(notificationsRef, where('studentId', '==', studentId), where('read', '==', false));

    onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      this.notificaciones.next(notifications);
    });
  }

  // Marcar notificación como leída
  async markAsRead(notificationId: string) {
    const notificationRef = doc(this.firestore, `notifications/${notificationId}`);
    await updateDoc(notificationRef, { read: true });
  }
}
