import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, UserCredential } from '@angular/fire/auth';
import { Firestore,orderBy,limit,startAfter,deleteDoc, doc,addDoc, setDoc,collection, query, where, getDocs, updateDoc } from '@angular/fire/firestore';
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
/// recargar saldo
  async recargarSaldo(email: string, saldo: number, modal?: any): Promise<void> {
    try {
      // Obtén el usuario autenticado que realiza la recarga
      const currentUser = this.auth.currentUser;

      if (!currentUser) {
        console.error('No hay un usuario autenticado realizando la operación');
        return;
      }

      // Referencia a la colección 'students' y consulta por email
      const studentsCollection = collection(this.firestore, 'students');
      const q = query(studentsCollection, where('email', '==', email));

      // Ejecuta la consulta
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Obtén el primer documento que coincida
        const docRef = querySnapshot.docs[0].ref;
        const data = querySnapshot.docs[0].data() as { saldo: number };

        // Actualiza el saldo
        const nuevoSaldo = (data.saldo || 0) + saldo;
        await updateDoc(docRef, { saldo: nuevoSaldo });
        console.log(`Saldo actualizado. Nuevo saldo: ${nuevoSaldo}`);

        // Registra la recarga en la colección 'recargas'
        const recargasCollection = collection(this.firestore, 'recargas');
        const recargaDoc = {
          email, // Email del usuario recargado
          monto: saldo, // Monto recargado
          fecha: new Date(), // Fecha y hora de la recarga
          recargadoPor: {

            uid: currentUser.uid, // UID del usuario que realizó la recarga
            email: currentUser.email, // Correo del usuario que realizó la recarga
          },
        };

        await addDoc(recargasCollection, recargaDoc);
        console.log('Recarga registrada correctamente');

        // Muestra un mensaje de confirmación



      } else {
        console.error('Usuario no encontrado');
        await this.utilSvc.Alerta('Exito','El usuario no fue encontrado.');
      }
    } catch (error) {
      console.error('Error al recargar saldo:', error);
      await this.utilSvc.Alerta('Exito','Ocurrió un error al realizar la recarga.');
    }
  }
 // FirebaseService (por ejemplo)
 async getAllUsers(collectionName: string) {
  try {
    const userCollection = collection(this.firestore, collectionName);
    const querySnapshot = await getDocs(userCollection);

    // Aquí asegúrate de devolver los datos correctos con uid
    const users = querySnapshot.docs.map(doc => {
      const userData = doc.data();
      return { ...userData, uid: doc.id }; // Añadimos 'uid' manualmente desde el ID del documento
    });

    return users;
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    throw error;
  }
}

  /**
   * Elimina un documento de una colección.
   * @param collectionName Nombre de la colección.
   * @param docId ID del documento a eliminar.
   */
  async deleteDocument(collectionName: string, docId: string) {
    const docRef = doc(this.firestore, `${collectionName}/${docId}`);
    await deleteDoc(docRef);
  }
  // obtener recargas
  async getRecargasPaginadas(lastDoc: any = null): Promise<{ recargas: any[], lastVisible: any }> {
    try {
      const recargasCollection = collection(this.firestore, 'recargas');
      let q = query(recargasCollection, orderBy('fecha', 'desc'), limit(5)); // Ordena y limita

      if (lastDoc) {
        q = query(recargasCollection, orderBy('fecha', 'desc'), startAfter(lastDoc), limit(5)); // Añade paginación
      }

      const querySnapshot = await getDocs(q);
      const recargas = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1]; // Último documento visible
      return { recargas, lastVisible };
    } catch (error) {
      console.error('Error al obtener recargas paginadas:', error);
      throw error;
    }
  }
  async actualizarSaldo(uid: string, saldo: number, modal?: any): Promise<void> {
    try {
      // Obtén el usuario autenticado que realiza la recarga
      const currentUser = this.auth.currentUser;

      if (!currentUser) {
        console.error('No hay un usuario autenticado realizando la operación');
        return;
      }

      // Referencia a la colección 'drivers' y consulta por email
      const studentsCollection = collection(this.firestore, 'drivers');
      const q = query(studentsCollection, where('uid', '==', uid));

      // Ejecuta la consulta
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Obtén el primer documento que coincida
        const docRef = querySnapshot.docs[0].ref;
        const data = querySnapshot.docs[0].data() as { saldo: number };

        // Actualiza el saldo
        const nuevoSaldo = (data.saldo || 0) + saldo;
        await updateDoc(docRef, { saldo: nuevoSaldo });
        console.log(`Saldo actualizado. Nuevo saldo: ${nuevoSaldo}`);


      } else {
        console.error('Usuario no encontrado');
        await this.utilSvc.Alerta('Exito','El usuario no fue encontrado.');
      }
    } catch (error) {
      console.error('Error al actualizar el saldo:', error);
      await this.utilSvc.Alerta('Errror','Ocurrió un error al realizar la recarga.');
    }
  }

  async obtenerSaldo(driverid: string) {
    try {
      // Obtén el usuario autenticado que realiza la recarga
      const currentUser = this.auth.currentUser;

      if (!currentUser) {
        console.error('No hay un usuario autenticado realizando la operación');
        return;
      }

      // Referencia a la colección 'drivers' y consulta por email
      const studentsCollection = collection(this.firestore, 'drivers');
      const q = query(studentsCollection, where('uid', '==', driverid));

      // Ejecuta la consulta
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Obtén el primer documento que coincida
        const docRef = querySnapshot.docs[0].ref;
        const data = querySnapshot.docs[0].data() as { saldo: number };

      let saldo = data.saldo;

      console.log("este es el saldo del chofer"+ ' '+ saldo)

      } else {
        console.error('Usuario no encontrado');
       // await this.utilSvc.Alerta('Exito','El usuario no fue encontrado.');
      }
    } catch (error) {
      console.error('Error al actualizar el saldo:', error);
    //  await this.utilSvc.Alerta('Errror','Ocurrió un error al realizar la recarga.');
    }
  }
}
