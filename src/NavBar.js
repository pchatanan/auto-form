import React from 'react'
import { Link } from 'react-router-dom'
import firebase from 'firebase/app'
import 'firebase/auth'
import styled from 'styled-components'

const NavBarContainer = styled.div`
  width: 100vw;
  height: 60px;
  background: #000B4F;
  padding-left: 5px;
`

const MenuButton = styled.button`
  display: inline-block;
  height: 40px;
  margin: 10px 5px;
  background: #20368F;
  border: none;
  ourline: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    border: white solid 1px;
  }
`

const NavBar = props => {
  return <NavBarContainer>
    <Link to='/define' ><MenuButton>Define</MenuButton></Link>
    <Link to='/detect' ><MenuButton>Detect</MenuButton></Link>
    <Link to='/manage' ><MenuButton>Manage</MenuButton></Link>
    <Link to='/download' ><MenuButton>Download</MenuButton></Link>
    <MenuButton onClick={e => {
      firebase.auth().signOut()
    }}>Logout</MenuButton>
  </NavBarContainer>
}

export default NavBar