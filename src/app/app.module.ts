import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FolderComponent } from './folder/folder.component';
import { PictureComponent } from './picture/picture.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FolderComponent,
    PictureComponent
  ],
  imports: [
    BrowserModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
