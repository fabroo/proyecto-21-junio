import React from 'react';
import Navbar from './Components/Navbar';
import Login from './Components/Login';
import Home from './Components/Home';
import Upload from './Components/Upload';
import Register from './Components/Register';
import Admin  from './Components/Admin';
import Mod  from './Components/Mod';
import PrivateRoute from './hocs/PrivateRoute';
import UnPrivateRoute from './hocs/UnPrivateRoute';
import {BrowserRouter as Router, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      
      <Navbar/>
      <Route exact path="/" component={Home}/>
      <UnPrivateRoute path="/login" component={Login}/>
      <UnPrivateRoute path="/register" component={Register}/>
      <PrivateRoute path="/admin" roles={["admin","mod"]} component={Admin}/>
      <PrivateRoute path="/mod" roles={["mod"]} component={Mod}/>
      <PrivateRoute path="/upload" roles={["user","admin","mod"]} component={Upload}/>
    </Router>
    

  );
}

export default App;
