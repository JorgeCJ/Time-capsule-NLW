import {
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native'
import Icon from '@expo/vector-icons/Feather'

import * as ImagePicker from 'expo-image-picker'
import { Link, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useState } from 'react'

import NWLLogo from '../src/assets/nwl-spacetime-logo.svg'
import { api } from '../src/lib/api'

export default function NewMemory() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState(null)
  const [isPublic, setIsPublic] = useState(false)

  const openImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })

      if (result.assets[0]) setPreview(result.assets[0].uri)
    } catch (e) { }

    // if (!result.canceled) {
    //   setImage(result.assets[0].uri)
    // }
  }

  const handleSubmit = async () => {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''

    if (preview) {
      const uploadFormData = new FormData()

      uploadFormData.append('file', {
        name: 'image.jpg',
        type: 'image/jpeg',
        uri: preview,
      } as any)

      const {
        data: { fileUrl },
      } = await api.post('/upload', uploadFormData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      coverUrl = fileUrl
    }

    await api.post(
      '/memories',
      { content, coverUrl, isPublic },
      { headers: { Authorization: `Bearer ${token}` } },
    )

    router.push('memories')
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NWLLogo />

        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon color="#FFF" name="arrow-left" size={16} />
          </TouchableOpacity>
        </Link>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            onValueChange={setIsPublic}
            thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
            trackColor={{ false: '#767577', true: '#372560' }}
            value={isPublic}
          />
          <Text className="font-body text-base text-gray-200">
            Make public memory
          </Text>
        </View>
      </View>

      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2"></View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="bg-black-20 h-32 items-center justify-center rounded-lg border border-dashed border-gray-500"
          onPress={openImagePicker}
        >
          {preview ? (
            <Image
              alt=""
              className="h-full w-full rounded-lg object-cover"
              source={{ uri: preview }}
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon color="#FFF" name="image" />
              <Text className="font-body text-sm text-gray-200">
                Attach media
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          className="p-0 text-justify font-body text-lg text-gray-50"
          multiline
          onChangeText={setContent}
          placeholderTextColor="#56565a"
          placeholder="Feel free to add photos, videos and stories about that experience you want to remember forever."
          value={content}
          textAlignVertical="top"
        />

        <TouchableOpacity
          activeOpacity={0.7}
          className="items-center self-end rounded-full bg-green-500 px-5 py-2"
          onPress={handleSubmit}
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
