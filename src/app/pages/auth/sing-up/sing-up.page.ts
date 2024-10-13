import { UtilsService } from './../../../service/utils.service';
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl,FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import { Router } from '@angular/router';
import { FirebaseService } from './../../../service/firebase.service';
import { Student } from './../../../model/user.model';



@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.page.html',
  styleUrls: ['./sing-up.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule,CustomInputComponent]
})
export class SingUpPage implements OnInit {
  form = new FormGroup ({
    name: new FormControl('',[Validators.required]),
    email : new FormControl('', [Validators.required,Validators.email]),
    password: new FormControl('', [Validators.required,Validators.maxLength(10),Validators.minLength(10)]),
    password2: new FormControl('', [Validators.required,Validators.maxLength(10),Validators.minLength(10)]),
  });

  private firebaseService= inject(FirebaseService);
  utilSvc= inject(UtilsService)


  constructor(private router:Router) { }

  ngOnInit() {
  }
  async submit(){
    if(this.form.value.password == this.form.value.password2){
      
      const student : Student = {
        uid: '',
        name: this.form.value.name,
        email: this.form.value.email,
        password: this.form.value.password,
        rol: 'Student',
        saldo: 0
      }
      const loading = await this.utilSvc.loading('Registrando');
      loading.present();
      try {
        await this.firebaseService.registerStudent(student);
        this.router.navigate(['/home']);
      } catch (error) {
        console.error(error);
      }finally{
        loading.dismiss();
      }
    }else{
      const loading = await this.utilSvc.loading('Registrando');
      loading.present();
      console.log('contraseñas no coniciden')
      loading.dismiss()
    }
  }
  goBack() {
    this.router.navigate(['/home']); // Cambia '/home' por la ruta de tu página de inicio
  }
}
