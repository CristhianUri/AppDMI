import { inject, Injectable } from '@angular/core';
import {LoadingController, ToastController, AlertController} from '@ionic/angular'

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject (ToastController);
  alertCtrl = inject(AlertController);
 async loading(message: string){
  console.log("creando loading");
    return this.loadingCtrl.create({
      message: message,
      spinner: 'crescent',
    });
  }

  async Alerta(header: string, message: string) {
    console.log("Creando alert")
    const alert = await this.alertCtrl.create({
        header: header, // Asegúrate de que este valor no sea indefinido
        message: message,
        buttons: ['OK']
    });
    console.log("presentatodo alert")
    await alert.present(); // Presenta la alerta
    
}

  async AlertaConOpciones(titulo: string, mensaje: string, onConfirm: () => void, onCancel: () => void) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            onCancel();
          }
        },
        {
          text: 'Sí',
          handler: () => {
            onConfirm();
          }
        }
      ]
    });

    await alert.present();
  }
  
}
