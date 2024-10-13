import { Component, inject, Input, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem } from "@ionic/angular/standalone";
import { IonicModule } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/service/firebase.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports :[IonicModule,RouterLink,CommonModule]
}) 
export class HeaderComponent  implements OnInit {
  @Input() menuItem: { title: string; route: string }[] = [];
  @Input () title!: string;

  private auth = inject(FirebaseService);
  constructor(private router:Router) { }

  ngOnInit() {}

  signout(){
    this.auth.logout().then(()=>{
      this.router.navigate(['/home'])
    }).catch((error)=>{
      console.log("eeror ", error)
    })
  }
}
