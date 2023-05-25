import * as SecureStore from 'expo-secure-store'
import { styled } from 'nativewind'
import { ImageBackground } from 'react-native'

import {
  Roboto_400Regular as Roboto400Regular,
  Roboto_700Bold as Roboto700Bold,
  useFonts,
} from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold as BaiJamjuree700Bold } from '@expo-google-fonts/bai-jamjuree'

import { SplashScreen, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'

import blurBg from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/stripes.svg'

const StyledStripes = styled(Stripes)

export default function Layout() {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState<
    null | boolean
  >(null)

  const [hasLoadedFonts] = useFonts({
    Roboto400Regular,
    Roboto700Bold,
    BaiJamjuree700Bold,
  })

  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) => {
      setIsUserAuthenticated(!!token)
    })
  }, [])

  return !hasLoadedFonts ? (
    <SplashScreen />
  ) : (
    <ImageBackground source={blurBg} className="relative flex-1 bg-gray-900">
      <StyledStripes className="absolute left-0" />

      <StatusBar style="light" translucent />

      <Stack
        screenOptions={{
          animation: 'fade',
          contentStyle: { backgroundColor: 'transparent' },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" redirect={isUserAuthenticated} />
        <Stack.Screen name="memories" />
        <Stack.Screen name="new" />
        <Stack.Screen name="[id]" />
      </Stack>
    </ImageBackground>
  )
}
