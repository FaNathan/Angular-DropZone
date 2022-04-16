import { HttpHeaders } from '@angular/common/http';
import { defaultMaxFileSize, defaultChunkUploadSize, defaultFileSizeUnit, defaultConcurrentUploadLimit, defaultMaxFileLimit } from './../../projects/angular-dropzone/src/lib/models/constants';
import { AngularDropzoneBase } from '../../projects/angular-dropzone/src/lib/components/angular-dropzone-base.component';
import { ChangeDetectionStrategy, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { AngularDropzoneAPI } from 'projects/angular-dropzone/src/lib/models/file.model';
import { FormBuilder } from '@angular/forms';
import { debounceTime, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class AppComponent implements OnInit {

  title = 'angular-dropzone-app';
  advancedDefaultValues = {
    autoUpload: true,
    chunkUploadSize: 5,
    fileSizeUnit: defaultFileSizeUnit,
    maxFileSize: defaultMaxFileSize,
    multiple: true,
    keepInvalidFiles: true,
    concurrentUploadLimit: defaultConcurrentUploadLimit,
    maxFileLimit: defaultMaxFileLimit,
    enabledChunkUpload: false,
  }
  avatarDefaultValues = {
    autoUpload: false,
    chunkUploadSize: 0,
    fileSizeUnit: defaultFileSizeUnit,
    maxFileSize: defaultMaxFileSize,
    multiple: false,
    keepInvalidFiles: true,
    concurrentUploadLimit: 1,
    maxFileLimit: defaultMaxFileLimit,
    enabledChunkUpload: false,
  }
  form = this.fb.group(this.advancedDefaultValues)
  console = console;
  remakeComponentFlag = true;
  debug = false;
  @ViewChild(AngularDropzoneBase) dropzone!: ElementRef<AngularDropzoneBase>;

  uploadApi = new AngularDropzoneAPI('http://localhost:5000/FileUpload/UploadLargeFile', 'POST');

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef) { }
  ngOnInit(): void {
    this.form.valueChanges.pipe(tap(() => {
      this.remakeComponentFlag = false;
      this.cdRef.detectChanges();
    }), debounceTime(2000)).subscribe(() => {
      this.remakeComponentFlag = true;
      this.cdRef.detectChanges();
    })
  }

  onReset(index: number) {
    switch (index) {
      case 1:
        this.form.setValue(this.advancedDefaultValues)
        break;
      case 0:
        this.form.setValue(this.avatarDefaultValues)
        break;

      default:
        break;
    }
  }
}
