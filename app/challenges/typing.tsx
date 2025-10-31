import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TypingChallenges = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold text-white">Typing Tests</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="p-6">
          <View className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
            <Text className="text-white text-center">
              Typing Tests - Coming Soon
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              This section will contain typing speed tests with code snippets to
              improve your coding velocity.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TypingChallenges;
