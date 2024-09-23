import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import {arrowBackOutline, personCircle} from 'ionicons/icons'
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterLink]
})
export class RegistrarPage implements OnInit {

  constructor() { 
    addIcons({arrowBackOutline, personCircle})
  }

  ngOnInit() {
  }

}
