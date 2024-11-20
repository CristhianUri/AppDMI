import { FirebaseService } from './../../service/firebase.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';

import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import {  Router, RouterLink } from '@angular/router';

import { UtilsService } from 'src/app/service/utils.service';
import { IonContent,IonIcon,IonImg,IonText,IonButton } from '@ionic/angular/standalone';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [ IonContent,IonIcon,IonImg,IonText,IonButton,ReactiveFormsModule, CommonModule, FormsModule,CustomInputComponent,RouterLink]
})
export class AuthPage implements OnInit {

  private firebaseSvc= inject(FirebaseService);
  utilSvs = inject(UtilsService);

  form = new FormGroup ({
    email : new FormControl('', [Validators.required,Validators.email]),
    password: new FormControl('', [Validators.required,Validators.maxLength(10),Validators.minLength(10)]),
  })

  constructor(private router: Router) { }

  ngOnInit() {
    console.log("se cargo componente");
  }
  async submit(){
    console.log("se presiono el boton");
    if (this.form.valid) {
      console.log("if");
      
      const email = this.form.value.email;
      const password = this.form.value.password;
      console.log(email+ ' '+password);
     /* const loading = await this.utilSvs.loading('Iniciando sesión');
      loading.present()*/
      try {
        console.log("dentro del try");
        await this.firebaseSvc.login(email,password );
      } catch (error) {
        console.log('error '+ error);
      }
    }else{
      console.log("else");
    }
  }

  goBack() {
    this.router.navigate(['/home']); // Cambia '/home' por la ruta de tu página de inicio
  }
}
