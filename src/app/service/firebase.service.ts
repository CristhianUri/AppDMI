import { inject, Injectable } from '@angular/core'; 
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { UserGeneric } from './../model/user.model';
import { getDoc } from 'firebase/firestore';
import { Router } from '@angular/router';
import { UtilsService } from './utils.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private router = inject(Router);
  private utilSvc = inject(UtilsService);
  private isLoggedIn$ = new BehaviorSubject<boolean>(false);
  private role$ = new BehaviorSubject<string | null>(null);
  private name$ = new BehaviorSubject<string | null>(null);

  get authenticated$() {
    return this.isLoggedIn$.asObservable();
  }

  get userRole$() {
    return this.role$.asObservable();
  }

  get userName$() {
    return this.name$.asObservable();
  }

  constructor() {
    this.checkLocalStorage();
  }

  private checkLocalStorage() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');

    if (isLoggedIn === 'true' && role) {
      this.isLoggedIn$.next(true);
      this.role$.next(role);
      this.name$.next(name);
      // Navega a la ruta correspondiente según el rol
      this.router.navigate([`/${role.toLowerCase()}-home`]);
    }
  }

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
        await setDoc(doc(this.firestore, 'students', uid), {
          uid: uid,
          name: usergeneric.name,
          rol: usergeneric.rol,
          saldo: usergeneric.saldo
        });
      } else if (usergeneric.rol === 'Driver') {
        await setDoc(doc(this.firestore, 'drivers', uid), {
          uid: uid,
          name: usergeneric.name,
          rol: usergeneric.rol,
          telefono: usergeneric.telefono,
          saldo: usergeneric.saldo
        });
      } else if (usergeneric.rol === 'Admin') {
        await setDoc(doc(this.firestore, 'admins', uid), {
          uid: uid,
          name: usergeneric.name,
          rol: usergeneric.rol,
          telefono: usergeneric.telefono
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

  // Método para obtener el usuario actual y su rol
  async getCurrentUser(userCredential: UserCredential): Promise<UserGeneric | null> {
    const user = userCredential.user; 
    if (user) {
      try {
        const uid = user.uid;
  
        const userSnap = await getDoc(doc(this.firestore, 'students', uid));
        if (userSnap.exists()) {
          this.isLoggedIn$.next(true);
          this.role$.next('Student');
          this.name$.next(userSnap.data()['name']);
          return { ...userSnap.data(), uid: uid } as UserGeneric;
        }
  
        const driverSnap = await getDoc(doc(this.firestore, 'drivers', uid));
        if (driverSnap.exists()) {
          this.isLoggedIn$.next(true);
          this.role$.next('Driver');
          this.name$.next(driverSnap.data()['name']);
          return { ...driverSnap.data(), uid: uid } as UserGeneric;
        }
  
        const adminSnap = await getDoc(doc(this.firestore, 'admins', uid));
        if (adminSnap.exists()) {
          this.isLoggedIn$.next(true);
          this.role$.next('Admin');
          this.name$.next(adminSnap.data()['name']);
          return { ...adminSnap.data(), uid: uid } as UserGeneric;
        }
      } catch (error) {
        console.error('Error al obtener el usuario actual: ', error);
      }
    }
    this.isLoggedIn$.next(false);
    this.role$.next(null);
    this.name$.next(null);
    return null; // Si no hay usuario autenticado
  }
  
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      await this.getCurrentUser(userCredential); // Pasa userCredential como parámetro
  
      // Almacenar en localStorage para persistencia
      const user = userCredential.user; 
      const uid = user.uid;
  
      // Verificar el rol del usuario y almacenar en localStorage
      const userSnap = await getDoc(doc(this.firestore, 'students', uid));
      if (userSnap.exists()) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', 'Student');
        localStorage.setItem('name', userSnap.data()['name']);
        localStorage.setItem('uid', uid);
        this.router.navigate(['/student-home']);
        return;
      }
  
      const driverSnap = await getDoc(doc(this.firestore, 'drivers', uid));
      if (driverSnap.exists()) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', 'Driver');
        localStorage.setItem('name', driverSnap.data()['name']);
        localStorage.setItem('uid', uid);
        this.router.navigate(['/driver-home']);
        return;
      }
  
      const adminSnap = await getDoc(doc(this.firestore, 'admins', uid));
      if (adminSnap.exists()) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('role', 'Admin');
        localStorage.setItem('name', adminSnap.data()['name']);
        localStorage.setItem('uid', uid);
        this.router.navigate(['/admin-home']);
        return;
      }
    } catch (error) {
      console.error('Error en el inicio de sesión: ', error);
    }
  }
  
  logout(): Promise<void> {
    this.isLoggedIn$.next(false);
    this.role$.next(null);
    this.name$.next(null);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    localStorage.removeItem('uid');
    return this.auth.signOut();
  }
}
