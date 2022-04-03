import { HttpHeaders, HttpParams } from "@angular/common/http";
import { FileStatus } from "./constants";

export class QueuedFile {
  file: File;
  status: FileStatus;
  error: string[];
  loaded: number; // amount of uploaded bytes

  constructor(file: File);
  constructor(file: File, status?: FileStatus, error?: number) {

    {
      this.file = file;
      this.status = FileStatus.Ready;
      this.error = [];
      this.loaded = 0;
    }

  }
}

export class AngularDropzoneAPI {
  url = "https://your_url.com/upload";
  method: "POST" | "GET" = "POST";
  headers: HttpHeaders | {
    [header: string]: string | string[];
  } = {
    };
  params: HttpParams | {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  } = {
    }
  responseType: "blob" | "arraybuffer" | "text" | "json" | undefined = 'blob';
  withCredentials = false;

  constructor(url: string, method: "POST" | "GET", headers: HttpHeaders) {
    this.url = url;
    this.method = method;
    this.headers = headers;
  }

}

export interface ChunkInfo {
  totalChunks: number;
  currentChunk: number;
}

export interface ValidatorFunction {
  fn: (file: QueuedFile) => boolean;
  errorMessage: string;
}

