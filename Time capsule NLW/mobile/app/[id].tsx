import { ScrollView, TouchableOpacity, View } from 'react-native'
import Icon from '@expo/vector-icons/Feather'
import { Link, useSearchParams } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import MemoryCard from './components/MemoryCard'

import NWLLogo from '../src/assets/nwl-spacetime-logo.svg'
import { api } from '../src/lib/api'

export interface MemoryProps {
  coverUrl: string
  createdAt: string
  excerpt: string
  id?: string
}

export default function Memory() {
  const { bottom, top } = useSafeAreaInsets()
  const { id } = useSearchParams()
  const [memory, setMemory] = useState<MemoryProps>()

  useEffect(() => {
    ;(async function () {
      const token = await SecureStore.getItemAsync('token')

      const { data } = await api.get(`/memories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      const { content } = data

      setMemory({ ...data, excerpt: content })
    })()
  }, [id])

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between px-8">
        <NWLLogo />

        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon color="#FFF" name="arrow-left" size={16} />
          </TouchableOpacity>
        </Link>
      </View>
      {memory && (
        <View className="mt-6 space-y-10">
          <MemoryCard
            coverUrl={memory.coverUrl}
            createdAt={memory.createdAt}
            excerpt={memory.excerpt}
            id={id as string}
          />
        </View>
      )}
    </ScrollView>
  )
}
