import { AngularDropzoneAPI, ChunkInfo } from './../models/file.model';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable } from 'rxjs';

@Injectable()
export class AngularDropzoneService {
  constructor(private http: HttpClient) { }

  uploadMedia<T>(file: File, uploadAPI: AngularDropzoneAPI, chunkUpload?: ChunkInfo): Observable<HttpEvent<T>> {

    const formData = new FormData();
    formData.append('file', file, file.name);
    if (chunkUpload) {
      formData.append('totalChunks', chunkUpload.totalChunks.toString());
      formData.append('currentChunk', chunkUpload.currentChunk.toString());
    }
    return this.http
      .request(uploadAPI.method, uploadAPI.url, {
        body: formData,
        reportProgress: true,
        observe: 'events',
        headers: uploadAPI.headers,
        params: uploadAPI.params,
        responseType: uploadAPI.responseType,
        withCredentials: uploadAPI.withCredentials,
      }).pipe(delay(300))
  }
}
