import React from 'react';
import Home from './home'
export default class Router extends React.Component {
  constructor (props) {
    super (props);
    this.state = { path: '/',
                   email: "",
                   token: "" }
  }

// find user is going to find the current user by their session and add it to the state
  // function FindUser(){
  //
  //     }

  render () {
    // this is where we'll have all the switch statements to render
    // the page we want, based on the state
    if (this.state.path==='/'){
      return  <Home />
    }

  }
}
