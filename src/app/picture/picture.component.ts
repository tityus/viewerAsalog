import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.css']
})
export class PictureComponent implements OnInit {

  // Config canvas
  canvasMaxWidth: number = 700;
  canvasMaxHeight: number = 500;
  canvasoffsetX: number = 0;
  canvasoffsetY: number = 0;
  ctx: any;
  img: any;
  dragged: boolean = false;
  _zoom = 1;

  // Image's value
  file: any;
  imageWidth: number = 0;
  imageHeight: number = 0;

  // mouse's position
  lastX: number = 0;
  lastY: number = 0;
  panX: number;
  panY: number;

  // savepoint
  points = [];

  // Emit file with savepoint
  @Output() fileSavedEvent = new EventEmitter<any>();

  // Observable
  eventsZoomInObservable: any;
  eventsZoomOutObservable: any;
  eventsSaveObservable: any;

  // Recept events (zoom, image)
  @Input() eventsZoomIn: Observable<void>;
  @Input() eventsZoomOut: Observable<void>;
  @Input() eventsSave: Observable<void>;
  @Input() set viewer(file: any) {
    this.file = file;
    if (this.img) {
      this.img.src = this.file.image
    }
  }

  // Running when component is mounted
  ngOnInit(){
    this.canvas();
    this.eventsZoomInObservable = this.eventsZoomIn.subscribe(() => this.zoom(true));
    this.eventsZoomOutObservable = this.eventsZoomOut.subscribe(() => this.zoom(false));
    this.eventsSaveObservable = this.eventsSave.subscribe(() => this.save());
  }

  // calc ratio size for image and canvas 
  calcSize(imageWidth: number, imageHeight: number): void {
    if (imageWidth > imageHeight) {
      if (imageWidth > this.canvasMaxWidth) {
        imageHeight *= this.canvasMaxWidth / imageWidth;
        imageWidth = this.canvasMaxWidth;
      }
    } else {
      if (imageHeight > this.canvasMaxHeight) {
        imageWidth *= this.canvasMaxHeight / imageHeight;
        imageHeight = this.canvasMaxHeight;
      }
    }
    this.imageWidth = imageWidth;
    this.imageHeight = imageHeight;
  }

  // draw element on canvas
  draw () {
    // clear canvas
    this.ctx.clearRect(0, 0, this.canvasMaxWidth, this.canvasMaxHeight);
    // draw image
    this.ctx.drawImage(this.img, this.panX, this.panY, this.imageWidth*this._zoom, this.imageHeight*this._zoom);

    // draw savepoint
    for (let i = 0; i < this.points.length; i++) {
      let img = this.points[i];
      this.ctx.beginPath();
      this.ctx.rect((img.x*this._zoom) + this.panX, (img.y*this._zoom) + this.panY, img.width, img.height);
      // this.ctx.arc((img.x*this._zoom) + this.panX, (img.y*this._zoom) + this.panY, 10, 0, 2 * Math.PI);
      this.ctx.strokeStyle = "rgba(255, 0, 0, 0.6)";
      this.ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
      this.ctx.fill();
      this.ctx.stroke();
    }
  }

  // get mouse coordinates
  mousePosition(e: any) {
    let mouseX = e.clientX - this.canvasoffsetX;
    let mouseY = e.clientY - this.canvasoffsetY;
    return {mouseX, mouseY};
  }

  // get last position of canvas, can change if windows resized
  canvasPosition(canvas: any): void {
    this.canvasoffsetX = canvas.left;
    this.canvasoffsetY = canvas.top;
  }

  // set the starting drag position
  dragPosition(mouseX: number, mouseY: number): void {
      this.lastX = mouseX;
      this.lastY = mouseY;
  }

  // calc how much mouse has moved since last
  calcLastMousePosition(mouseX: number, mouseY: number): void {
    this.panX += mouseX - this.lastX;
    this.panY += mouseY - this.lastY;
  }

  canvas() {
    // get canevas element
    let canvas = document.getElementsByTagName('canvas')[0];
    canvas.width = this.canvasMaxWidth;
    canvas.height = this.canvasMaxHeight;
    this.canvasPosition(canvas.getBoundingClientRect());

    this.ctx = canvas.getContext('2d');
    this.img = new Image();

    this.img.onload = () => {
      this.points = (this.file && this.file.points.length > 0) ? this.file.points : [];
      this.panX = 0;
      this.panY = 0;
      this._zoom = 1;
      this.imageWidth = this.img.width;
      this.imageHeight = this.img.height;
      this.calcSize(this.imageWidth, this.imageHeight);
      this.draw();
    }

    // load default image
    this.img.src = this.file.image || 'assets/images/default.png';

    let mousedown = (e: any) => {
      this.canvasPosition(canvas.getBoundingClientRect());
      const { mouseX, mouseY } = this.mousePosition(e);
      this.dragPosition(mouseX, mouseY);
      // Active the dragging
      this.dragged = true;
    }

    let mouseup = (e: any) => {
      // clear the dragging flag
      this.dragged = false;
    }

    let mousemove = (e: any) => {
      // if not dragging => exit
      if (!this.dragged) return;

      //get mouse coordinates
      this.canvasPosition(canvas.getBoundingClientRect());
      const { mouseX, mouseY } = this.mousePosition(e);
      this.calcLastMousePosition(mouseX, mouseY);
      this.dragPosition(mouseX, mouseY);
      this.draw();
    }

    // add savepoint with double click
    let dblclick = (e: any) => {
      //get mouse coordinates
      this.canvasPosition(canvas.getBoundingClientRect());
      const { mouseX, mouseY } = this.mousePosition(e);
      if (mouseX > this.panX && mouseX < this.imageWidth + this.panX && mouseY > this.panY && mouseY < this.imageHeight) {
        this.points.push({
          zoom: this._zoom,
          x: (mouseX - this.panX) / this._zoom,
          y: (mouseY - this.panY) / this._zoom,
          width: 10,
          height: 10,
        });
        this.draw();
      }
    }

    // Click for get infos savepoint and go to position + zoom saved
    let click = (e: any) => {
      this.canvasPosition(canvas.getBoundingClientRect());
      const { mouseX, mouseY } = this.mousePosition(e);
      this.calcLastMousePosition(mouseX, mouseY);
      this.dragPosition(mouseX, mouseY);

      // Find savepoint clicked
      let savepoint = this.points.findIndex(e => 
        mouseX > (e.x * this._zoom) + this.panX 
        && mouseX < (e.x * this._zoom) + this.panX + e.width 
        && mouseY > (e.y * this._zoom) + this.panY
        && mouseY < (e.y * this._zoom) + this.panY + e.height
      );

      // If find, go to this point
      if (savepoint > -1) {
        this._zoom = this.points[savepoint].zoom;
        this.panX = (this.canvasMaxWidth / 2) - (this.points[savepoint].x * this._zoom);
        this.panY = (this.canvasMaxHeight / 2) - (this.points[savepoint].y * this._zoom);
        this.draw();
      }
    }

    // create new listener
    canvas.addEventListener('mousedown', mousedown, false);
    canvas.addEventListener('mouseup', mouseup, false);
    canvas.addEventListener('mousemove', mousemove, false);
    canvas.addEventListener('dblclick', dblclick, false);
    canvas.addEventListener('click', click, false);
  }

  // Zoom function
  zoom(value: boolean) {
    if(this.imageWidth * this._zoom < 100 && value === false) return;
    this._zoom = value === false ? this._zoom - 0.1 : this._zoom + 0.1;
    this.draw();
  }

  // Save image with points
  save() {
    if(!this.file.image) return;
    // let canvas = document.getElementsByTagName('canvas')[0];
    // this.file.image = canvas.toDataURL();
    this.file.points = this.points;
    this.fileSavedEvent.emit(this.file);
  }

}
