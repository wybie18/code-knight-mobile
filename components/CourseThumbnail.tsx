import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CourseThumbnailProps {
  thumbnail?: string | null;
  title: string;
  onClick: () => void;
}

const CourseThumbnail = ({ thumbnail, title = "", onClick }: CourseThumbnailProps) => {
  const hasValidThumbnail = thumbnail && thumbnail.trim() !== "";

  return (
    <TouchableOpacity
      onPress={onClick}
      activeOpacity={0.9}
      className="relative rounded-xl overflow-hidden mb-6"
    >
      {hasValidThumbnail ? (
        <Image
          source={{ uri: thumbnail }}
          className="w-full h-64"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-64 bg-gray-900/60 items-center justify-center">
          <View className="items-center">
            <Ionicons name="school-outline" size={64} color="rgba(255,255,255,0.8)" />
            <Text className="text-xl font-semibold text-white mt-4 mb-2 px-4 text-center">
              Course
            </Text>
            <Text className="text-white/80 text-sm">No thumbnail available</Text>
          </View>
        </View>
      )}

      {/* Overlay with Play Button */}
      <View className="absolute inset-0 bg-black/40 items-center justify-center">
        <View className="bg-green-500 p-4 rounded-full">
          <Ionicons name="play" size={32} color="#FFFFFF" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CourseThumbnail;
