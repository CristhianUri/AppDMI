import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import {  Router } from '@angular/router';




@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  standalone: true,
  imports: [ ReactiveFormsModule,IonicModule, CommonModule, FormsModule,HeaderComponent,CustomInputComponent,]
})
export class AuthPage implements OnInit {

  form = new FormGroup ({
    email : new FormControl('', [Validators.required,Validators.email]),
    password: new FormControl('', [Validators.required]),
  })

  constructor(private router: Router) { }

  ngOnInit() {
  }
  submit(){
    console.log(this.form.value);
  }

  goBack() {
    this.router.navigate(['/home']); // Cambia '/home' por la ruta de tu página de inicio
  }
}
