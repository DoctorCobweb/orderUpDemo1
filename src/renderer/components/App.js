import React from 'react'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      height: 12
    }
  }

  render() {
    return (
      <div>
        <p>hello react from App component</p>
        <p>height is {this.state.height}</p>
      </div>
    )
  }
}