import { AngularDropzoneService } from './services/angular-dropzone.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AngularDropzoneComponent } from './components/angular-dropzone.component';
import { ConvertSizeUnitPipe } from './pipes/convert-size-unit.pipe';

@NgModule({
  declarations: [AngularDropzoneComponent, ConvertSizeUnitPipe],
  imports: [CommonModule, HttpClientModule],
  exports: [AngularDropzoneComponent],
  providers: [AngularDropzoneService],
  schemas: []
})
export class AngularDropzoneModule { }
