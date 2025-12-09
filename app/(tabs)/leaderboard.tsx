import GamifiedCard from "@/components/card/GamifiedCard";
import UserAvatar from "@/components/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { useLeaderboard } from "@/hooks/useLeaderboard";
import type { LeaderboardType, LeaderboardUser } from "@/types/leaderboard";
import {
    Feather,
    FontAwesome5,
    FontAwesome6,
    Ionicons,
    MaterialCommunityIcons,
    Octicons,
} from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface LeaderboardCategory {
  type: LeaderboardType;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const leaderboardTypes: LeaderboardCategory[] = [
  {
    type: "levels",
    label: "Levels",
    icon: <Octicons name="trophy" size={18} color="#facc15" />,
    color: "#22c55e",
    description: "Total XP & Level",
  },
  {
    type: "overall",
    label: "Overall",
    icon: <Feather name="target" size={18} color="#0ea5e9" />,
    color: "#0ea5e9",
    description: "All Challenges",
  },
  {
    type: "coding",
    label: "Coding",
    icon: <Feather name="code" size={18} color="#0ea5e9" />,
    color: "#0ea5e9",
    description: "Programming Challenges",
  },
  {
    type: "ctf",
    label: "CTF",
    icon: <FontAwesome6 name="flag" size={18} color="#f43f5e" />,
    color: "#f43f5e",
    description: "Capture The Flag",
  },
  {
    type: "typing",
    label: "Typing",
    icon: <MaterialCommunityIcons name="keyboard" size={18} color="#0ea5e9" />,
    color: "#0ea5e9",
    description: "Typing Challenges",
  },
  {
    type: "achievements",
    label: "Achievements",
    icon: <FontAwesome5 name="award" size={18} color="#f59e0b" />,
    color: "#f59e0b",
    description: "Total Achievements",
  },
  {
    type: "streaks",
    label: "Streaks",
    icon: <Octicons name="flame" size={18} color="#f59e0b" />,
    color: "#f59e0b",
    description: "Current Streak",
  },
  {
    type: "courses",
    label: "Courses",
    icon: <FontAwesome6 name="graduation-cap" size={18} color="#0ea5e9" />,
    color: "#0ea5e9",
    description: "Completed Courses",
  },
];

const LeaderboardScreen = () => {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<LeaderboardType>("levels");
  const { leaderboard, myRank, loading, error, refetch } =
    useLeaderboard(selectedType);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const currentTypeConfig = leaderboardTypes.find(
    (t) => t.type === selectedType
  );

  const getStatValue = (user: LeaderboardUser, compact: boolean = false) => {
    switch (selectedType) {
      case "levels":
        return (
          <View className={compact ? "gap-1" : "flex-row items-center gap-3"}>
            <View className="flex-row items-center gap-1">
              <Octicons name="trophy" size={14} color="#22c55e" />
              <Text className="text-green-400 font-semibold text-sm">
                Lv {user.level || 0}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <FontAwesome5 name="star" size={12} color="#f59e0b" />
              <Text className="text-amber-400 font-medium text-sm">
                {user.total_xp?.toLocaleString() || 0} XP
              </Text>
            </View>
          </View>
        );
      case "coding":
      case "ctf":
      case "typing":
      case "overall":
        return (
          <View className={compact ? "gap-1" : "flex-row items-center gap-3"}>
            <View className="flex-row items-center gap-1">
              <Feather name="target" size={14} color="#22c55e" />
              <Text className="text-green-400 font-semibold text-sm">
                {user.challenges_solved || 0} Solved
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <FontAwesome5 name="star" size={12} color="#f59e0b" />
              <Text className="text-amber-400 font-medium text-sm">
                {user.total_points?.toLocaleString() || 0} pts
              </Text>
            </View>
          </View>
        );
      case "achievements":
        return (
          <View className="flex-row items-center gap-1">
            <FontAwesome5 name="award" size={14} color="#f59e0b" />
            <Text className="text-amber-400 font-semibold text-sm">
              {user.achievements_earned || 0} Earned
            </Text>
          </View>
        );
      case "streaks":
        return (
          <View className={compact ? "gap-1" : "flex-row items-center gap-3"}>
            <View className="flex-row items-center gap-1">
              <Octicons name="flame" size={14} color="#f59e0b" />
              <Text className="text-amber-400 font-semibold text-sm">
                {user.current_streak || 0} days
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Octicons name="trophy" size={14} color="#22c55e" />
              <Text className="text-green-400 font-medium text-sm">
                Best: {user.longest_streak || 0}
              </Text>
            </View>
          </View>
        );
      case "courses":
        return (
          <View className="flex-row items-center gap-1">
            <FontAwesome6 name="graduation-cap" size={14} color="#0ea5e9" />
            <Text className="text-sky-400 font-semibold text-sm">
              {user.courses_completed || 0} Completed
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <View className="w-10 h-10 rounded-lg bg-yellow-500/20 items-center justify-center">
          <FontAwesome5 name="crown" size={20} color="#facc15" />
        </View>
      );
    } else if (rank === 2) {
      return (
        <View className="w-10 h-10 rounded-lg bg-gray-400/20 items-center justify-center">
          <FontAwesome5 name="medal" size={20} color="#9ca3af" />
        </View>
      );
    } else if (rank === 3) {
      return (
        <View className="w-10 h-10 rounded-lg bg-amber-600/20 items-center justify-center">
          <FontAwesome5 name="medal" size={20} color="#d97706" />
        </View>
      );
    }
    return (
      <View className="w-10 h-10 rounded-lg bg-gray-800/50 items-center justify-center">
        <Text className="text-gray-400 font-bold">#{rank}</Text>
      </View>
    );
  };

  return (
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

      <View className="p-4">
        {/* Your Rank Card */}
        {myRank && (
          <GamifiedCard
            title="Your Rank"
            icon={<Octicons name="trophy" size={20} color="#f59e0b" />}
            className="mb-4"
          >
            <View className="items-center py-2">
              <Text className="text-4xl font-bold text-green-100 mb-3">
                #{myRank.rank}
              </Text>
              {getStatValue(myRank, true)}
            </View>
          </GamifiedCard>
        )}

        {/* Categories - Horizontal Scroll */}
        <GamifiedCard
          title="Categories"
          icon={<Feather name="target" size={20} color="#22c55e" />}
          className="mb-4"
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="-mx-2"
            contentContainerStyle={{ paddingHorizontal: 8 }}
          >
            {leaderboardTypes.map((type) => {
              const isActive = selectedType === type.type;
              return (
                <TouchableOpacity
                  key={type.type}
                  onPress={() => setSelectedType(type.type)}
                  className={`items-center px-4 py-3 mr-2 rounded-lg ${
                    isActive
                      ? "bg-green-500/10 border border-green-500/30"
                      : "bg-gray-800/30 border border-transparent"
                  }`}
                  style={{ minWidth: 80 }}
                >
                  {type.icon}
                  <Text
                    className={`text-xs mt-1 font-medium ${
                      isActive ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </GamifiedCard>

        {/* Rankings */}
        <GamifiedCard
          title={
            currentTypeConfig
              ? `${currentTypeConfig.label} Rankings`
              : "Rankings"
          }
          icon={<Octicons name="trophy" size={20} color="#f59e0b" />}
        >
          {loading ? (
            <View className="py-12 items-center">
              <ActivityIndicator size="large" color="#10B981" />
              <Text className="text-gray-400 mt-4">Loading leaderboard...</Text>
            </View>
          ) : error ? (
            <View className="py-12 items-center">
              <View className="w-16 h-16 bg-red-500/10 rounded-full items-center justify-center mb-4">
                <Ionicons
                  name="alert-circle-outline"
                  size={32}
                  color="#EF4444"
                />
              </View>
              <Text className="text-xl font-semibold text-white mb-2">
                Error Loading Leaderboard
              </Text>
              <Text className="text-gray-400 text-center mb-6">{error}</Text>
              <TouchableOpacity
                onPress={refetch}
                className="px-6 py-3 bg-green-600 rounded-lg"
              >
                <Text className="text-white font-semibold">Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : leaderboard.length === 0 ? (
            <View className="py-12 items-center">
              <View className="w-16 h-16 bg-gray-800/50 rounded-full items-center justify-center mb-4">
                <Octicons name="trophy" size={32} color="#9CA3AF" />
              </View>
              <Text className="text-xl font-semibold text-white mb-2">
                No Rankings Yet
              </Text>
              <Text className="text-gray-400 text-center">
                Be the first to compete!
              </Text>
            </View>
          ) : (
            <>
              {/* Top 3 Podium - Only show when we have 3 or more players */}
              {leaderboard.length >= 3 && (
                <View className="mb-6 pb-6 border-b border-green-500/20">
                  <View className="flex-row justify-center items-end">
                    {/* 2nd Place */}
                    <View className="items-center flex-1">
                      <View className="relative">
                        <View className="absolute -top-3 -right-1 z-10">
                          <View className="w-6 h-6 rounded-full bg-gray-400 items-center justify-center">
                            <Text className="text-white text-xs font-bold">
                              2
                            </Text>
                          </View>
                        </View>
                        <UserAvatar
                          user={{
                            id: leaderboard[1].user_id,
                            first_name: leaderboard[1].first_name,
                            last_name: leaderboard[1].last_name,
                            avatar: leaderboard[1].avatar,
                          }}
                          size="lg"
                        />
                      </View>
                      <View className="flex-row items-center justify-center mt-2">
                        <Text
                          className="text-white font-medium text-xs text-center"
                          numberOfLines={1}
                        >
                          {leaderboard[1].username}
                        </Text>
                        {user?.id === leaderboard[1].user_id && (
                          <View className="ml-1 px-1.5 py-0.5 bg-green-500/20 rounded">
                            <Text className="text-green-400 text-xs font-bold">You</Text>
                          </View>
                        )}
                      </View>
                      <View className="mt-1">
                        {getStatValue(leaderboard[1], true)}
                      </View>
                    </View>

                    {/* 1st Place */}
                    <View className="items-center flex-1 -mt-4">
                      <FontAwesome5
                        name="crown"
                        size={24}
                        color="#facc15"
                        style={{ marginBottom: 4 }}
                      />
                      <View className="relative">
                        <View className="absolute -top-3 -right-1 z-10">
                          <View className="w-6 h-6 rounded-full bg-yellow-500 items-center justify-center">
                            <Text className="text-white text-xs font-bold">
                              1
                            </Text>
                          </View>
                        </View>
                        <UserAvatar
                          user={{
                            id: leaderboard[0].user_id,
                            first_name: leaderboard[0].first_name,
                            last_name: leaderboard[0].last_name,
                            avatar: leaderboard[0].avatar,
                          }}
                          size="xl"
                        />
                      </View>
                      <View className="flex-row items-center justify-center mt-2">
                        <Text
                          className="text-white font-semibold text-sm text-center"
                          numberOfLines={1}
                        >
                          {leaderboard[0].username}
                        </Text>
                        {user?.id === leaderboard[0].user_id && (
                          <View className="ml-1 px-1.5 py-0.5 bg-green-500/20 rounded">
                            <Text className="text-green-400 text-xs font-bold">You</Text>
                          </View>
                        )}
                      </View>
                      <View className="mt-1">
                        {getStatValue(leaderboard[0], true)}
                      </View>
                    </View>

                    {/* 3rd Place */}
                    <View className="items-center flex-1">
                      <View className="relative">
                        <View className="absolute -top-3 -right-1 z-10">
                          <View className="w-6 h-6 rounded-full bg-amber-600 items-center justify-center">
                            <Text className="text-white text-xs font-bold">
                              3
                            </Text>
                          </View>
                        </View>
                        <UserAvatar
                          user={{
                            id: leaderboard[2].user_id,
                            first_name: leaderboard[2].first_name,
                            last_name: leaderboard[2].last_name,
                            avatar: leaderboard[2].avatar,
                          }}
                          size="lg"
                        />
                      </View>
                      <View className="flex-row items-center justify-center mt-2">
                        <Text
                          className="text-white font-medium text-xs text-center"
                          numberOfLines={1}
                        >
                          {leaderboard[2].username}
                        </Text>
                        {user?.id === leaderboard[2].user_id && (
                          <View className="ml-1 px-1.5 py-0.5 bg-green-500/20 rounded">
                            <Text className="text-green-400 text-xs font-bold">You</Text>
                          </View>
                        )}
                      </View>
                      <View className="mt-1">
                        {getStatValue(leaderboard[2], true)}
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* Rankings List - Show all if less than 3, otherwise skip top 3 */}
              <View className="gap-2">
                {(leaderboard.length < 3 ? leaderboard : leaderboard.slice(3)).map((leaderboardUser) => {
                  const isCurrentUser = user?.id === leaderboardUser.user_id;
                  return (
                    <View
                      key={leaderboardUser.user_id}
                      className={`flex-row items-center p-3 rounded-lg ${isCurrentUser ? 'bg-green-500/10 border border-green-500/30' : 'bg-gray-800/30'}`}
                    >
                      {getRankBadge(leaderboardUser.rank)}
                      <UserAvatar
                        user={{
                          id: leaderboardUser.user_id,
                          first_name: leaderboardUser.first_name,
                          last_name: leaderboardUser.last_name,
                          avatar: leaderboardUser.avatar,
                        }}
                        size="md"
                        className="ml-3"
                      />
                      <View className="flex-1 ml-3">
                        <View className="flex-row items-center">
                          <Text
                            className="text-white font-medium"
                            numberOfLines={1}
                          >
                            {leaderboardUser.username}
                          </Text>
                          {isCurrentUser && (
                            <View className="ml-2 px-1.5 py-0.5 bg-green-500/20 rounded">
                              <Text className="text-green-400 text-xs font-bold">You</Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-gray-500 text-xs">
                          {leaderboardUser.first_name} {leaderboardUser.last_name}
                        </Text>
                      </View>
                      <View>{getStatValue(leaderboardUser, true)}</View>
                    </View>
                  );
                })}
              </View>

              {/* Footer */}
              {leaderboard.length > 0 && (
                <View className="mt-6 pt-4 border-t border-green-500/20">
                  <Text className="text-center text-gray-500 text-sm">
                    Showing top {leaderboard.length} players
                  </Text>
                </View>
              )}
            </>
          )}
        </GamifiedCard>
      </View>
    </ScrollView>
  );
};

export default LeaderboardScreen;
