import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useEffect } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

import NWLLogo from '../src/assets/nwl-spacetime-logo.svg'
import { api } from '../src/lib/api'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/f3bdee9fc6181ca62328',
}

export default function App() {
  const router = useRouter()

  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: 'f3bdee9fc6181ca62328',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery,
  )

  const handleGithubOAuthCode = async (code: string) => {
    const {
      data: { token },
    } = await api.post('/register', { code })

    await SecureStore.setItemAsync('token', token)

    router.push('/memories')
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params
      handleGithubOAuthCode(code)
    }
  }, [response])

  return (
    <View className="flex-1 items-center px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NWLLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Your time capsule
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Collect remarkable moments from your journey and share (if you want)
            with all the world!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            REGISTER MEMORY
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Made with 💖 in Rocketseat&apos;s NLW and modified by ME
      </Text>
    </View>
  )
}
