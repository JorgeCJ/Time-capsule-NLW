import { Link } from 'expo-router'
import { Text, View } from 'react-native'

export default function EmptyMemories() {
  return (
    <View className="mt-8 flex flex-1 items-center space-y-4 self-center px-12">
      <Text className="text-center font-body text-sm  leading-relaxed text-white">
        You haven&apos;t registered any memories yet, start{' '}
        <Link href="new" asChild>
          <Text className="font-body text-sm leading-relaxed text-white underline">
            Creating NOW
          </Text>
        </Link>
        !
      </Text>
    </View>
  )
}
