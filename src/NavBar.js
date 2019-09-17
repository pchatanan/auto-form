import React from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase/app'
import 'firebase/auth'

const NavBar = props => {
  return <div>
    <Link to='/define' ><button>Define</button></Link>
    <Link to='/detect' ><button>Detect</button></Link>
    <Link to='/manage' ><button>Manage</button></Link>
    <Link to='/download' ><button>Download</button></Link>
    <button onClick={e => {
      firebase.auth().signOut()
    }}>Logout</button>
  </div>
}

export default NavBar