import React from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import styled from 'styled-components'
import { Input, Label, Button, H1 } from './UI';
import TextInput from './TextInput';
import Spinner from './Spinner';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(0deg, #829CD0 0%, rgba(255,255,255,1) 100%);
`

const Form = styled.form`
  width: 80%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
`

const Login = props => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  const login = e => {
    setLoading(true)
    setError(null)
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        setLoading(false)
      })
      .catch(error => {
        console.log(error)
        setLoading(false)
        setError(error)
      })
    e.preventDefault()
  }

  return <LoginContainer>
    <H1>Login</H1>
    <Form onSubmit={login}>
      <TextInput label='Email' value={email} onChange={e => { setEmail(e.target.value) }} />
      <TextInput label='Password' type='password' value={password} onChange={e => { setPassword(e.target.value) }} />
      {loading ? <Spinner /> : <Button type='submit'>Login</Button>}
      {error && <p style={{ color: 'darkred' }}>{error.message}</p>}
    </Form>
  </LoginContainer>
}

export default Login