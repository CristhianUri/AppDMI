import { inject, Injectable } from '@angular/core';
import { Auth,createUserWithEmailAndPassword , signInWithEmailAndPassword, sendEmailVerification} from '@angular/fire/auth';
import { Firestore,doc,setDoc} from '@angular/fire/firestore';
import { Student, User } from './../model/user.model';
import { getDoc } from 'firebase/firestore';
import { Router } from '@angular/router';
import { UtilsService } from './utils.service';





@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth= inject(Auth);
  firestore = inject(Firestore);
  router = inject(Router);
  utilSvc= inject(UtilsService);
  async registerStudent(student: Student) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, student.email, student.password);
      const user = userCredential.user;
  
      // Enviar correo de verificación
      await sendEmailVerification(user);
  
      const uid = user.uid;
  
      // Guardar al estudiante en Firestore
      await setDoc(doc(this.firestore, 'students', uid), {
        uid: uid,
        name: student.name,
        rol: student.rol,
        saldo: student.saldo
      });
  
      console.log('Usuario registrado. Correo de verificación enviado.');
      // Puedes mostrar un mensaje indicando que revise su correo para la verificación
      await this.utilSvc.Alerta('Correo de verificación', 'Se ha enviado un correo de verificación. Por favor, revisa tu bandeja de entrada.');
    } catch (error) {
      console.error('Error en el registro: ' + error);
      throw error;
    }
  }
  
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
  
      // Verificar si el correo ha sido confirmado
      if (user.emailVerified) {
        const uid = user.uid;
  
        // Buscar al usuario en Firestore
        let docRef = doc(this.firestore, 'students', uid);
        let userSnap = await getDoc(docRef);
  
        if (userSnap.exists()) {
          const userInfo = userSnap.data();
          localStorage.setItem('name', userInfo['name']);
          this.router.navigate(['/student-home']);
          return;
        }
  
        // Repetir el proceso para otros roles
        docRef = doc(this.firestore, 'drivers', uid);
        userSnap = await getDoc(docRef);
        if (userSnap.exists()) {
          const userInfo = userSnap.data();
          localStorage.setItem('name', userInfo['name']);
          this.router.navigate(['/driver-home']);
          return;
        }
  
        docRef = doc(this.firestore, 'admin', uid);
        userSnap = await getDoc(docRef);
        if (userSnap.exists()) {
          const userInfo = userSnap.data();
          localStorage.setItem('name', userInfo['name']);
          this.router.navigate(['/admin-home']);
          return;
        }
  
      } else {
        // Mostrar un mensaje si el correo no está verificado
        await this.utilSvc.Alerta('Verificación pendiente', 'Por favor, verifica tu correo antes de iniciar sesión.');
      }
    } catch (error) {
      console.error('Error en el inicio de sesión: ', error);
    }
  }
  

  logout(): Promise<void>{
    return this.auth.signOut();
  }
}
