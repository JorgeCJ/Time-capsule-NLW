import dayjs from 'dayjs'
import { Link, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import Icon from '@expo/vector-icons/Feather'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'

import { MemoryProps } from '../[id]'
import { api } from '../../src/lib/api'

interface MemoryCardProps extends MemoryProps {
  details?: boolean
}

export default function MemoryCard({
  createdAt,
  coverUrl,
  details,
  excerpt,
  id,
}: MemoryCardProps) {
  const router = useRouter()

  const handleDelete = async () => {
    const token = await SecureStore.getItemAsync('token')

    const headers = { Authorization: `Bearer ${token}` }

    const fileName = coverUrl.split('/')[4]

    await api.delete(`/upload/${fileName}`, { headers })

    await api.delete(`memories/${id}`, { headers })

    router.push('memories')
  }

  const handleOnPress = () => {
    Alert.alert('Are you sure you want to delete memory?', null, [
      {
        style: 'cancel',
        text: 'Cancel',
      },
      {
        onPress: () => handleDelete(),
        style: 'destructive',
        text: 'Delete',
      },
    ])
  }

  return (
    <View className="mb-8 space-y-4">
      <View className="flex-row items-center gap-2">
        <View className="h-px w-5 bg-gray-50" />
        <Text className="font-body text-xs text-gray-100">
          {dayjs(createdAt).locale('pt-br').format('D [de] MMMM, YYYY')}
        </Text>
      </View>
      <View className="space-y-4 px-8">
        <Image
          alt=""
          className="aspect-video w-full rounded-lg"
          source={{ uri: coverUrl }}
        />
        <Text className="font-body text-base leading-relaxed text-gray-100">
          {excerpt}
        </Text>
        {details ? (
          <Link href={`${id}`} asChild>
            <TouchableOpacity
              activeOpacity={0.7}
              className="flex-row items-center gap-2"
            >
              <Text className="font-body text-sm text-gray-200">Read more</Text>
              <Icon color="#9e9ea0" name="arrow-right" size={16}></Icon>
            </TouchableOpacity>
          </Link>
        ) : (
          <View className="flex flex-row justify-end">
            <TouchableOpacity
              className="flex flex-row items-center justify-center rounded-full bg-red-500 px-5 py-3"
              onPress={handleOnPress}
            >
              <Icon color="#000" name="trash-2" size={16}></Icon>
              <Text className="ml-2 font-alt text-sm uppercase leading-none text-black">
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}
