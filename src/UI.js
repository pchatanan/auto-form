import styled from 'styled-components'


const Label = styled.label`
  color: Grey;
  ${props => props.focus && `
    color: #000B4F;
    font-weight: bold;
    `}
`

const Input = styled.input`
  padding: 10px;
  border: none;
  border-bottom: 1px solid Grey;
  outline: none;
  &:focus {
    border-bottom: 2px solid #000B4F;
  }
  background: transparent;
  margin-bottom: 0.8em;
`

const Button = styled.button`
  padding: 0.8em;
  background: #000B4F;
  color: white;
  border: none;
  cursor: pointer;
  &:hover {
    background: #20368F;
  }
`

const H1 = styled.h1`
  color: #000B4F;
`

export { Input, Label, Button, H1 }