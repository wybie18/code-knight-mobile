import { AntDesign, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { Challenge } from "../../types/challenges";

interface ChallengeCardProps {
  challenge: Challenge;
  onPress: () => void;
}

const ChallengeCard = ({ challenge, onPress }: ChallengeCardProps) => {
  const getDifficultyColor = () => {
    switch (challenge.difficulty.name) {
      case "Beginner":
        return "bg-green-500/20 border-green-500/30";
      case "Intermediate":
        return "bg-yellow-500/20 border-yellow-500/30";
      case "Advanced":
        return "bg-red-500/20 border-red-500/30";
      default:
        return "bg-gray-500/20 border-gray-500/30";
    }
  };

  const getDifficultyTextColor = () => {
    switch (challenge.difficulty.name) {
      case "Beginner":
        return "text-green-400";
      case "Intermediate":
        return "text-yellow-400";
      case "Advanced":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="mb-4 relative"
    >
      {/* Card Container */}
      <View
        className={`rounded-xl overflow-hidden ${
          challenge.is_solved
            ? "border-2 border-green-500/50"
            : "border border-gray-700/50"
        }`}
      >
        {/* Content */}
        <View className="p-4 bg-gray-900/80 relative z-10">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-3">
            <View
              className={`px-2 py-1 rounded-full ${getDifficultyColor()} border`}
            >
              <Text className={`text-xs font-semibold uppercase tracking-wide ${getDifficultyTextColor()}`}>
                {challenge.difficulty.name}
              </Text>
            </View>
            <View className="flex-row items-center gap-x-1">
              <AntDesign name="fire" size={16} color="#F97316" />
              <Text className="text-orange-400 font-semibold text-sm">
                {challenge.points} Points
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-x-2 mb-2">
            {challenge.is_solved && (
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            )}
            <Text
              className={`flex-1 text-lg font-semibold ${
                challenge.is_solved ? "text-green-400" : "text-white"
              }`}
              numberOfLines={2}
            >
              {challenge.title}
            </Text>
          </View>

          {/* Description */}
          <Text
            className={`text-sm mb-4 ${
              challenge.is_solved ? "text-gray-300" : "text-gray-400"
            }`}
            numberOfLines={2}
          >
            {challenge.description}
          </Text>

          {/* Bottom Section */}
          <View className="flex-row items-center justify-between">
            {/* Languages */}
            <View className="flex-1 flex-row flex-wrap gap-2">
              {challenge.challengeable.programming_languages.map((lang) => (
                <View
                  key={lang.id}
                  className={`px-2 py-1 rounded-lg ${
                    challenge.is_solved
                      ? "bg-green-500/20 border border-green-500/30"
                      : "bg-gray-800/50 border border-gray-600/30"
                  }`}
                >
                  <Text
                    className={`text-xs ${
                      challenge.is_solved ? "text-green-300" : "text-gray-300"
                    }`}
                  >
                    {lang.name}
                  </Text>
                </View>
              ))}
            </View>

            {/* Solved Status Indicator */}
            {challenge.is_solved && (
              <View className="ml-2 flex-row items-center bg-green-500/20 px-2 py-1 rounded-full">
                <View className="w-2 h-2 bg-green-400 rounded-full mr-1.5" />
                <Text className="text-green-400 text-xs font-semibold">
                  Completed
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChallengeCard;
