import { AngularDropzoneAPI, ValidatorFunction } from '../models/file.model';
import { HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { catchError, of, takeWhile } from 'rxjs';
import { AngularDropzoneService } from '../services/angular-dropzone.service';

import { defaultChunkUploadSize, defaultConcurrentUploadLimit, defaultFileSizeUnit, defaultMaxFileLimit, defaultMaxFileSize, FileSizeTypes, FileStatus, SizeUnits } from '../models/constants';
import { QueuedFile } from '../models/file.model';
@Directive({
  selector: 'angular-core',
})
export class AngularDropzoneBase implements OnInit {


  @Input() multiple = true;
  @Input() validateFunctions: ValidatorFunction[] = [];
  @Input() keepInvalidFiles = true;
  @Input() maxFileLimit = defaultMaxFileLimit;
  @Input() maxFileSize = defaultMaxFileSize;
  @Input() fileSizeUnit: FileSizeTypes = defaultFileSizeUnit;
  @Input() concurrentUploadLimit = defaultConcurrentUploadLimit;
  @Input() uploadAPI!: AngularDropzoneAPI;
  @Input() allowedFormats: string[] = [];
  @Input() autoUpload = true;
  @Input() chunkUploadSize = defaultChunkUploadSize;

  @Output() uploaded = new EventEmitter<{ currentFile: QueuedFile, allFiles: QueuedFile[] }>();
  files: QueuedFile[] = [];
  fileStatus = FileStatus;
  displayUnit: FileSizeTypes = defaultFileSizeUnit;
  allowedFormatsString: string = '';
  @ViewChildren('file') fileRow = new QueryList<ElementRef<HTMLDivElement>>();
  @ViewChild('dropzoneContainer', { static: true }) container!: ElementRef<HTMLDivElement>;
  private dragEnterCounter = 0;
  avatarEditMode = false;

  @HostListener('dragenter', ['$event']) onDragEnter(el: DragEvent) {
    this.dragEnterCounter++;
    if (!this.container.nativeElement.classList.contains('drag-over')) {
      this.container.nativeElement.classList.add('drag-over');
    }
  }
  @HostListener('dragleave', ['$event']) onDragLeave(el: DragEvent) {
    this.dragEnterCounter--;
    if (this.dragEnterCounter === 0) {
      this.container.nativeElement.classList.remove('drag-over');

    }
  }
  @HostListener('drop', ['$event']) onDrop(el: DragEvent) {
    el.stopPropagation();
    this.dragEnterCounter = 0;
    this.container.nativeElement.classList.remove('drag-over');
    this.onBrowseFiles(el);
    return false;
  }
  @HostListener('dragover', ['$event']) onDragOver(el: DragEvent) {
    return false;
  }

  constructor(private dropZoneService: AngularDropzoneService, private cdRef: ChangeDetectorRef) { }
  ngOnInit(): void {
    if (!this.uploadAPI) {
      throw ("Endpoint is not provided");
    }
    this.displayUnit = this.fileSizeUnit;
    this.chunkUploadSize = this.chunkUploadSize * SizeUnits[this.fileSizeUnit];
    this.allowedFormats.forEach(format => {
      if (format.includes('MIME:')) {
        this.allowedFormatsString += `${format.replace('MIME:', '')},`
      } else {
        this.allowedFormatsString += `.${format.toLowerCase()},`
      }
    })
    if (this.maxFileSize) {
      this.validateFunctions.push(
        {
          fn: (item) =>
            item.file.size / SizeUnits[this.fileSizeUnit] <= this.maxFileSize, errorMessage: 'File size is larger than expected.'
        }
      )
    }
    if (this.allowedFormats.length > 0) {
      this.validateFunctions.push(
        {
          fn: (item) => {
            const fileExtensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi;
            const extension = item.file.name.toLowerCase().match(fileExtensionPattern) ?? [];
            if (extension.length === 0) {
              return false;
            }
            let isValid = false;
            this.allowedFormats.some(format => {
              if (format.includes('MIME:')) {
                isValid = !!(item.file.type.match(new RegExp(/\w+\/[-+.\w]+/g)));
                return isValid;
              } else {
                isValid = format.toLowerCase() === extension[0].replace('.', '');
                return isValid;
              }
            })
            return isValid;
          }
          , errorMessage: 'File type is not supported.'
        }
      )
    }
  }

  onBrowseFiles(event: Event | DragEvent) {
    let inputFiles: FileList | undefined | null;
    if ("dataTransfer" in event) {
      inputFiles = event.dataTransfer?.files;
    } else {
      inputFiles = (<HTMLInputElement>event.target).files;
    }
    if (inputFiles) {
      for (let i = 0; i < inputFiles.length; i++) {
        this.files.push(new QueuedFile(inputFiles[i]));
        this.analyseFile(this.files.length - 1);
      }
    }
  }

  onAvatarCropped(file: File) {
    this.files[this.files.length - 1].file = file;
    this.onStartUpload();
    this.avatarEditMode = false;
  }

  analyseFile(index: number) {
    if (this.checkMaxUploadCount(index)) {
      if (this.validateFile(index)) {
        if (this.checkConcurrentUpload(index)) {
          if (this.autoUpload) {
            this.upload(index);
          }
        }
      }
    }
  }
  validateFile(index: number): boolean {
    this.validateFunctions.forEach(item => {
      if (!item.fn(this.files[index])) {
        this.files[index].error.push(item.errorMessage);
      }
    })

    if (this.files[index].error.length === 0) {
      return true;
    } else {
      if (this.keepInvalidFiles) {
        this.files[index].status = FileStatus.Unsupported;
        this.bringRowToTheView(index);
      } else {
        this.files.splice(index, 1);
      }
      return false;
    }
  }

  bringRowToTheView(index: number) {
    this.cdRef.detectChanges();
    this.fileRow.get(index)?.nativeElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }
  checkMaxUploadCount(index: number): boolean {
    if (this.maxFileLimit !== -1) {
      const remainingLimit = this.maxFileLimit - this.files.filter(f => f.status !== FileStatus.Unsupported && f.status !== FileStatus.Canceled).length
      if (remainingLimit < 0) {
        this.files[index].status = FileStatus.Unsupported;
        if (this.keepInvalidFiles) {
          this.bringRowToTheView(index);
          this.files[index].error.push(`Cannot upload more than ${this.maxFileLimit} files.`);
        } else {
          this.files.splice(index, 1);
        }
        return false;
      }
    }
    return true;
  }

  checkConcurrentUpload(index: number): boolean {
    if (this.concurrentUploadLimit > 0) {
      this.concurrentUploadLimit--;
      return true;
    }
    this.files[index].status = FileStatus.Pending;
    this.cdRef.detectChanges();
    return false;
  }
  upload(index: number) {
    this.files[index].status = FileStatus.Uploading;
    if (this.chunkUploadSize) {
      const reader = new FileReader();
      const blob = this.files[index].file.slice(this.files[index].loaded, this.files[index].loaded + this.chunkUploadSize);
      const totalChunks = Math.ceil(this.files[index].file.size / this.chunkUploadSize);
      const currentChunk = Math.ceil((this.files[index].loaded || 1) / this.chunkUploadSize);
      let uploadedAmount = this.files[index].loaded; // uploaded amount before this chunk
      if (currentChunk === 0) {
        this.bringRowToTheView(index);
      }
      reader.readAsArrayBuffer(blob);
      reader.onload = (e) => {
        this.dropZoneService.uploadMedia<HttpProgressEvent>(new File([reader.result!], this.files[index].file.name), this.uploadAPI, { currentChunk, totalChunks }).pipe(
          catchError(err => {
            this.files[index].status = FileStatus.Canceled;
            this.files[index].loaded = 0;
            this.files[index].error = ["Unable to upload"];
            return of({ res: null, type: null });
          }),
          takeWhile(() => this.files[index].status !== FileStatus.Canceled)
        ).subscribe(
          {
            next:
              res => {
                switch (res.type) {
                  case HttpEventType.Sent:
                    break;
                  case HttpEventType.UploadProgress:
                    this.files[index].loaded = uploadedAmount + res.loaded;
                    if (this.files[index].loaded >= this.files[index].file.size) {
                      this.files[index].status = FileStatus.Processing;
                      this.files[index].loaded = this.files[index].file.size;
                    } else {
                      this.files[index].status = FileStatus.Uploading;
                    }
                    break;
                  case HttpEventType.Response:
                    if (this.files[index].loaded < this.files[index].file.size) {
                      this.upload(index)
                    }
                    break;
                  default:
                    break;
                }
                this.cdRef.detectChanges();
              }, error: () => {
                this.concurrentUploadLimit++;
                this.startNewUpload();
              }, complete: () => {
                if (this.files[index].loaded === this.files[index].file.size) {
                  this.files[index].status = FileStatus.Completed;
                  this.uploaded.emit({ currentFile: this.files[index], allFiles: this.files });
                  this.concurrentUploadLimit++;
                }
                if (this.files[index].status === FileStatus.Canceled) {
                  this.concurrentUploadLimit++;
                }
                this.startNewUpload();
              }
          })
      }
    } else {
      this.bringRowToTheView(index);
      this.dropZoneService.uploadMedia<HttpProgressEvent>(this.files[index].file, this.uploadAPI).pipe(
        catchError(err => {
          this.files[index].status = FileStatus.Canceled;
          this.files[index].loaded = 0;
          this.files[index].error = ["Unable to upload"];
          return of({ res: null, type: null });
        }),
        takeWhile(() => this.files[index].status !== FileStatus.Canceled)
      ).subscribe(
        {
          next:
            res => {
              switch (res.type) {
                case HttpEventType.Sent:
                  break;
                case HttpEventType.UploadProgress:
                  this.files[index].loaded = res.loaded;
                  if (this.files[index].loaded === this.files[index].file.size) {
                    this.files[index].status = FileStatus.Processing;
                  } else {
                    this.files[index].status = FileStatus.Uploading;
                  }
                  break;
                case HttpEventType.DownloadProgress:
                  break;
                case HttpEventType.Response:
                  this.files[index].status = FileStatus.Completed;
                  this.files[index].loaded = this.files[index].file.size;
                  break;
                default:
                  break;
              }
              this.cdRef.detectChanges();
            }, error: () => {
              this.concurrentUploadLimit++;
              this.startNewUpload();
            }, complete: () => {
              this.uploaded.emit({ currentFile: this.files[index], allFiles: this.files })
              this.concurrentUploadLimit++;
              this.startNewUpload();
            }
        })
    }
  }

  // pick first Pending item from files array
  startNewUpload() {
    const pendingUploadIndex = this.files.findIndex(f => f.status === FileStatus.Pending);
    if (pendingUploadIndex !== -1) {
      if (this.checkConcurrentUpload(pendingUploadIndex)) {
        this.upload(pendingUploadIndex);
      }
    } else if (this.files.filter(f => f.status === FileStatus.Uploading).length === 0) {
      this.cdRef.detectChanges();
    }
  }

  onCancel(index: number) {
    this.files[index].status = FileStatus.Canceled;
    this.files[index].loaded = 0;
  }
  onReset() {
    this.concurrentUploadLimit += this.files.filter(f => f.status === FileStatus.Ready).length;
    this.files = [];
  }
  onRestart(index: number) {
    this.files[index].error = [];
    this.files[index].status = FileStatus.Pending;
    if (this.concurrentUploadLimit > 0) {
      this.startNewUpload();
    }
  }
  onStartUpload() {
    this.files.forEach((f, index) => {
      if (f.status === this.fileStatus.Ready) {
        this.upload(index);
      }
    })
  }

  onToggleSizeUnit() {
    switch (this.displayUnit) {
      case "KB":
        this.displayUnit = "MB";
        break;
      case "MB":
        this.displayUnit = "GB";
        break;
      case "GB":
        this.displayUnit = "KB";
        break;
      default:
        this.displayUnit = "MB";
        break;
    }
  }
}
