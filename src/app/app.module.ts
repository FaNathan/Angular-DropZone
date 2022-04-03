import { AngularDropzoneService } from './../../projects/angular-dropzone/src/lib/services/angular-dropzone.service';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AngularDropzoneModule } from 'projects/angular-dropzone/src/public-api';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';


import { AppComponent } from './app.component';
import { FakeUploaderService } from './services/fake-uploader.service';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AngularDropzoneModule, FormsModule, MatSlideToggleModule, BrowserAnimationsModule, ReactiveFormsModule, MatInputModule, MatSelectModule, MatButtonModule, MatRadioModule],
  providers: [{ provide: AngularDropzoneService, useClass: FakeUploaderService }],
  bootstrap: [AppComponent],
})
export class AppModule { }
