import { useEffect, useState } from 'react'
import { init, initDataUser } from '@telegram-apps/sdk'
import { isTMA, mockTelegramEnv } from '@telegram-apps/bridge';
import './App.css'

export function App() {
  const [initData, setInitData] = useState({})

  useEffect(() => {
    if (isTMA()) {
      // Telegram Mini Apps environment
      init()
    } else {
      // Debug environment
      mockTelegramEnv({
        launchParams: {
          tgWebAppPlatform: 'web',
          tgWebAppVersion: '59',
          tgWebAppThemeParams: {
            accent_text_color: '#6ab2f2',
            bg_color: '#17212b',
            button_color: '#5288c1',
            button_text_color: '#ffffff',
            destructive_text_color: '#ec3942',
            // headerBgColor: '#17212b',
            // hintColor: '#708499',
            // linkColor: '#6ab3f3',
            // secondaryBgColor: '#232e3c',
            // sectionBgColor: '#17212b',
            // sectionHeaderTextColor: '#6ab3f3',
            // subtitleTextColor: '#708499',
            // textColor: '#f5f5f5',
          },
        },
        
        // initData: {
        //   user: {
        //     id: 99281932,
        //     firstName: 'Andrew',
        //     lastName: 'Rogue',
        //     username: 'rogue',
        //     languageCode: 'en',
        //     isPremium: true,
        //     allowsWriteToPm: true,
        //   },
        //   hash: '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31',
        //   authDate: new Date(1716922846000),
        //   signature: 'abc',
        //   startParam: 'debug',
        //   chatType: 'sender',
        //   chatInstance: '8428209589180549439',
        // },
        // initDataRaw: new URLSearchParams([
        //   ['user', JSON.stringify({
        //     id: 99281932,
        //     first_name: 'Andrew',
        //     last_name: 'Rogue',
        //     username: 'rogue',
        //     language_code: 'en',
        //     is_premium: true,
        //     allows_write_to_pm: true,
        //   })],
        //   ['hash', '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
        //   ['auth_date', '1716922846'],
        //   ['start_param', 'debug'],
        //   ['signature', 'abc'],
        //   ['chat_type', 'sender'],
        //   ['chat_instance', '8428209589180549439'],
        // ]).toString(),
        // version: '7.2',
        // platform: 'tdesktop',
      });
    }
    setInitData(initDataUser)
  }, [])

  return (
    <>
      {JSON.stringify(initData)}
    </>
  )
}
