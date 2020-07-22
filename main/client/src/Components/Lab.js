import React, { Component } from 'react'
import axios from 'axios'
export default class Lab extends Component {
  state = {
    res: []
  }

  async componentDidMount() {

    axios.get('http://192.168.0.109:5000/user/imagen').then(res => {
//console.log(res)
        } 
     )

}

render() {
  return (
    <div>
      {this.state.res}
    </div>
  )
}
}
