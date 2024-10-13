import { inject, Injectable } from '@angular/core';
import { Auth,createUserWithEmailAndPassword , signInWithEmailAndPassword} from '@angular/fire/auth';
import { Firestore,doc,setDoc} from '@angular/fire/firestore';
import { Student, User } from './../model/user.model';
import { getDoc } from 'firebase/firestore';
import { Router } from '@angular/router';




@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth= inject(Auth);
  firestore = inject(Firestore);
  router = inject(Router);

  async registerStudent(student: Student){
    try {
      const userUid= await createUserWithEmailAndPassword(this.auth, student.email,student.password);
      const uid = userUid.user.uid;

      await setDoc(doc(this.firestore, 'students', uid),{
        uid: uid,
        name: student.name,
        rol: student.rol,
        saldo: student.saldo
      })

      console.log('Usuario registrado');
    } catch (error) {
      console.error('error ' + error);
      throw error;
    }
  }
  async login(email: string , password: string): Promise <void>{
    try {
      const indentificador = await signInWithEmailAndPassword(this.auth, email, password);
      const uid = indentificador.user.uid;

      let docRef = doc(this.firestore, 'students', uid);
      let userSnap = await getDoc(docRef);
      if (userSnap.exists()) {
        const userInfo = userSnap.data();
        localStorage.setItem('name', userInfo['name']);
        this.router.navigate(['/student-home']);
        return;
      };
      docRef = doc(this.firestore, 'drivers', uid);
      userSnap = await getDoc(docRef);
      if (userSnap.exists()) {
        const userInfo = userSnap.data();
        localStorage.setItem('name', userInfo['name']);
        this.router.navigate(['/student-home']);
        return;
      };
      docRef = doc(this.firestore, 'admin', uid);
      userSnap = await getDoc(docRef);
      if (userSnap.exists()) {
        const userInfo = userSnap.data();
        localStorage.setItem('name', userInfo['name']);
        this.router.navigate(['/student-home']);
        return;
      }

    } catch (error) {
      
    }
  }

  logout(): Promise<void>{
    return this.auth.signOut();
  }
}
