import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import type { Course } from "../../types/course/course";

interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

const CourseCard = ({ course, onPress }: CourseCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-gray-900/60 border border-gray-700/50 rounded-xl overflow-hidden mb-4 active:opacity-70"
    >
      {/* Thumbnail */}
      {course.thumbnail ? (
        <Image
          source={{ uri: course.thumbnail }}
          className="w-full h-40"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-40 bg-gray-800/50 items-center justify-center">
          <Ionicons name="book-outline" size={48} color="#6B7280" />
        </View>
      )}

      <View className="p-4">
        {/* Category Badge */}
        <Text className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-2">
          {course.category.name}
        </Text>

        {/* Title */}
        <Text className="text-lg font-semibold text-white mb-2" numberOfLines={2}>
          {course.title}
        </Text>

        {/* Description */}
        <Text className="text-gray-400 text-sm mb-3" numberOfLines={2}>
          {course.short_description}
        </Text>

        {/* Creator */}
        {course.creator && (
          <Text className="text-xs text-gray-400 mb-3">
            By{" "}
            <Text className="text-gray-300 font-medium">
              {course.creator.username}
            </Text>
          </Text>
        )}

        {/* Skill Tag */}
        {course.skill_tags && course.skill_tags.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-3">
            <View className="px-2 py-1 bg-gray-800/50 border border-gray-600/30 rounded-full">
              <Text className="text-gray-300 text-xs">
                {course.skill_tags[0].name}
              </Text>
            </View>
          </View>
        )}

        {/* Footer Stats */}
        <View className="flex-row items-center justify-between pt-3 border-t border-gray-700/30">
          <View className="flex-row items-center space-x-1">
            <Ionicons name="people-outline" size={16} color="#9CA3AF" />
            <Text className="text-gray-400 text-sm ml-1">
              {course.enrolled_users_count || 0}
            </Text>
          </View>
          <View className="flex-row items-center space-x-1">
            <Ionicons name="time-outline" size={16} color="#9CA3AF" />
            <Text className="text-gray-400 text-sm ml-1">
              {course.estimated_duration}h
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CourseCard;
