import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-admin-payment-history',
  templateUrl: './admin-payment-history.page.html',
  styleUrls: ['./admin-payment-history.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AdminPaymentHistoryPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
