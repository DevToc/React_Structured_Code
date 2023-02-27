export enum DownloadOption {
  PNG = 'PNG',
  PNGHD = 'PNGHD',
  InteractivePDF = 'InteractivePDF',
}

export enum CustomPageOption {
  All = 'all',
  Custom = 'custom',
}

// Should update this accordingly when there will be more
// options for `DownloadOption` above
export const downloadFileType = {
  [DownloadOption.PNG]: 'PNG',
  [DownloadOption.PNGHD]: 'PNG HD',
  [DownloadOption.InteractivePDF]: 'PDF',
};
