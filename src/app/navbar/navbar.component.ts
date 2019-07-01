import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  @Output() zoomInEvent = new EventEmitter<string>();
  @Output() zoomOutEvent = new EventEmitter<string>();
  @Output() saveEvent = new EventEmitter<string>();

  // send action zoomIn to app.component
  sendZoomIn(): void {
    this.zoomInEvent.emit();
  }

  // send action zoomOut to app.component
  sendZoomOut(): void {
    this.zoomOutEvent.emit();
  }

  // send action save to app.component
  sendSave(): void {
    this.saveEvent.emit();
  }
}
