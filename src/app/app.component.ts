import { defaultMaxFileSize, defaultFileSizeUnit, defaultConcurrentUploadLimit, defaultMaxFileLimit } from './../../projects/angular-dropzone/src/lib/models/constants';
import { AngularDropzoneBase } from '../../projects/angular-dropzone/src/lib/components/angular-dropzone-base.component';
import { ChangeDetectionStrategy, ViewChild, ElementRef, OnInit, ChangeDetectorRef } from '@angular/core';
import { Component } from '@angular/core';
import { AngularDropzoneAPI, AvatarCropper, DropZoneFile } from 'projects/angular-dropzone/src/lib/models/file.model';
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
    autoUpload: { value: true, disabled: false },
    chunkUploadSize: 5,
    fileSizeUnit: defaultFileSizeUnit,
    maxFileSize: defaultMaxFileSize,
    multiple: { value: true, disabled: false },
    keepInvalidFiles: { value: true, disabled: false },
    concurrentUploadLimit: defaultConcurrentUploadLimit,
    maxFileLimit: defaultMaxFileLimit,
    enabledChunkUpload: { value: false, disabled: false },
  }
  avatarDefaultValues = {
    autoUpload: { value: false, disabled: true },
    chunkUploadSize: 0,
    fileSizeUnit: defaultFileSizeUnit,
    maxFileSize: defaultMaxFileSize,
    multiple: { value: false, disabled: true },
    keepInvalidFiles: { value: false, disabled: true },
    concurrentUploadLimit: 1,
    maxFileLimit: defaultMaxFileLimit,
    enabledChunkUpload: { value: false, disabled: true },
  }
  form = this.fb.group(this.avatarDefaultValues)
  console = console;
  remakeComponentFlag = true;
  debug = false;
  roundAvatarCropper = {
    width: 200,
    height: 200,
    round: true,
    srcImage: ''
  };
  avatarCropper = {
    width: 200,
    height: 200,
    round: false,
    srcImage: ''
  };
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

  onIndexChanged(index: number) {
    this.avatarCropper.srcImage = '';
    this.roundAvatarCropper.srcImage = '';
    switch (index) {
      case 0:
        this.form.reset(this.avatarDefaultValues);
        break;
      case 1:
        this.form.reset(this.advancedDefaultValues);
        break;

      default:
        break;
    }
  }
  onAvatarUploaded(event: { currentFile: DropZoneFile; allFiles: DropZoneFile[]; }, avatar: AvatarCropper) {
    avatar.srcImage = event.currentFile.file;
  }
}
