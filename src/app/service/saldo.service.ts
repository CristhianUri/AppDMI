import { Injectable } from '@angular/core';
import { Firestore, collection, query,doc,getDoc, where, onSnapshot, QuerySnapshot, DocumentData } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaldoService {
  private subjects: { [key: string]: BehaviorSubject<any> } = {};

  constructor(private firestore: Firestore) {}

 // Método para obtener los datos una vez de Firestore
 async getDocumentOnce(collectionName: string, documentId: string): Promise<any> {
  const docRef = doc(this.firestore, `${collectionName}/${documentId}`);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

// Método para escuchar cambios en tiempo real
listenToDocument(collectionName: string, documentId: string): Observable<any> {
  const key = `${collectionName}-${documentId}`;

  if (!this.subjects[key]) {
    const subject = new BehaviorSubject<any>(null);
    this.subjects[key] = subject;

    const docRef = doc(this.firestore, `${collectionName}/${documentId}`);
    
    // Escuchar cambios en tiempo real
    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        subject.next(docSnap.data());
      } else {
        console.error(`El documento con ID ${documentId} no existe en la colección ${collectionName}`);
        subject.next(null);
      }
    });
  }

  return this.subjects[key].asObservable();
}
}
