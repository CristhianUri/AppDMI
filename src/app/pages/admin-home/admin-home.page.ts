import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup,Validators,FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import {  Router, RouterLink } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';


@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.page.html',
  styleUrls: ['./admin-home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule ,IonicModule, CustomInputComponent, RouterLink, HeaderComponent]
})
export class AdminHomePage implements OnInit {

  form = new FormGroup ({
    name: new FormControl('',[Validators.required]),
    email : new FormControl('', [Validators.required,Validators.email]),
    password: new FormControl('', [Validators.required,Validators.maxLength(10),Validators.minLength(10)]),
    password2: new FormControl('', [Validators.required,Validators.maxLength(10),Validators.minLength(10)]),
  });
  title: string = 'Recargar';
  menuItem = [
    { title: 'Historial de recargas', route: '/admin-payment-history' },
    { title: 'Registrar', route: '/admin-register-chofer' },
    { title: 'Lista de conductores', route: '/admin-list' }

    // Agrega más elementos específicos para esta página
  ];


  constructor() { }

  ngOnInit() {}
}
