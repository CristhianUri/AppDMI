import { FirebaseService } from './../../service/firebase.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import {  Router, RouterLink } from '@angular/router';
import { User } from '../../model/user.model';
import { UtilsService } from 'src/app/service/utils.service';
@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [ ReactiveFormsModule,IonicModule, CommonModule, FormsModule,HeaderComponent,CustomInputComponent,RouterLink]
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
  }
  async submit(){
    if (this.form.valid) {
      const email = this.form.value.email;
      const password = this.form.value.password;
      const loading = await this.utilSvs.loading('Iniciando sesión');
      loading.present();
      try {
        await this.firebaseSvc.login(email,password );
      } catch (error) {
        console.log('error '+ error);
      }finally{
        loading.dismiss();
      }
    }else{
      
    }
  }

  goBack() {
    this.router.navigate(['/home']); // Cambia '/home' por la ruta de tu página de inicio
  }
}
