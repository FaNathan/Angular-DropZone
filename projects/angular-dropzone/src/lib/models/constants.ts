
export enum FileStatus {
  Ready = 'Ready',
  Pending = 'Pending',
  Uploading = 'Uploading',
  Processing = 'Processing',
  Completed = 'Completed',
  Unsupported = 'Unsupported',
  Canceled = 'Canceled',
}

export const defaultConcurrentUploadLimit = 5;
export const defaultMaxFileLimit = -1; // Unlimited
export const defaultMaxFileSize = 40000;
export const defaultFileSizeUnit = 'MB';
export const defaultChunkUploadSize = 0;

export type FileSizeTypes = "KB" | "MB" | "GB";

export const SizeUnits: { [key: string]: number } = {
  KB: 1024,
  MB: 1048576,
  GB: 1073741824,
};
