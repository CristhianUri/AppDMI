import { Component, OnInit,Input } from '@angular/core';
import { IonHeader } from "@ionic/angular/standalone";
import { IonicModule } from '@ionic/angular';
import { Router,RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FirebaseService } from 'src/app/service/firebase.service';
@Component({
  selector: 'app-menu-admin',
  templateUrl: './menu-admin.component.html',
  styleUrls: ['./menu-admin.component.scss'],
  standalone: true,
  imports:[IonicModule,RouterLink,CommonModule]
})
export class MenuAdminComponent  implements OnInit {
  @Input() title: string = '';
  @Input() cargo: string = '';
  @Input() menuItems: { title: string; route: string }[] = [];
  constructor(private router:Router,private auth: FirebaseService) { }

  ngOnInit() {}
  signout(){
    this.auth.logout().then(()=>{
      this.router.navigate(['/home'])
    }).catch((error)=>{
      console.log("eeror ", error)
    })
  }
}
