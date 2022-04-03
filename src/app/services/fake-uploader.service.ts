import { HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularDropzoneAPI, ChunkInfo } from 'projects/angular-dropzone/src/lib/models/file.model';
import { Observable, interval, take, map } from 'rxjs';

export class FakeUploaderService {

  constructor() { console.log('✔ Fake API Enabled'); }



  uploadMedia<T>(file: File, uploadAPI: AngularDropzoneAPI, chunkUpload?: ChunkInfo): Observable<HttpEvent<T>> {
    console.log('file: ', file);
    if (chunkUpload) {
      console.log('chunk info', chunkUpload);
    }
    const formData = new FormData();
    formData.append('file', file, file.name);
    if (chunkUpload) {
      formData.append('totalChunks', chunkUpload.totalChunks.toString());
      formData.append('currentChunk', chunkUpload.currentChunk.toString());
    }
    if (chunkUpload) {
      return interval(300).pipe(
        take(2),
        map((id) => id === 1 ? ({ type: 4, loaded: file.size }) : ({ type: 1, loaded: file.size + 1 })),
      );
    } else {
      return interval(300).pipe(
        take(21),
        map((id) => id === 20 ? ({ type: 4, loaded: file.size }) : ({ type: 1, loaded: id * (file.size / 20) })),
      );
    }
  }
}
