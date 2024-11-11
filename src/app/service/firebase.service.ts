import { inject, Injectable } from '@angular/core'; 
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, UserCredential } from '@angular/fire/auth';
import { Firestore, doc, setDoc,collection, query, where, getDocs, updateDoc } from '@angular/fire/firestore';
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
  private balance$ = new BehaviorSubject<number | null>(null);

  get authenticated$() {
    return this.isLoggedIn$.asObservable();
  }

  get userRole$() {
    return this.role$.asObservable();
  }

  get userBalance$(){
    return this.balance$.asObservable();
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
          email: usergeneric.email,
          rol: usergeneric.rol,
          saldo: usergeneric.saldo,
          fecha_Creacion: usergeneric.fecha 
        });
      } else if (usergeneric.rol === 'Driver') {
        await setDoc(doc(this.firestore, 'drivers', uid), {
          uid: uid,
          name: usergeneric.name,
          rol: usergeneric.rol,
          telefono: usergeneric.telefono,
          saldo: usergeneric.saldo,
          fechar_Creacion: usergeneric.fecha
        });
      } else if (usergeneric.rol === 'Admin') {
        await setDoc(doc(this.firestore, 'admins', uid), {
          uid: uid,
          name: usergeneric.name,
          rol: usergeneric.rol,
          telefono: usergeneric.telefono,
          fechar_Creacion: usergeneric.fecha
        });
      }

      console.log('Usuario registrado y almacenado en Firestore.');

      // Mostrar alerta para verificar el correo
      await this.utilSvc.Alerta('Correo de verificación', 'Se ha enviado un correo de verificación. Por favor, revisa tu bandeja de entrada.');

    } catch (error) {
      if (error.code ==='auth/email-already-in-use' ) {
        await this.utilSvc.Alerta('Correo en uso','Este correo ya esta en uso')
      } else {
        console.log('Error al resgistrar')
      }
    }
  }

  async getCurrentUser(userCredential: UserCredential): Promise<UserGeneric | null> {
    const user = userCredential.user;
    if (user) {
      const uid = user.uid;
      return await this.fetchUserDataByUid(uid);
    }
    this.isLoggedIn$.next(false);
    return null; // Si no hay usuario autenticado
  }
  
  async fetchUserDataByUid(uid: string): Promise<UserGeneric | null> {
    if (uid) {
      try {
        const userSnap = await getDoc(doc(this.firestore, 'students', uid));
        if (userSnap.exists()) {
          const data = userSnap.data();
          this.isLoggedIn$.next(true);
          this.role$.next('Student');
          this.name$.next(data['name']);
          this.balance$.next(data['saldo']);
          return { ...data, uid: uid } as UserGeneric;
        }
  
        // Repite para 'drivers' y 'admins'
        const driverSnap = await getDoc(doc(this.firestore, 'drivers', uid));
        if (driverSnap.exists()) {
          const data = driverSnap.data();
          this.isLoggedIn$.next(true);
          this.role$.next('Driver');
          this.name$.next(data['name']);
          this.balance$.next(data['saldo']);
          return { ...data, uid: uid } as UserGeneric;
        }
  
        const adminSnap = await getDoc(doc(this.firestore, 'admins', uid));
        if (adminSnap.exists()) {
          const data = adminSnap.data();
          this.isLoggedIn$.next(true);
          this.role$.next('Admin');
          this.name$.next(data['name']);
          this.balance$.next(data['saldo']);
          return { ...data, uid: uid } as UserGeneric;
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
      const user = userCredential.user;
  
      // Comprobar si el correo está verificado
      if (!user.emailVerified) {
        // Mostrar alerta personalizada
        await this.utilSvc.AlertaConOpciones(
          'Correo no verificado',
          'Por favor, verifica tu correo antes de iniciar sesión.',
          async () => {
            // Reenviar correo de verificación
            await sendEmailVerification(user);
            await this.utilSvc.Alerta('Correo reenviado', 'Se ha reenviado el correo de verificación.');
          },
          () => {
            // Acción si el usuario no quiere reenviar
            console.log('El usuario no desea reenviar el correo.');
          }
        );
  
        // Cerrar sesión antes de mostrar la alerta
        await this.auth.signOut();
        return; // Salir del método
      }
  
      // Solo si el correo está verificado, procedemos a obtener el usuario actual
      await this.getCurrentUser(userCredential); 
  
      // Almacenar en localStorage
      const uid = user.uid;
      
      const userData = await this.getCurrentUser(userCredential);
    if (userData) {
      // Aquí almacenas en localStorage y actualizas los observables
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('role', userData.rol);
      localStorage.setItem('name', userData.name);
      localStorage.setItem('uid', uid);
      this.isLoggedIn$.next(true); // Actualiza el estado de autenticación
      this.role$.next(userData.rol); // Establece el rol correspondiente
      this.router.navigate([`/${userData.rol.toLowerCase()}-home`]); // Navegación basada en el rol
    }
  
    } catch (error) {
console.log(error);
await this.utilSvc.Alerta('Error','Correo o contraseña invalidos' )
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
    this.router.navigate(['/auth']); // Redirige a la página de autenticación
    return this.auth.signOut();
  }

  async recargarSaldo(email: string, saldo: number): Promise<void> {
    try {
      // 1. Crea la referencia a la colección y la consulta por email
      const studentsCollection = collection(this.firestore, 'students');
      const q = query(studentsCollection, where('email', '==', email));

      // 2. Ejecuta la consulta
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Obtén el primer documento que coincida
        const docRef = querySnapshot.docs[0].ref;
        const data = querySnapshot.docs[0].data() as { saldo: number };

        // 3. Actualiza el saldo
        const nuevoSaldo = (data.saldo || 0) + saldo;
        await updateDoc(docRef, { saldo: nuevoSaldo });
        console.log(`Saldo actualizado. Nuevo saldo: ${nuevoSaldo}`);
      } else {
        console.error('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al recargar saldo:', error);
    }
  }
  
}
