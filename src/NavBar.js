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
  text-align: center;
`

const NavBarContainerHome = styled.div`
  display: block;
  width: 100vw;
  height: 100px;
  padding-left: 5px;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
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

const MenuButtonHome = styled.button`
  display: inline-block;
  height: 100%;
  width: 10em;
  height: 3em;
  margin: 10px 5px;
  background: #20368F;
  border: none;
  ourline: none;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 30px;
  &:hover {
    border: white solid 1px;
  }
`

const DescriptionDev = styled.div`
  margin: 10px 5px;
  font-size: 20px;
  color: #20368F;
  width: 10em;
`

const InlineBlock = styled.div`
  display: inline-block;
  vertical-align: top;
`

const NavBar = props => {
  const { pathname } = props.location
  if (pathname !== '/') {
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
  else {
    return <NavBarContainerHome>
      <InlineBlock>
        <Link to='/define' ><MenuButtonHome>Define</MenuButtonHome></Link>
        <DescriptionDev>Select the areas for the application to scan</DescriptionDev>
      </InlineBlock>
      <InlineBlock>
        <Link to='/detect' ><MenuButtonHome>Detect</MenuButtonHome></Link>
        <DescriptionDev>Detect, convert then save the written text within the selected areas</DescriptionDev>
      </InlineBlock>
      <InlineBlock>
        <Link to='/manage' ><MenuButtonHome>Manage</MenuButtonHome></Link>
        <DescriptionDev>View and edit patients' data</DescriptionDev>
      </InlineBlock>
      <InlineBlock>
        <Link to='/download' ><MenuButtonHome>Download</MenuButtonHome></Link>
        <DescriptionDev>Download selected patients' data as a CSV file</DescriptionDev>
      </InlineBlock>
      <MenuButtonHome onClick={e => {
        firebase.auth().signOut()
      }}>Logout</MenuButtonHome>
    </NavBarContainerHome>
  }

}

export default NavBar