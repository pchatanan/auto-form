import React from 'react'
import { Label, Input } from './UI';

const TextInput = props => {
  const { label, ...otherProps } = props
  const [focus, setFocus] = React.useState(false)
  return <>
    <Label htmlFor={label} focus={focus}>{label}</Label>
    <Input onFocus={e => {
      setFocus(true)
    }} onBlur={e => {
      setFocus(false)
    }} {...otherProps} />
  </>
}

export default TextInput