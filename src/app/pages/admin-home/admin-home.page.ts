import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import { Router, RouterLink } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { FirebaseService } from 'src/app/service/firebase.service';
import { UtilsService } from 'src/app/service/utils.service';


@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.page.html',
  styleUrls: ['./admin-home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, CustomInputComponent, RouterLink, HeaderComponent]
})
export class AdminHomePage implements OnInit {
  private utils = inject(UtilsService)
  form = new FormGroup ({
    
    email : new FormControl('', [Validators.required,Validators.email]),
    saldo: new FormControl('', [Validators.required,]),
    saldo2: new FormControl('', [Validators.required,]),
  });
  title: string = 'Recargar';
  menuItem = [
    {title:'inicio',route:'/admin-home'},
    { title: 'Historial de recargas', route: '/admin-payment-history' },
    { title: 'Registrar', route: '/admin-register-chofer' },
    { title: 'Lista de conductores', route: '/admin-list' },

    // Agrega más elementos específicos para esta página
  ];
  userName: string | null = null;
  
  constructor(private router: Router, private firebaseService: FirebaseService) { }

  ngOnInit() {
    this.firebaseService.userName$.subscribe(name => this.userName = name);
    // Verificar si el usuario está autenticado
    
    const uid = localStorage.getItem('uid'); // Obtener el uid del localStorage
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('role')
    if (!isLoggedIn && !uid && !role) {
      this.router.navigate(['/auth']); // Redirige a la página de autenticación si no está autenticado
    } else {
      this.firebaseService.fetchUserDataByUid(uid); // Obtiene datos del usuario
    }
  }
  async submit(){

    if(this.form.valid){
      const email = this.form.value.email;
      const saldo = Number(this.form.value.saldo);
      const saldo2 = Number(this.form.value.saldo2);

      if (saldo === saldo2) {
        try {
          await this.firebaseService.recargarSaldo(email,saldo);
        } catch (error) {
          await this.utils.Alerta('Error','Ocurrio un problema al realizar la recarga');
        }
      }else{
        await this.utils.Alerta('Error','Revisas que los campos de saldo sean los mismos');
      }
      

    }

  }
}
