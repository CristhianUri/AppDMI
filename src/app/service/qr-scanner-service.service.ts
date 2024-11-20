import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import * as QRCode from 'qrcode';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class QrScannerServiceService {
  constructor(private firestore: Firestore) {}
  // Validar QR escaneado
  async validateQr(data: string): Promise<{ valid: boolean, payload?: any }> {
    try {
      const parsedData = JSON.parse(data);
      const qrTime = new Date(parsedData.timestamp).getTime();
      const now = new Date().getTime();
      const differenceInMinutes = (now - qrTime) / 60000;

      if (differenceInMinutes > 20) {
        return { valid: false };
      }
      return { valid: true, payload: parsedData };
    } catch (e) {
      return { valid: false };
    }
  }
}
