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

export type DeleteCb = {
  willDelete(name: string): Promise<any>
}

export type UploadCb = {
  willUpload({ evt, file }: PromiseCb): Promise<any>
}

export type FileManagerProps = DeleteCb & UploadCb & {
  theme?: any
  loadedFiles: string[]
  disabled?: boolean
  className?: string
}

export function FileManager(props: FileManagerProps): JSX.Element