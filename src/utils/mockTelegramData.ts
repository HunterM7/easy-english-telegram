import { mockTelegramEnv } from '@telegram-apps/sdk-react';

export function mockTelegramData() {
  mockTelegramEnv({
    launchParams: {
      tgWebAppData: new URLSearchParams([
        ['user', JSON.stringify({
          id: 1234567,
          first_name: "Фома",
          last_name: "Киняев",
          allows_write_to_pm: true,
          language_code: "ru",
          photo_url: "https://t.me/i/userpic/320/CpVmwzRiyPdlURHrHaPRCn7FHwvkiET8gBF9mVY3Muw.svg",
          username: "foma_kinyayev"
        })],
        ['auth_date', Date.now().toString()],
        ['chat_type', 'private'],
        ['chat_instance', '-1234567891234567890'],
        ['hash', 'somerandomhash'],
        ['signature', 'somerandomsignature'],
      ]),
      tgWebAppStartParam: 'debug',
      tgWebAppVersion: '9.1',
      tgWebAppFullscreen: false,
      tgWebAppPlatform: 'tdesktop',
      tgWebAppThemeParams: {
        bg_color: '#ffffff',
        text_color: '#000000',
        hint_color: '#999999',
        link_color: '#2481cc',
        button_color: '#2481cc',
        button_text_color: '#ffffff',
        destructive_text_color: "#ef5b5b",
        secondary_bg_color: "#131415",
        section_separator_color: "#213040",
        section_header_text_color: "#b1c3d5",
        header_bg_color: "#131415",
        accent_text_color: "#2ea6ff",
        section_bg_color: "#18222d",
        bottom_bar_bg_color: "#213040",
        subtitle_text_color: "#b1c3d5"
      },
    },
  });
}