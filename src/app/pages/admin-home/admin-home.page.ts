import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import {  Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.page.html',
  styleUrls: ['./admin-home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, CustomInputComponent, RouterLink]
})
export class AdminHomePage implements OnInit {

  


  constructor() { }

  ngOnInit() {}
}
