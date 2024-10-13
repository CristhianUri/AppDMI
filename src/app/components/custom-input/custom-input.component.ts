import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import {arrowBackOutline, personCircle} from 'ionicons/icons'

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule,ReactiveFormsModule ]
})
export class CustomInputComponent  implements OnInit {

  @Input() control!: FormControl;
  @Input() type!: string;
  @Input() label!: string;
  @Input() autocomplete!: string;
  @Input() icon!: string;
  
  @Input() maxlength: number = 10; // Recibe el valor del maxlength por defecto 10
  @Input() counter: boolean = false;  // Longitud máxima de caracteres
  @Input() isLengthRestricted: boolean = true;

  isPassword!: boolean;
  hide: boolean =true;

  constructor() { }

  ngOnInit() {
    if (this.type == 'password') this.isPassword = true;
  }

  showOrHidePassword(){
    this.hide = !this.hide;

    if(this.hide) this.type ='password';
    else this.type = 'text';
  }

  handleInput(event: any) {
    const input = event.target;

    // Controlar la longitud máxima de caracteres
    if (this.isLengthRestricted && input.value.length > this.maxlength) {
      input.value = input.value.slice(0, this.maxlength); // Recorta el valor
    }

    // Evitar caracteres negativos (si es que estás permitiendo números)
    if (this.type === 'number') {
      input.value = input.value.replace(/[^0-9]/g, ''); // Permitir solo números
    }

    this.control.setValue(input.value); // Actualiza el valor del control
  }

}
