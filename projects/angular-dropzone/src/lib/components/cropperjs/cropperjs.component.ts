import { defaultAvatarSize } from './../../models/constants';
import { Component, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';
import Cropper from 'cropperjs';

@Component({
  selector: 'lib-cropperjs',
  templateUrl: './cropperjs.component.html',
  styleUrls: ['./cropperjs.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CropperjsComponent implements AfterViewInit {

  @Input() file!: File;
  @Input() avatar: { width: number, height: number, round: boolean } = { width: defaultAvatarSize, height: defaultAvatarSize, round: true };
  @Output() croppedAvatar = new EventEmitter<File>();
  @Output() cancelCrop = new EventEmitter<boolean>();

  @ViewChild('cropper') cropper!: ElementRef<HTMLImageElement>;
  private cropperInstance!: Cropper;
  constructor() { }



  convertBlobToBase64(blob: Blob, element: HTMLImageElement) {
    let reader = new FileReader();
    reader.readAsDataURL(blob); // converts the blob to base64 and calls onload

    reader.onload = () => {
      element.src = reader.result as string; // data url
      this.cropperInstance = new Cropper(this.cropper.nativeElement, {
        aspectRatio: 1,
        viewMode: 0,
        dragMode: 'move',
        guides: false,
        minContainerWidth: 100,
      });
    };
  }

  getImageBlob() {
    this.cropperInstance.getCroppedCanvas().toBlob((blob) => {
      this.croppedAvatar.emit(new File([blob!], this.file.name));
    })
    this.cropperInstance.crop();

  }

  onCancel() {
    this.cancelCrop.emit(false);
  }

  ngAfterViewInit(): void {
    this.convertBlobToBase64(this.file, this.cropper.nativeElement);
  }


}
