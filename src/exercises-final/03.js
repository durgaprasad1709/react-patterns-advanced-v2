// Flexible Compound Components with context
// This allows you to avoid unecessary rerenders

import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from 'react'
import {Switch} from '../switch'

const ToggleContext = React.createContext()

function useEffectAfterMount(cb, dependencies) {
  const justMounted = useRef(true)
  useEffect(() => {
    if (!justMounted.current) {
      return cb()
    }
    justMounted.current = false
  }, dependencies)
}

function Toggle(props) {
  const [on, setOn] = useState(false)
  const toggle = useCallback(() => setOn((oldOn) => !oldOn), [])
  useEffectAfterMount(() => {
    props.onToggle(on)
  }, [on])
  const value = useMemo(() => ({on, toggle}), [on])
  return (
    <ToggleContext.Provider value={value}>
      {props.children}
    </ToggleContext.Provider>
  )
}

function useToggleContext() {
  const context = useContext(ToggleContext)
  if (!context) {
    throw new Error(
      `Toggle compound components cannot be rendered outside the Toggle component`,
    )
  }
  return context
}

const On = ({children}) => {
  const {on} = useToggleContext()
  return on ? children : null
}
Toggle.On = On

const Off = ({children}) => {
  const {on} = useToggleContext()
  return on ? null : children
}
Toggle.Off = Off

const Button = (props) => {
  const {on, toggle} = useToggleContext()
  return <Switch on={on} onClick={toggle} {...props} />
}
Toggle.Button = Button

function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return (
    <Toggle onToggle={onToggle}>
      <Toggle.On>The button is on</Toggle.On>
      <Toggle.Off>The button is off</Toggle.Off>
      <div>
        <Toggle.Button />
      </div>
    </Toggle>
  )
}
Usage.title = 'Flexible Compound Components'

export {Toggle, Usage as default}
