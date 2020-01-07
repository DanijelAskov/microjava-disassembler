import { Component } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  bytecode: ArrayBuffer;
  currentDate: Date = new Date();
  infoIcon: IconDefinition = faInfoCircle;

  setBytecode(bytecode: ArrayBuffer) {
    this.bytecode = bytecode;
  }

}