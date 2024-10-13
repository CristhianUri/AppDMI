import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import {  Router, RouterLink } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';


@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.page.html',
  styleUrls: ['./admin-home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, CustomInputComponent, RouterLink, HeaderComponent]
})
export class AdminHomePage implements OnInit {

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
