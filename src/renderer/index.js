import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
const dbHandler = require('./orderUp/dbHandler')

// even though we don't use this 'main' here, by requiring it
// we start the setup for serialport/escpos parsing/database stuff
//
// TODO: handle any setup errors and either crash program at startup or
//       display info to client
const main = require('./orderUp/main')

ReactDOM.render(<App/>, document.getElementById('app'))
