import { inject, Injectable } from '@angular/core';
import {LoadingController, ToastController, AlertController} from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject (ToastController);
  alertCtrl = inject(AlertController);
  loading(message: string){
    return this.loadingCtrl.create({
      message: message,
      spinner: 'crescent',
    });
  }
  Alerta(header:string,message: string){
    return this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
  }
  
}
