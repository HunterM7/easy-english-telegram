import { useEffect, useRef } from 'react'
import { init } from '@telegram-apps/sdk'
import { isTMA } from '@telegram-apps/bridge';
import './App.css'

export function App() {
  const ref = useRef({})

  useEffect(() => {
    if (isTMA()) {
      console.log('It\'s Telegram Mini Apps');
      ref.current = init()
    } else {
      ref.current = { test: 123 }
    }
  }, [])

  return (
    <>
      {JSON.stringify(ref.current)}
    </>
  )
}
