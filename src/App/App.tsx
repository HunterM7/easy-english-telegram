import { useLaunchParams, useRawInitData } from '@telegram-apps/sdk-react';

export function App() {
  const initData = useRawInitData();
  const launchParams = useLaunchParams();

  return (
    <>
      InitData: {initData}
      <br />
      <br />
      LaunchParams: {JSON.stringify(launchParams)}
    </>
  )
}
