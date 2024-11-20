import { AfterViewInit, Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule} from "@ionic/angular";
import { RouterLink } from '@angular/router';
import { IonContent,IonImg,IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent,IonImg,IonButton, CommonModule, RouterLink]
})
export class HomePage implements OnInit {
 constructor(){
  
 }
  /* 
  constructor(private renderer: Renderer2, private el: ElementRef) { }
ngAfterViewInit(): void {
    const element = this.el.nativeElement.querySelector('app-home');
    if (element) {
      this.renderer.removeClass(element, 'ion-page-invisible'); // Eliminar la clase manualmente
    }
  }*/

  ngOnInit() {
  }

}
