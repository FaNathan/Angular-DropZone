import { AngularDropzoneBase } from '../angular-dropzone-base.component';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, HostBinding, OnChanges, SimpleChanges } from '@angular/core';
import { AngularDropzoneService } from '../../services/angular-dropzone.service';
import { defaultAvatarSize, defaultChunkUploadSize } from '../../models/constants';
import { AvatarCropper } from '../../models/file.model';

@Component({
  selector: 'dropzone-avatar',
  templateUrl: './dropzone-avatar.component.html',
  styleUrls: ['./dropzone-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropzoneAvatarComponent extends AngularDropzoneBase implements OnChanges {
  @Input() avatar: AvatarCropper = { width: defaultAvatarSize, height: defaultAvatarSize, round: true };
  @Input() override readonly autoUpload = false;
  @Input() override readonly multiple = true;
  @Input() override readonly maxFileLimit = -1;
  @Input() override readonly keepInvalidFiles = true;
  @Input() override concurrentUploadLimit = 1;
  @Input() override allowedFormats: string[] = ['MIME:image/*'];
  @Input() override readonly chunkUploadSize = defaultChunkUploadSize;

  @HostBinding('style.width') width?: string;
  @HostBinding('style.height') height?: string;
  constructor(dropZoneService: AngularDropzoneService, cdRef: ChangeDetectorRef) {
    super(dropZoneService, cdRef);
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['avatar']?.firstChange) {
      if (changes['avatar'].currentValue?.width) {
        this.width = `${this.avatar.width}px`;
        this.height = `${this.avatar.height}px`;
      } else {
        throw ("Avatar details is not provided");
      }
    }
  }
  override analyseFile(index: number) {
    if (this.avatarEditMode) {
      this.files.splice(this.files.length - 1, 1);
      return;
    }
    if (this.checkMaxUploadCount(index)) {
      if (this.validateFile(index)) {
        if (this.checkConcurrentUpload(index)) {
          if (!this.avatarEditMode) {
            this.avatarEditMode = true;
          }
        }
      }
    }
  }
  onAvatarCropped(file: File) {
    this.files[this.files.length - 1].file = file;
    this.onStartUpload();
    this.avatarEditMode = false;
  }

  override bringRowToTheView(index: number) {
    // no need to do anything for avatar mode
  }

  onCancelEdit() {
    this.files = this.files.filter(f => f.status === this.fileStatus.Completed);
    this.avatarEditMode = false;
    this.concurrentUploadLimit++;
  }
  convertBlobToBase64(blob: Blob, element: HTMLImageElement) {
    let reader = new FileReader();
    reader.readAsDataURL(blob); // converts the blob to base64 and calls onload
    reader.onload = function () {
      element.src = reader.result as string; // data url
    };
  }

}
