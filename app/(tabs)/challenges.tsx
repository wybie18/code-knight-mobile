import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useChallengesProgress } from "../../hooks/useChallengesProgress";

interface ChallengeType {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap | keyof typeof AntDesign.glyphMap;
  iconType: "MaterialCommunityIcons" | "AntDesign";
  gradient: [string, string];
  route: string;
  stats: {
    total: number;
    completed: number;
  };
}

const ChallengesScreen = () => {
  const router = useRouter();
  const { progress, loading, error, refetch } = useChallengesProgress();

  const challengeTypes: ChallengeType[] = [
    {
      id: "coding",
      title: "Coding Challenges",
      description:
        "Solve programming problems and improve your algorithmic thinking",
      icon: "code-tags",
      iconType: "MaterialCommunityIcons",
      gradient: ["#10B981", "#059669"],
      route: "/challenges/coding",
      stats: {
        total: progress?.coding.total || 0,
        completed: progress?.coding.completed || 0,
      },
    },
    {
      id: "ctf",
      title: "Capture The Flag",
      description:
        "Test your cybersecurity skills with hacking challenges and puzzles",
      icon: "flag",
      iconType: "MaterialCommunityIcons",
      gradient: ["#3B82F6", "#2563EB"],
      route: "/challenges/ctf",
      stats: {
        total: progress?.ctf.total || 0,
        completed: progress?.ctf.completed || 0,
      },
    },
  ];

  const handleChallengePress = (route: string) => {
    router.push(route as any);
  };

  const getCompletionPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <>
      <View className="px-6 py-4 border-b border-gray-800">
        <Text className="text-gray-400 text-md">
          Choose a challenge type to get started
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-6"
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetch}
            tintColor="#10B981"
            colors={["#10B981"]}
          />
        }
      >

        {/* Loading State */}
        {loading && !progress && (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#10B981" />
            <Text className="text-gray-400 mt-4">
              Loading challenges...
            </Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <View className="bg-red-900/30 border border-red-700 rounded-xl p-6 mb-6">
            <View className="flex-row items-center mb-2">
              <AntDesign name="exclamation-circle" size={20} color="#EF4444" />
              <Text className="text-red-400 font-semibold ml-2">
                Error Loading Data
              </Text>
            </View>
            <Text className="text-gray-300">{error}</Text>
            <TouchableOpacity
              onPress={refetch}
              className="mt-4 bg-red-800/50 rounded-lg py-2 px-4"
            >
              <Text className="text-white text-center font-semibold">
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Challenge Cards */}
        {!loading && progress && (
        <View className="gap-y-6 relative z-10">
          {challengeTypes.map((challenge) => {
            const completionPercentage = getCompletionPercentage(
              challenge.stats.completed,
              challenge.stats.total
            );

            return (
              <TouchableOpacity
                key={challenge.id}
                onPress={() => handleChallengePress(challenge.route)}
                activeOpacity={0.7}
                className="overflow-hidden"
              >
                <View className="bg-gray-900/60 border border-gray-700/50 rounded-xl overflow-hidden">
                  {/* Card Header with Gradient */}
                  <LinearGradient
                    colors={challenge.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    className="p-6"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-x-4">
                        <View className="bg-white/20 rounded-xl p-3">
                          {challenge.iconType === "MaterialCommunityIcons" ? (
                            <MaterialCommunityIcons
                              name={challenge.icon as any}
                              size={32}
                              color="white"
                            />
                          ) : (
                            <AntDesign
                              name={challenge.icon as any}
                              size={32}
                              color="white"
                            />
                          )}
                        </View>
                        <View className="flex-1">
                          <Text className="text-2xl font-bold text-white mb-1">
                            {challenge.title}
                          </Text>
                          <Text className="text-white/80 text-sm">
                            {challenge.description}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>

                  {/* Card Body */}
                  <View className="p-6">
                    {/* Stats */}
                    <View className="flex-row items-center justify-between mb-4">
                      <View className="flex-row items-center gap-x-2">
                        <AntDesign name="trophy" size={20} color="#10B981" />
                        <Text className="text-gray-300 font-medium">
                          {challenge.stats.completed} / {challenge.stats.total}{" "}
                          Completed
                        </Text>
                      </View>
                      <View className="bg-gray-800 px-3 py-1 rounded-full">
                        <Text className="text-green-400 font-semibold">
                          {completionPercentage}%
                        </Text>
                      </View>
                    </View>

                    {/* Progress Bar */}
                    <View className="mb-4">
                      <View className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <LinearGradient
                          colors={challenge.gradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={{
                            width: `${completionPercentage}%`,
                            height: "100%",
                          }}
                        />
                      </View>
                    </View>

                    {/* Action Button */}
                    <TouchableOpacity
                      onPress={() => handleChallengePress(challenge.route)}
                      className="flex-row items-center justify-between bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3"
                    >
                      <Text className="text-white font-semibold">
                        Start Challenge
                      </Text>
                      <AntDesign name="right" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        )}

        {/* Stats Overview */}
        {!loading && progress && (
        <View className="mt-8 bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
          <View className="flex-row items-center mb-4">
            <AntDesign name="bar-chart" size={20} color="#10B981" />
            <Text className="text-lg font-bold text-white ml-2">
              Your Progress
            </Text>
          </View>

          <View className="gap-y-3">
            {challengeTypes.map((challenge) => (
              <View
                key={challenge.id}
                className="flex-row items-center justify-between py-2"
              >
                <View className="flex-row items-center gap-x-3">
                  {challenge.iconType === "MaterialCommunityIcons" ? (
                    <MaterialCommunityIcons
                      name={challenge.icon as any}
                      size={20}
                      color="#9CA3AF"
                    />
                  ) : (
                    <AntDesign
                      name={challenge.icon as any}
                      size={20}
                      color="#9CA3AF"
                    />
                  )}
                  <Text className="text-gray-300">{challenge.title}</Text>
                </View>
                <Text className="text-gray-400">
                  {challenge.stats.completed}/{challenge.stats.total}
                </Text>
              </View>
            ))}
          </View>

          {/* Overall Progress */}
          {progress.overall && (
            <View className="mt-4 pt-4 border-t border-gray-700">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-400 font-medium">
                  Overall Progress
                </Text>
                <Text className="text-green-400 font-bold">
                  {progress.overall.completed} / {progress.overall.total}
                </Text>
              </View>
              <View className="mt-2 h-2 bg-gray-800 rounded-full overflow-hidden">
                <LinearGradient
                  colors={["#10B981", "#059669"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: `${getCompletionPercentage(
                      progress.overall.completed,
                      progress.overall.total
                    )}%`,
                    height: "100%",
                  }}
                />
              </View>
            </View>
          )}
        </View>
        )}

        {/* Tips Section */}
        {!loading && progress && (
        <View className="mt-6 bg-blue-900/20 border border-blue-700/30 rounded-xl p-6">
          <View className="flex-row items-start gap-x-3">
            <AntDesign name="bulb" size={20} color="#3B82F6" />
            <View className="flex-1">
              <Text className="text-blue-400 font-semibold mb-2">
                Pro Tip
              </Text>
              <Text className="text-gray-300 text-sm leading-relaxed">
                Start with Coding Challenges to build your programming
                fundamentals, then move to CTF for security skills!
              </Text>
            </View>
          </View>
        </View>
        )}

        {/* Typing Test Note */}
        {!loading && progress && (
        <View className="mt-6 bg-purple-900/20 border border-purple-700/30 rounded-xl p-6">
          <View className="flex-row items-start gap-x-3">
            <MaterialCommunityIcons name="keyboard-outline" size={20} color="#8B5CF6" />
            <View className="flex-1">
              <Text className="text-purple-400 font-semibold mb-2">
                Typing Test
              </Text>
              <Text className="text-gray-300 text-sm leading-relaxed">
                Typing tests are best experienced on desktop. Visit our website to practice typing with code snippets and improve your coding speed!
              </Text>
            </View>
          </View>
        </View>
        )}
      </ScrollView>
    </>
  );
};

export default ChallengesScreen;