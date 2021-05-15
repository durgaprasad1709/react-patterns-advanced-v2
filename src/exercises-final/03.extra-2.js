// Flexible Compound Components with context
// This allows you to avoid unecessary rerenders

import React, {useContext, useState, useEffect} from 'react'
import {Switch} from '../switch'

const ToggleContext = React.createContext()

function Toggle(props) {
  const [on, setOn] = useState(false)
  const toggle = () => setOn(oldOn => !oldOn)
  useEffect(
    () => {
      props.onToggle(on)
    },
    [on],
  )
  return (
    <ToggleContext.Provider value={{on, toggle}}>
      {props.children}
    </ToggleContext.Provider>
  )
}

function ToggleConsumer(props) {
  return (
    <ToggleContext.Consumer {...props}>
      {context => {
        if (!context) {
          throw new Error(
            `Toggle compound components cannot be rendered outside the Toggle component`,
          )
        }
        return props.children(context)
      }}
    </ToggleContext.Consumer>
  )
}

const On = ({children}) => {
  const {on} = useContext(ToggleContext)
  return on ? children : null
}
Toggle.On = On

const Off = ({children}) => {
  const {on} = useContext(ToggleContext)
  return on ? null : children
}
Toggle.Off = Off

const Button = props => {
  const {on, toggle} = useContext(ToggleContext)
  return <Switch on={on} onClick={toggle} {...props} />
}
Toggle.Button = Button

function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return (
    <div>
      <Toggle.On>The button is on</Toggle.On>
      <Toggle.Off>The button is off</Toggle.Off>
      <div>
        <Toggle.Button />
      </div>
    </div>
  )
}
Usage.title = 'Flexible Compound Components'

export {Toggle, Usage as default}
