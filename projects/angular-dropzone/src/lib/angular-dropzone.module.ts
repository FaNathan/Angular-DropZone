import { AngularDropzoneService } from './services/angular-dropzone.service';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AngularDropzoneBase } from './components/angular-dropzone-base.component';
import { ConvertSizeUnitPipe } from './pipes/convert-size-unit.pipe';
import { CropperjsComponent } from './components/cropperjs/cropperjs.component';
import { DropzoneAvatarComponent } from './components/dropzone-avatar/dropzone-avatar.component';
import { DropzoneAdvancedComponent } from './components/dropzone-advanced/dropzone-advanced.component';

@NgModule({
  declarations: [AngularDropzoneBase, ConvertSizeUnitPipe, CropperjsComponent, DropzoneAvatarComponent, DropzoneAdvancedComponent],
  imports: [CommonModule, HttpClientModule],
  exports: [AngularDropzoneBase, DropzoneAvatarComponent, DropzoneAdvancedComponent],
  providers: [AngularDropzoneService],
  schemas: []
})
export class AngularDropzoneModule { }
