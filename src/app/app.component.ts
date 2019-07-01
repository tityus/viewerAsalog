import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'asalogviewer';
  viewer: any = '';
  files = [];
  foldersList = ['Dossier 1'];
  selectedFolder = 0;
  
  eventsZoomIn: Subject<void> = new Subject<void>();
  eventsZoomOut: Subject<void> = new Subject<void>();
  eventsSave: Subject<void> = new Subject<void>();

  constructor(private modalService: NgbModal) {}

  // get file upload
  onFileChange(event: any): void {
    let reader  = new FileReader();
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = (): void => {
        // Add ID to file uploaded
        let id = this.files.length > 0 ? this.files[this.files.length-1].id + 1 : 1;
        this.files.push({id, folder: this.foldersList[this.selectedFolder], image: reader.result, points: []}); 
      }

    }
  }

  // Get zoomIn from navbar
  receiveZoomIn(): void {
    this.eventsZoomIn.next();
  }

  // Get zoomOut from navbar
  receiveZoomOut(): void {
    this.eventsZoomOut.next();
  }

  // Get id image from folder
  receiveShowImage($event: any): void {
    this.viewer = this.files.filter(e => e.id === $event)[0];
  }

  // Get folder from folder
  receiveSelectedFolder($event: any): void {
    this.selectedFolder = $event;
  }

  // Get save action from navbar
  receiveSave(): void {
    this.eventsSave.next();
  }

  // Get file saved from picture.component
  receiveFileSaved($event): void {
    let index = this.files.findIndex(e => e.id === $event.id);
    this.files[index].image = $event.image;
  }

  // add new folder in list
  addFolder(folder: string): void {
    if (folder) {
      this.foldersList.push(folder);
    }
  }

  // Modal open/close
  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.addFolder(result);
    }, () => { return; });
  }
}
