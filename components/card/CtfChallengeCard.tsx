import { AntDesign, Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { Challenge, CtfChallenge } from "../../types/challenges";

interface CtfChallengeCardProps {
  challenge: Challenge;
  onPress: () => void;
}

const CtfChallengeCard = ({ challenge, onPress }: CtfChallengeCardProps) => {
  const ctfChallenge = challenge.challengeable as CtfChallenge;

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
    switch (challenge.difficulty.name.toLowerCase()) {
      case "beginner":
        return "text-green-400";
      case "intermediate":
        return "text-yellow-400";
      case "advanced":
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
      <View
        className={`rounded-xl overflow-hidden ${
          challenge.is_solved
            ? "border-2 border-green-500/50"
            : "border border-gray-700/50"
        }`}
      >
        <View className="p-4 bg-gray-900/80 relative z-10">
          <View className="flex-row items-center justify-between mb-3">
            <View
              className={`px-2 py-1 rounded-full ${getDifficultyColor()} border`}
            >
              <Text
                className={`text-xs font-semibold uppercase tracking-wide ${getDifficultyTextColor()}`}
              >
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

          <Text
            className={`text-sm mb-4 ${
              challenge.is_solved ? "text-gray-300" : "text-gray-400"
            }`}
            numberOfLines={2}
          >
            {challenge.description}
          </Text>

          <View className="flex-row items-center justify-between">
            <View
              className="px-3 py-1 rounded-lg border border-red-300/30 bg-red-300/10"
            >
              <Text
                className="text-xs font-medium text-red-300"
              >
                {ctfChallenge.category.name}
              </Text>
            </View>

            <View className="flex-row items-center gap-x-1">
              {ctfChallenge.file_paths && ctfChallenge.file_paths.length > 0 && (
                <View className="flex-row items-center mr-2">
                  <Ionicons name="document-attach" size={14} color="#9CA3AF" />
                  <Text className="text-gray-400 text-xs ml-1">
                    {ctfChallenge.file_paths.length}
                  </Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </View>
          </View>
        </View>
      </View>

      {challenge.is_solved && (
        <View className="absolute -top-2 -right-2 z-20">
          <View className="bg-green-500 rounded-full p-1.5 border-2 border-black">
            <Ionicons name="trophy" size={16} color="white" />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CtfChallengeCard;
