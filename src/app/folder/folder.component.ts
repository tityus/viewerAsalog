import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.css']
})
export class FolderComponent implements OnInit {

  folders = [];
  files =[];
  selectedFolder: number;
  selectedImage: number;

  ngOnInit() {
    this.selectedFolder = 0;
  }

  @Output() viewImageEvent = new EventEmitter<number>();
  @Output() selectedFolderEvent = new EventEmitter<number>();

  // Recept folders list from app.component
  @Input() set foldersList(folders: Array<string>) {
    this.folders = folders;
  }

  // Recept files list from app.component
  @Input() set filesList(files: Array<string>) {
    this.files = files;
  }

  // Send id image is selected to app.component
  viewImage(id: number): void {
    this.selectedImage = id;
    this.viewImageEvent.emit(id);
  }

  // get files list filter by folder
  getFiles(folder: any): Array<any> {
    return this.files.filter(e => e.folder === folder);
  }

  // send folder is selected to app.component
  viewFolder(folder: any): void {
    this.selectedFolder = folder;
    this.selectedFolderEvent.emit(this.selectedFolder);
  }

}
