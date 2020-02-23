
import React from 'react'
import { render } from 'react-dom'

import Dialog from './components/dialog/dialog'

const innertReactApp = () => {
  const reactRoot = document.createElement('div')
  reactRoot.setAttribute('id', 'notionplus')
  document.body.append(reactRoot)
  render(React.createElement(Dialog), reactRoot)
}

innertReactApp()
console.log('NotionPlus actived V2.0.13');