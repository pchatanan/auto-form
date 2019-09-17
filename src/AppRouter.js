import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import AreaDefiner from './AreaDefiner'
import NavBar from './NavBar'
import Detector from './Detector'
import Manager from './Manager'
import ManageTemplate from './ManageTemplate';
import ManageForm from './ManageForm'
import Login from './Login'
import { AuthContext } from './App'
import Spinner from './Spinner'
import styled from 'styled-components'
import DownloadPage from './DownloadPage';

const SpinnerDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(0deg, #829CD0 0%, rgba(255,255,255,1) 100%);
`

const secureRoute = (Component) => props => {
  const authState = React.useContext(AuthContext)
  if (authState.authenticating) {
    return <SpinnerDiv>
      <Spinner />
      <h3 style={{ color: '#000B4F' }}>Authenticating...</h3>
    </SpinnerDiv>
  }
  else {
    if (authState.user) {
      return <Component {...props} />
    }
    else {
      return <Login />
    }
  }
}

const AppRouter = secureRoute(props => {
  return <BrowserRouter style={{ width: '100vw', height: '100vh' }}>
    <Route path='/' component={NavBar} />
    <Route exact path='/define' component={AreaDefiner} />
    <Route exact path='/detect' component={Detector} />
    <Route path='/manage' component={Manager} />
    <Route exact path='/manage/:id' component={ManageTemplate} />
    <Route exact path='/manage/:id/:formId' component={ManageForm} />
    <Route exact path='/download' component={DownloadPage} />
  </BrowserRouter>
})

export default AppRouter