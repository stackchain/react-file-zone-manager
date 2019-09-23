export type Delete = {
  onDelete(name: string): void
}

export type Theme = {
  theme: any
}

export enum Status {
  AwaitingLoad = "LOADING",
  AwaitingUpload = "UP",
  AwaitingDeletion = "DELETE",
  Ready = "OK"
}

export type FileData = {
  name: string
  percent: number
  status: Status
}

export type PromiseCb = {
  evt: Event,
  file: FileData
}

export type FileItemProps = FileData & Theme & Delete

export type FileManager = Theme & {
  disabled?: boolean
  className?: string
}

export type FileManagerProps = FileManager & {
  loadedFiles: string[]
  willDelete(name: string): Promise<any>
  willUpload({ evt, file }: PromiseCb): Promise<any>
}

export type FileManagerState = {
  isLoading: boolean
  files: FileData[]
}

export type FileManagerType = FileManagerState & {
  readFiles(files: File[]): void
}

export type DroppableArea = FileManagerType & FileManager & Theme & Delete