import { AngularDropzoneService } from './services/angular-dropzone.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AngularDropzoneComponent } from './components/angular-dropzone.component';
import { ConvertSizeUnitPipe } from './pipes/convert-size-unit.pipe';
import { CropperjsComponent } from './components/cropperjs/cropperjs.component';

@NgModule({
  declarations: [AngularDropzoneComponent, ConvertSizeUnitPipe, CropperjsComponent],
  imports: [CommonModule, HttpClientModule],
  exports: [AngularDropzoneComponent],
  providers: [AngularDropzoneService],
  schemas: []
})
export class AngularDropzoneModule { }
