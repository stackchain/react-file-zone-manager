import React from "react"
import styled from "styled-components"

import { FileItemProps, Status } from "./types"

type Svg = {
  height: number;
  width: number;
  color: string;
}

/**
 *  Render function that returns the Icon in SVG
 * // TODO: returns ICON according the file type
 * 
 * @param {object} props
 * 
 * @param {number} props.height Icon height
 * @param {number} props.width Icon width
 * @param {string} props.color Stroke color of the icon
 */
const SvgFile: React.FC<Partial<Svg>> = ({ height = 50, width = 50, color="#222222" }) => {
   return (
    <svg height={`${height}px`} width={`${width}px`} fill={color} viewBox="0 0 32 32">
      <path d="M26.99,8.9442c-0.0042-0.0754-0.0183-0.1479-0.0394-0.2205c-0.0094-0.0324-0.015-0.0648-0.0276-0.096   c-0.04-0.0994-0.092-0.1945-0.1642-0.2785l-6-7c-0.0861-0.1006-0.1924-0.1727-0.3053-0.2308   c-0.0302-0.0156-0.0599-0.0267-0.0916-0.0391c-0.1007-0.0397-0.2048-0.0631-0.3132-0.0685C20.0319,1.0098,20.017,1,20,1H6   C5.4473,1,5,1.4478,5,2v28c0,0.5522,0.4473,1,1,1h20c0.5527,0,1-0.4478,1-1V9C27,8.9808,26.9911,8.9633,26.99,8.9442z M21,4.7033   L23.8256,8H21V4.7033z M7,29V3h12v6c0,0.5522,0.4473,1,1,1h5v19H7z">
      </path>
    </svg>
  )
}

const Container = styled.div`
  display: inherit;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 5px;
  margin: 5px;
  overflow: hidden;
  transition: opacity 0.6s ease-in-out;
  transition: background 0.25s ease-in-out;
  &:hover {
    background-color: rgb(225, 224, 222);
  }
`
const Span = styled.span`
  font: ${props => props.theme.FileManager.item.font};
`

/**
 *  Render function that returns the File component
 * 
 * @param {object} props
 * 
 * @param {string} props.name File name - used as ID
 * @param {number} props.percent The progress of the status
 * @param {Enum} props.status The status of the current item File 
 * @param {Function} props.onDelete Function that handles the file deletion - triggered by UI
 * @param {object} props.theme Theme from FileManager
 */
const FileItem: React.FC<FileItemProps> = ({
  name, 
  // percent, 
  status, 
  onDelete, 
  theme 
}) => {
  const isLoading = Status.Ready !== status
  const handleDelete = (evt: React.KeyboardEvent) => {
    if (evt.keyCode === 8 && !isLoading) {
      evt.preventDefault()
      onDelete(name)
    }
  }
  const { size: { width, height }, color } = theme.FileManager.item.icon
  return (
    <Container tabIndex={0} style={{opacity: isLoading? 0.3 : 1}} onKeyUp={handleDelete} >
      <SvgFile height={width} width={height} color={color} />
      <Span theme={theme}>{`${name}`}</Span>
    </Container>
  )
}

export default FileItem