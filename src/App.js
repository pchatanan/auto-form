import React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import AppRouter from './AppRouter';

export const AuthContext = React.createContext()

const App = props => {
  const [authState, setAuthState] = React.useState({
    authenticating: true,
    user: null
  })
  React.useEffect(() => {
    console.log('useEffect Auth')
    return firebase.auth().onAuthStateChanged((user) => {
      setAuthState({
        authenticating: false,
        user: user
      })
    })
  }, [])

  console.log(process.env.REACT_APP_GOOGLE_APPLICATION_CREDENTIALS)
  return (
    <AuthContext.Provider value={authState}>
      <AppRouter />
    </AuthContext.Provider>
  )
}

export default App;
