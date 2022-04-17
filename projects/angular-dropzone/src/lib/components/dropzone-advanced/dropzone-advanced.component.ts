import { AngularDropzoneBase } from '../angular-dropzone-base.component';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AngularDropzoneService } from '../../services/angular-dropzone.service';

@Component({
  selector: 'dropzone-advanced',
  templateUrl: './dropzone-advanced.component.html',
  styleUrls: ['./dropzone-advanced.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropzoneAdvancedComponent extends AngularDropzoneBase {

  constructor(dropZoneService: AngularDropzoneService, cdRef: ChangeDetectorRef) {
    super(dropZoneService, cdRef);
  }


}
