import React from "react"
import styled from "styled-components"
import { useDropzone } from "react-dropzone"

import { DroppableArea } from "./types"
import FileItem from "./FileItem"

const Area = styled.div`
  display: flex;
  flex-wrap: wrap;
  border: ${props => props.theme.FileManager.dropArea.border}
  background-color: ${props => props.theme.FileManager.dropArea.backgroundColor}
  align-items: flex-start;
  overflow-y: scroll;
`

const DropableArea: React.FC<DroppableArea> = ({ 
  isLoading, 
  readFiles, 
  files, 
  className, 
  disabled,
  onDelete,
  theme
}) => {
  const { 
    getRootProps,
    getInputProps,
  } = useDropzone({ 
    onDrop: droppedFiles => readFiles(droppedFiles), 
    disabled, 
    noClick: true 
  })
  return (
    <Area className={className} {...getRootProps()} theme={theme}>
      {isLoading}
      <input {...getInputProps()} />
      {files.map((val, key) => <FileItem {...val} key={key} onDelete={onDelete} theme={theme} />)}
    </Area>
  )
}

export default DropableArea;