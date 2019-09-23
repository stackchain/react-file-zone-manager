import React, { useReducer, useCallback, useEffect } from "react"

import { FileManagerProps, FileManagerState, FileData, Status } from "./types"
import DropableArea from "./DropableArea"

type Action = {
  type: Symbol
}

type ActionSaveFile = Action & {
  payload: FileData
}

type ActionDeleteFile = Action & {
  name: string
}

type ActionMarkFileForDeletion = Action & {
  name: string
}

const SAVE_FILE = Symbol("SAVE_FILE")
const saveFile = (payload: FileData): ActionSaveFile => ({ type: SAVE_FILE, payload })
const DELETE_FILE = Symbol("DELETE_FILE")
const deleteFile = (name: string): ActionDeleteFile => ({ type: DELETE_FILE, name })
const MARK_FILE_FOR_DELETION = Symbol("MARK_DELETE_FILE")
const markFileForDeletion = (name: string): ActionMarkFileForDeletion => ({ type: MARK_FILE_FOR_DELETION, name })

const _isLoading = ({ files }: FileManagerState): boolean => !!files.filter((f: FileData) => f.status !== Status.Ready)

function reducer(state: FileManagerState, action: any) {
  switch(action.type) {
    case SAVE_FILE:
      let file = action.payload
      let found = false
      let files = state.files.map(f => {
        if (f.name === file.name) { 
          found = true
          return file // found -> replace
        }
        return f
      })
      let newSaveState = {
        ...state,
        files: !found ? [file, ...files] : files, // not found -> add
      }
      // TODO move it to MobX it looks dumb 
      newSaveState.isLoading = _isLoading(newSaveState)
      return newSaveState

    case DELETE_FILE:
      let { name } = action
      let newDeleteState = {
        ...state,
        files: state.files.filter(f => f.name !== name)
      }
      newDeleteState.isLoading = _isLoading(newDeleteState)
      return newDeleteState

    case MARK_FILE_FOR_DELETION:
      let { name: nameToMark } = action
      let newDeletionState = {
        ...state,
        files: state.files.map(f => {
          if (f.name === nameToMark) { 
            return {
              ...f,
              status: Status.AwaitingDeletion
            }
          }
          return f
        })
      }
      newDeletionState.isLoading = _isLoading(newDeletionState)
      return newDeletionState

      default:
      return state
  }
}

/**
 * A react component that handles simple files management
 * 
 * ```jsx
 *  const Container = styled.div`
 *  .centered {
 *    position: relative;
 *    top: 100px;
 *    margin: auto;
 *    height: 400px;
 *    width: 400px;
 *  }
 * `
 * const theme = {
 *  FileManager: {
 *    dropArea: {
 *      backgroundColor: "#efefef", // theme.palette.background.paper (mui)
 *      border: "2px dashed #5f5f5f"
 *    },
 *    item: {
 *      icon: {
 *        color: "#1a1a1a",
 *        size: {
 *          width: "50",
 *          height: "50"
 *        },
 *      },
 *      font: "500 11px arial,serif"
 *    }
 *  }
 * }
 * const willUpload = ({evt, file}: PromiseCb) => { 
 *   return new Promise((resolve, reject) => {
 *    setTimeout(() => {
 *        resolve({evt, file})
 *    }, Math.random() * 3000 + 1000)
 *  })
 * }
 *
 *const willDelete = (name: string) => { 
 *  return new Promise((resolve, reject) => {
 *    setTimeout(() => {
 *        resolve(name)
 *    }, Math.random() * 3000 + 1000)
 *  })
 *}
 *
 *const myFiles=["file1.pdf"]
 *
 *const App: React.FC = () => {
 *  return (
 *    <ThemeProvider theme={theme}>
 *       <Container>
 *         <FileManager loadedFiles={myFiles} className={'centered'} theme={theme} willDelete={willDelete} willUpload={willUpload} />
 *     </Container>
 *  </ThemeProvider>
 *  )
 *}
 * ```
 * 
 * @function FileManager
 * 
 * @param {boolean} disabled It turns off some functions i.e Drop/Delete
 * @param {string} className Css class for the container area
 * @param {Function} willDelete A promise factory to handle the file deletion - after marking for deletion
 * @param {Function} willUpload A promise factory to handle the file upload - after droping
 * @param {Array} loadedFiles List of file names that already exist
 * @param {object} theme={
 *   FileManager: {
 *     dropArea: {
 *       backgroundColor: "#efefef", * theme.palette.background.paper (mui)
 *       border: "2px dashed #5f5f5f"
 *     },
 *     item: {
 *       icon: {
 *         color: "#1a1a1a",
 *         size: {
 *           width: "50",
 *           height: "50"
 *         },
 *       },
 *       font: "500 11px arial"
 *     }
 *   }
 * } The UI attributes
 */
const FileManager: React.FC<FileManagerProps> = ({
  disabled,
  className,
  willDelete,
  willUpload,
  loadedFiles,
  theme = {
    FileManager: {
      dropArea: {
        backgroundColor: "#efefef", // theme.palette.background.paper (mui)
        border: "2px dashed #5f5f5f"
      },
      item: {
        icon: {
          color: "#1a1a1a",
          size: {
            width: "50",
            height: "50"
          },
        },
        font: "500 11px arial"
      }
    }
  }
}) => {
  const initialState = {
    isLoading: true,
    files: []
  }  
  const [state, dispatch] = useReducer(reducer, initialState)
  useEffect(() => {
    loadedFiles.forEach(name => dispatch(saveFile({
      name,
      percent: 100,
      status: Status.Ready
    })))
  }, [loadedFiles])
  const {
    isLoading,
    files,
  } = state

  // Fn that handles the file drop 
  const readFiles = useCallback((files: File[]) => {
    const stackLoadingFiles: Array<Promise<any>> = []
    // read the files
    files.forEach(file => stackLoadingFiles.push(new Promise((resolve, reject) => {
      dispatch(saveFile({
        name: file.name,
        percent: 0,
        status: Status.AwaitingLoad
      }))
      try {
        // prepare the events that will be captured
        const reader = new FileReader()
        reader.onabort = error => reject({ file, error })
        reader.onerror = error => reject({ file, error })
        reader.onloadend = evt => resolve({ file, evt })
        reader.onprogress = (e: ProgressEvent<FileReader>) => {
          dispatch(saveFile({
            name: file.name,
            percent: e.loaded / e.total * 100,
            status: Status.AwaitingLoad
          }))
        }
        // read the file content
        reader.readAsBinaryString(file)
      } catch (error) {
        reject({ file, error })
      }
    })))
    // Process all files
    Promise.all(stackLoadingFiles)
      .then((values) => { 
        values.forEach(({ evt, file }) => {
          let f = {
            name: file.name,
            percent: 0,
            status: Status.AwaitingUpload
          }
          dispatch(saveFile(f))
          // Invoke the 3rd part request for uploading
          willUpload({ evt, file })
            .then(({ file }) => {
              let f = {
              name: file.name,
              percent: 0,
              status: Status.Ready
            }
            dispatch(saveFile(f))
          })
        })
      })
      .catch(e => console.error(e))
  }, [])
  return (
    <DropableArea 
      files={files} 
      isLoading={isLoading}
      className={className}
      disabled={disabled}
      readFiles={readFiles}
      onDelete={(name: string) => { 
        dispatch(markFileForDeletion(name))
        willDelete(name)
          .then(name => {
            dispatch(deleteFile(name))
          })
      }}
      theme={theme}
    />
  )
}

export default FileManager