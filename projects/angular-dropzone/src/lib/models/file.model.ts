import { HttpHeaders, HttpParams } from "@angular/common/http";
import { FileStatus } from "./constants";

export class DropZoneFile {
  file: File;
  status: FileStatus;
  error: string[];
  // loaded: number; // amount of uploaded bytes
  progress: number;
  private _loaded = 0;

  public set loaded(v: number) {
    this.progress = +((v * 100) / (this.file.size || 1)).toPrecision(2);
    this._loaded = 0;
  }

  public get loaded(): number {
    return this._loaded;
  }

  constructor(file: File);
  constructor(file: File, status?: FileStatus, error?: number) {

    {
      this.file = file;
      this.status = FileStatus.Ready;
      this.error = [];
      this.loaded = 0;
      this.progress = 0;
    }

  }
}

export class AngularDropzoneAPI {
  url = "https://your_url.com/upload";
  method: "POST" | "GET" = "POST";
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  } = {
    };
  params?: HttpParams | {
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
  } = {
    }
  responseType: "blob" | "arraybuffer" | "text" | "json" | undefined = 'blob';
  withCredentials = false;

  constructor(url: string, method: "POST" | "GET") {
    this.url = url;
    this.method = method;
  }

}

export interface ChunkInfo {
  totalChunks: number;
  currentChunk: number;
}

export interface ValidatorFunction {
  fn: (file: DropZoneFile) => boolean;
  errorMessage: string;
}

export interface AvatarCropper {
  width: number;
  height: number;
  round: boolean;
  srcImage?: any;
}

