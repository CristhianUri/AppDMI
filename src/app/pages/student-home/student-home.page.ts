import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-student-home',
  templateUrl: './student-home.page.html',
  styleUrls: ['./student-home.page.scss'],
  standalone: true,
  imports: [IonicModule , CommonModule, FormsModule,HeaderComponent]
})
export class StudentHomePage implements OnInit {
  title: string = 'Administrador';
  menuItem = [
    // Agrega más elementos específicos para esta página
  ];
  constructor() { }

  ngOnInit() {
  }

}
