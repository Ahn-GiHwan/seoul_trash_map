import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import Home from './Home'
import Map from './Map';
import Chart from './Chart'
import 'bootstrap/dist/css/bootstrap.css'

function index() {
  return (
    <div>
      <BrowserRouter>
        <Route exact path='/' component={Home} />
        <Route exact path='/map' component={Map} />
        <Route exact path='/chart' component={Chart} />
      </BrowserRouter>
    </div>
  );
}

export default index;