import { useEffect, useState } from 'react'
import { init } from '@telegram-apps/sdk'
import { isTMA } from '@telegram-apps/bridge';
import './App.css'

export function App() {
  const [initData, setInitData] = useState({})

  useEffect(() => {
    if (isTMA()) {
      // Telegram Mini Apps environment
      setInitData(init())
    } else {
      // Debug environment
      setInitData({ debug: true })
    }
  }, [])

  return (
    <>
      {JSON.stringify(initData)}
    </>
  )
}
