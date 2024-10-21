import { inject, Injectable } from '@angular/core';
import { Auth,createUserWithEmailAndPassword , signInWithEmailAndPassword, sendEmailVerification} from '@angular/fire/auth';
import { Firestore,doc,setDoc} from '@angular/fire/firestore';
import {  UserGeneric } from './../model/user.model';
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

  async registerUser(usergeneric: UserGeneric) {
    try {
      // Crear el usuario con correo y contraseña
      const userCredential = await createUserWithEmailAndPassword(this.auth, usergeneric.email, usergeneric.password);
      const createdUser = userCredential.user;
  
      // Enviar correo de verificación
      await sendEmailVerification(createdUser);
  
      const uid = createdUser.uid;
  
      // Verificar el rol y almacenar en Firestore según corresponda
      if (usergeneric.rol === 'Student') {
        // Guardar solo los campos necesarios para el estudiante
        await setDoc(doc(this.firestore, 'students', uid), {
          uid: uid,
          name: usergeneric.name,
          rol: usergeneric.rol,
          saldo: usergeneric.saldo
          // No guardamos el teléfono, ya que no es necesario
        });
      } else if (usergeneric.rol === 'Driver') {
        // Guardar solo los campos necesarios para el chofer
        await setDoc(doc(this.firestore, 'drivers', uid), {
          uid: uid,
          name: usergeneric.name,
          rol: usergeneric.rol,
          telefono: usergeneric.telefono, // El chofer tiene teléfono
          saldo: usergeneric.saldo // Si aplica
        });
      } else if (usergeneric.rol === 'Admin') {
        // Guardar solo los campos necesarios para el administrador
        await setDoc(doc(this.firestore, 'admins', uid), {
          uid: uid,
          name: usergeneric.name,
          rol: usergeneric.rol,
          telefono: usergeneric.telefono // El administrador también tiene teléfono
        });
      }
  
      console.log('Usuario registrado y almacenado en Firestore.');
      
      // Mostrar alerta para verificar el correo
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
