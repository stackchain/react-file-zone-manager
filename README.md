# react-file-zone-manager

[![npm](https://img.shields.io/npm/v/react-file-zone-manager.svg?style=flat-square)](https://www.npmjs.com/package/react-file-zone-manager)
[![Build Status](https://img.shields.io/travis/stackchain/react-file-zone-manager/master.svg?style=flat-square)](https://travis-ci.org/stackchain/react-file-zone-manager)

Simple React component to manage files using drag'n'drop

Source code at https://github.com/stackchain/react-file-zone-manager.


## Installation

Install it from npm and include it in your React build process (using [Webpack](http://webpack.github.io/), [Browserify](http://browserify.org/), etc).

```bash
npm install --save react-file-zone-manager
```
or:
```bash
yarn add react-file-zone-manager
```


## Usage
You can:

```jsx static
import 'react-app-polyfill/ie11'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import styled, { ThemeProvider } from 'styled-components'
import FileZoneManager from '../.'

const Container = styled.div`
  .centered {
    position: relative;
    top: 100px;
    margin: auto;
    height: 400px;
    width: 400px;
  }
`
const theme = {
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
     font: "500 11px arial,serif"
   }
 }
}
const willUpload = ({evt, file}) => {
  return new Promise((resolve, reject) => {
   setTimeout(() => {
      alert('Thanks for droping')
      resolve({evt, file})
   }, Math.random() * 3000 + 1000)
 })
}

 const willDelete = (name: string) => {
 return new Promise((resolve, reject) => {
   setTimeout(() => {
      alert('Wops deleted!')
      resolve(name)
   }, Math.random() * 3000 + 1000)
 })
}

const files = ["File 1.pdf", "File 2.pdf"]

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Container>
        <FileZoneManager loadedFiles={files} className={'centered'} theme={theme} willDelete={willDelete} willUpload={willUpload} />
      </Container>
    </ThemeProvider>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))

```

**IMPORTANT**: Under the hood, this lib makes use of [hooks](https://reactjs.org/docs/hooks-intro.html), therefore, using it requires React `>= 16.8`.

## License

MIT