import { inject, Injectable } from '@angular/core';
import {LoadingController, ToastController} from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject (ToastController);

  loading(message: string){
    return this.loadingCtrl.create({
      message: message,
      spinner: 'crescent',
    });
  }
}
