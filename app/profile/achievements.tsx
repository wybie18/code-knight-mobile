import GamifiedCard from "@/components/card/GamifiedCard";
import ProgressBar from "@/components/ProgressBar";
import { achievementService } from "@/services/achievementService";
import type {
    AchievementProgress,
    AchievementStats,
    NextToUnlock,
} from "@/types/achievement";
import {
    Feather,
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
    Octicons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type FilterType = "all" | "earned" | "locked";

const AchievementsScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<AchievementProgress[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [nextToUnlock, setNextToUnlock] = useState<NextToUnlock | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  const fetchData = async () => {
    try {
      setError(null);
      const [progressRes, nextRes] = await Promise.all([
        achievementService.getMyProgress(),
        achievementService.getNextToUnlock(),
      ]);

      if (progressRes.success) {
        setAchievements(progressRes.data.achievements);
        setStats(progressRes.data.stats);
      }

      if (nextRes.success && nextRes.data) {
        setNextToUnlock(nextRes.data);
      }
    } catch (err) {
      setError("Failed to load achievements. Please try again.");
      console.error("Error fetching achievements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const filteredAchievements = achievements.filter((item) => {
    if (filter === "earned" && !item.earned) return false;
    if (filter === "locked" && item.earned) return false;
    return true;
  });

  const formatRequirement = (
    key: string,
    value: { current: number; required: number }
  ) => {
    const labels: Record<string, string> = {
      level: "Reach Level",
      total_xp: "Earn Total XP",
      completed_courses: "Complete Courses",
      completed_lessons: "Complete Lessons",
      completed_activities: "Complete Activities",
      coding_challenges_solved: "Solve Coding Challenges",
      ctf_challenges_solved: "Solve CTF Challenges",
      typing_tests_completed: "Complete Typing Tests",
      total_challenges_solved: "Solve Total Challenges",
      consecutive_days_active: "Active Days Streak",
      longest_streak: "Longest Streak",
      badges_count: "Earn Badges",
      achievements_count: "Earn Achievements",
    };

    return `${labels[key] || key}: ${value.current}/${value.required}`;
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-gray-400 mt-4">Loading achievements...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center px-4">
        <View className="w-16 h-16 bg-red-500/10 rounded-full items-center justify-center mb-4">
          <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
        </View>
        <Text className="text-xl font-semibold text-white mb-2">Error</Text>
        <Text className="text-gray-400 text-center mb-6">{error}</Text>
        <TouchableOpacity
          onPress={fetchData}
          className="px-6 py-3 bg-green-600 rounded-lg"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10B981"
          />
        }
      >
        {/* Header */}
        <View className="px-4 py-4 border-b border-gray-800/50">
          <View className="flex-row items-center mb-1">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-white">Achievements</Text>
          </View>
          <Text className="text-gray-400 text-sm ml-9">
            Track your progress and unlock rewards
          </Text>
        </View>

        <View className="p-4">
          {/* Stats Overview */}
          <View className="flex-row gap-2 mb-4">
            <View className="flex-1">
              <GamifiedCard
                title="Progress"
                icon={<Octicons name="trophy" size={16} color="#f59e0b" />}
              >
                <View className="items-center">
                  <Text className="text-2xl font-bold text-green-100">
                    {stats?.earned_achievements || 0}/{stats?.total_achievements || 0}
                  </Text>
                  <ProgressBar
                    progress={stats?.completion_percentage || 0}
                    height="h-2"
                  />
                  <Text className="text-xs text-gray-500 mt-1">
                    {stats?.completion_percentage?.toFixed(0) || 0}% Complete
                  </Text>
                </View>
              </GamifiedCard>
            </View>
            <View className="flex-1">
              <GamifiedCard
                title="Unlocked"
                icon={<Feather name="check-circle" size={16} color="#22c55e" />}
              >
                <View className="items-center">
                  <Text className="text-2xl font-bold text-green-400">
                    {stats?.earned_achievements || 0}
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    Achievements Earned
                  </Text>
                </View>
              </GamifiedCard>
            </View>
          </View>

          {/* Next to Unlock */}
          {nextToUnlock && (
            <GamifiedCard
              title="Next to Unlock"
              icon={<Feather name="target" size={20} color="#f59e0b" />}
              className="mb-4"
            >
              <View className="flex-row items-center">
                <View className="w-16 h-16 bg-amber-500/10 rounded-lg items-center justify-center mr-4">
                  {nextToUnlock.achievement.icon ? (
                    <Image
                      source={{ uri: nextToUnlock.achievement.icon }}
                      className="w-10 h-10"
                      resizeMode="contain"
                    />
                  ) : (
                    <FontAwesome5 name="award" size={24} color="#f59e0b" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-white font-semibold mb-1">
                    {nextToUnlock.achievement.name}
                  </Text>
                  <Text
                    className="text-gray-400 text-xs mb-2"
                    numberOfLines={2}
                  >
                    {nextToUnlock.achievement.description}
                  </Text>
                  <ProgressBar
                    progress={nextToUnlock.progress_percentage}
                    height="h-1.5"
                  />
                  <Text className="text-xs text-gray-500 mt-1">
                    {nextToUnlock.progress_percentage.toFixed(0)}% Complete
                  </Text>
                </View>
              </View>
            </GamifiedCard>
          )}

          {/* Filters */}
          <View className="flex-row gap-2 mb-4">
            {(["all", "earned", "locked"] as FilterType[]).map((f) => {
              const earnedCount = achievements.filter(a => a.earned).length;
              const lockedCount = achievements.filter(a => !a.earned).length;
              const count = f === "all" 
                ? achievements.length 
                : f === "earned" 
                  ? earnedCount 
                  : lockedCount;
              
              return (
                <TouchableOpacity
                  key={f}
                  onPress={() => setFilter(f)}
                  className={`flex-1 py-2 rounded-lg items-center ${
                    filter === f
                      ? "bg-green-500"
                      : "bg-gray-800/50 border border-gray-700/50"
                  }`}
                >
                  <Text
                    className={`text-sm font-medium capitalize ${
                      filter === f ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {f} ({count})
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Achievements Grid */}
          <View className="gap-3">
            {filteredAchievements.map((item) => (
              <View
                key={item.achievement.id}
                className={`p-4 rounded-xl border ${
                  item.earned
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-gray-800/30 border-gray-700/30 opacity-70"
                }`}
              >
                <View className="flex-row items-start">
                  {/* Icon */}
                  <View
                    className={`w-14 h-14 rounded-lg items-center justify-center mr-3 ${
                      item.earned ? "bg-green-500/20" : "bg-gray-700/30"
                    }`}
                  >
                    {item.achievement.icon ? (
                      <Image
                        source={{ uri: item.achievement.icon }}
                        className="w-8 h-8"
                        resizeMode="contain"
                        style={{ opacity: item.earned ? 1 : 0.5 }}
                      />
                    ) : (
                      <FontAwesome5
                        name="award"
                        size={24}
                        color={item.earned ? "#22c55e" : "#6b7280"}
                      />
                    )}
                  </View>

                  {/* Content */}
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-white font-semibold flex-1">
                        {item.achievement.name}
                      </Text>
                      {item.earned && (
                        <View className="bg-green-500/20 px-2 py-0.5 rounded">
                          <Feather name="check" size={12} color="#22c55e" />
                        </View>
                      )}
                      {!item.earned && (
                        <MaterialCommunityIcons
                          name="lock"
                          size={16}
                          color="#6b7280"
                        />
                      )}
                    </View>

                    <Text
                      className="text-gray-400 text-xs mb-2"
                      numberOfLines={2}
                    >
                      {item.achievement.description}
                    </Text>

                    {/* XP Reward */}
                    <View className="flex-row items-center mb-2">
                      <FontAwesome5 name="star" size={10} color="#f59e0b" />
                      <Text className="text-amber-400 text-xs ml-1">
                        +{item.achievement.exp_reward} XP
                      </Text>
                    </View>

                    {/* Progress (for locked) */}
                    {!item.earned && item.progress && (
                      <View className="gap-1">
                        {Object.entries(item.progress).map(([key, value]) => (
                          <View key={key}>
                            <Text className="text-gray-500 text-xs mb-1">
                              {formatRequirement(key, value)}
                            </Text>
                            <ProgressBar
                              progress={(value.current / value.required) * 100}
                              height="h-1"
                            />
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Earned Date */}
                    {item.earned && item.earned_at && (
                      <Text className="text-gray-500 text-xs">
                        Earned on{" "}
                        {new Date(item.earned_at).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>

          {filteredAchievements.length === 0 && (
            <View className="py-12 items-center">
              <FontAwesome5 name="award" size={48} color="#6b7280" />
              <Text className="text-gray-400 mt-4">
                No achievements found with the selected filter
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AchievementsScreen;
