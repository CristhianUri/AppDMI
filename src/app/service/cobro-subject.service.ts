import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, updateDoc, addDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CobroSubjectService {
  constructor(private firestore: Firestore) {}
 private montoSeleccionadoSubject = new BehaviorSubject<number>(0); // Valor inicial 0
  montoSeleccionado$ = this.montoSeleccionadoSubject.asObservable(); // Observable para los Observers

  // Método para actualizar el monto
  actualizarMonto(monto: number) {
    this.montoSeleccionadoSubject.next(monto); // Emite el nuevo valor
  }

  // Método para obtener el monto actual
  obtenerMonto(): number {
    return this.montoSeleccionadoSubject.getValue(); // Devuelve el valor actual
  }
}
