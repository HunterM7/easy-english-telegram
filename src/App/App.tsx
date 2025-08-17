import { useLaunchParams } from '@telegram-apps/sdk-react';

export function App() {
  const launchParams = useLaunchParams();

  return (
    <>
      LaunchParams: {JSON.stringify(launchParams.tgWebAppData?.user)}
    </>
  )
}
