import React, { Component } from 'react'
import axios from 'axios'
export default class Lab extends Component {
  state = {
    res: []
  }

  async componentDidMount() {
{/* para la IP LOCAL poner 192.168.1.203:5000 */}

    axios.get('http://localhost:5000/user/imagen').then(res => {
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
