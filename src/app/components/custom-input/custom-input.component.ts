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

}
