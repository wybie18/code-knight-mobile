import GamifiedCard from "@/components/card/GamifiedCard";
import { testService } from "@/services/testService";
import type { Test } from "@/types/test";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TestsScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tests, setTests] = useState<Test[]>([]);

  const fetchTests = async () => {
    try {
      setError(null);
      const response = await testService.getMyTests();
      if (response.success) {
        setTests(response.data);
      }
    } catch (err) {
      setError("Failed to load tests. Please try again.");
      console.error("Error fetching tests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTests();
    setRefreshing(false);
  };

  const getStatusColor = (status: Test["status"]) => {
    switch (status) {
      case "active":
        return { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" };
      case "scheduled":
        return { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" };
      case "closed":
        return { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/30" };
      case "archived":
        return { bg: "bg-gray-500/20", text: "text-gray-500", border: "border-gray-500/30" };
      default:
        return { bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" };
    }
  };

  const getStatusLabel = (status: Test["status"]) => {
    switch (status) {
      case "active":
        return "Active";
      case "scheduled":
        return "Scheduled";
      case "closed":
        return "Closed";
      case "archived":
        return "Archived";
      case "draft":
        return "Draft";
      default:
        return status;
    }
  };

  const getTestAction = (test: Test) => {
    if (test.student_stats?.latest_attempt?.status === "in_progress") {
      return { label: "Resume", color: "text-yellow-400" };
    }
    if (test.student_stats?.total_attempts && test.student_stats.total_attempts > 0) {
      if (test.can_start_attempt) {
        return { label: "Retake", color: "text-green-400" };
      }
      return { label: "View Results", color: "text-blue-400" };
    }
    if (test.can_start_attempt) {
      return { label: "Start Test", color: "text-green-400" };
    }
    return { label: "View Details", color: "text-gray-400" };
  };

  const handleTestPress = (test: Test) => {
    // Use slug for navigation (API expects slug, not id)
    const identifier = test.slug || test.id.toString();
    console.log("Navigating to test with identifier:", identifier, "slug:", test.slug, "id:", test.id);
    router.push(`/profile/tests/${identifier}` as any);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate stats from tests
  const activeTests = tests.filter((t) => t.status === "active");
  const completedTests = tests.filter(
    (t) => t.student_stats?.total_attempts && t.student_stats.total_attempts > 0
  );
  const inProgressTests = tests.filter(
    (t) => t.student_stats?.latest_attempt?.status === "in_progress"
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-gray-400 mt-4">Loading tests...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center px-4">
          <View className="w-16 h-16 bg-red-500/10 rounded-full items-center justify-center mb-4">
            <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
          </View>
          <Text className="text-xl font-semibold text-white mb-2">Error</Text>
          <Text className="text-gray-400 text-center mb-6">{error}</Text>
          <TouchableOpacity
            onPress={fetchTests}
            className="px-6 py-3 bg-green-600 rounded-lg"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
            <Text className="text-2xl font-bold text-white">My Tests</Text>
          </View>
          <Text className="text-gray-400 text-sm ml-9">
            View and take your assigned tests
          </Text>
        </View>

        <View className="p-4">
          {/* Stats Overview */}
          <View className="flex-row gap-2 mb-4">
            <View className="flex-1">
              <GamifiedCard>
                <View className="items-center py-2">
                  <Text className="text-2xl font-bold text-green-100">
                    {activeTests.length}
                  </Text>
                  <Text className="text-xs text-gray-500">Active</Text>
                </View>
              </GamifiedCard>
            </View>
            <View className="flex-1">
              <GamifiedCard>
                <View className="items-center py-2">
                  <Text className="text-2xl font-bold text-green-400">
                    {completedTests.length}
                  </Text>
                  <Text className="text-xs text-gray-500">Attempted</Text>
                </View>
              </GamifiedCard>
            </View>
            <View className="flex-1">
              <GamifiedCard>
                <View className="items-center py-2">
                  <Text className="text-2xl font-bold text-yellow-400">
                    {inProgressTests.length}
                  </Text>
                  <Text className="text-xs text-gray-500">In Progress</Text>
                </View>
              </GamifiedCard>
            </View>
          </View>

          {/* Tests List */}
          {tests.length > 0 ? (
            <View className="gap-3">
              {tests.map((test) => {
                const statusStyle = getStatusColor(test.status);
                const action = getTestAction(test);
                const studentStats = test.student_stats;

                return (
                  <TouchableOpacity
                    key={test.id}
                    onPress={() => handleTestPress(test)}
                    className={`p-4 rounded-xl border bg-gray-800/30 ${statusStyle.border}`}
                  >
                    <View className="flex-row items-start justify-between mb-2">
                      <View className="flex-1 mr-3">
                        <Text className="text-white font-semibold text-lg">
                          {test.title}
                        </Text>
                        {test.course && (
                          <Text className="text-gray-500 text-sm">
                            {test.course.title}
                          </Text>
                        )}
                        {test.description && (
                          <Text
                            className="text-gray-400 text-sm mt-1"
                            numberOfLines={2}
                          >
                            {test.description}
                          </Text>
                        )}
                      </View>
                      <View className={`px-2 py-1 rounded ${statusStyle.bg}`}>
                        <Text className={`text-xs font-medium ${statusStyle.text}`}>
                          {getStatusLabel(test.status)}
                        </Text>
                      </View>
                    </View>

                    {/* Test Info */}
                    <View className="flex-row flex-wrap gap-3 mt-3">
                      {test.duration_minutes && (
                        <View className="flex-row items-center">
                          <MaterialCommunityIcons
                            name="clock-outline"
                            size={14}
                            color="#9ca3af"
                          />
                          <Text className="text-gray-400 text-xs ml-1">
                            {test.duration_minutes} min
                          </Text>
                        </View>
                      )}
                      <View className="flex-row items-center">
                        <Feather name="help-circle" size={14} color="#9ca3af" />
                        <Text className="text-gray-400 text-xs ml-1">
                          {test.items_count || 0} questions
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <FontAwesome5 name="star" size={12} color="#9ca3af" />
                        <Text className="text-gray-400 text-xs ml-1">
                          {test.total_points} pts
                        </Text>
                      </View>
                    </View>

                    {/* Time Info */}
                    {(test.start_time || test.end_time) && (
                      <View className="flex-row flex-wrap gap-3 mt-2">
                        {test.start_time && (
                          <View className="flex-row items-center">
                            <Feather name="calendar" size={12} color="#6b7280" />
                            <Text className="text-gray-500 text-xs ml-1">
                              Start: {formatDate(test.start_time)}
                            </Text>
                          </View>
                        )}
                        {test.end_time && (
                          <View className="flex-row items-center">
                            <Feather name="calendar" size={12} color="#6b7280" />
                            <Text className="text-gray-500 text-xs ml-1">
                              End: {formatDate(test.end_time)}
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    {/* Best Score & Attempts */}
                    {studentStats && studentStats.total_attempts > 0 && (
                      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-700/30">
                        <View className="flex-row items-center">
                          <FontAwesome5 name="redo" size={12} color="#9ca3af" />
                          <Text className="text-gray-400 text-xs ml-1">
                            {studentStats.total_attempts}/
                            {test.max_attempts === 0 ? "∞" : test.max_attempts} attempts
                          </Text>
                        </View>
                        {studentStats.best_score !== null && (
                          <View className="flex-row items-center">
                            <FontAwesome5 name="trophy" size={12} color="#f59e0b" />
                            <Text className="text-amber-400 text-xs ml-1">
                              Best: {studentStats.best_percentage.toFixed(0)}%
                            </Text>
                          </View>
                        )}
                      </View>
                    )}

                    {/* In Progress Indicator */}
                    {studentStats?.latest_attempt?.status === "in_progress" && (
                      <View className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2 mt-3">
                        <View className="flex-row items-center">
                          <MaterialCommunityIcons
                            name="progress-clock"
                            size={16}
                            color="#eab308"
                          />
                          <Text className="text-yellow-400 text-sm ml-2">
                            You have an attempt in progress
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* Action */}
                    <View className="flex-row items-center justify-end mt-3">
                      <Text className={`text-sm font-medium mr-1 ${action.color}`}>
                        {action.label}
                      </Text>
                      <Feather name="chevron-right" size={16} color="#22c55e" />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View className="py-12 items-center">
              <View className="w-16 h-16 bg-gray-800/50 rounded-full items-center justify-center mb-4">
                <MaterialCommunityIcons
                  name="clipboard-text-outline"
                  size={32}
                  color="#6b7280"
                />
              </View>
              <Text className="text-xl font-semibold text-white mb-2">
                No Tests Available
              </Text>
              <Text className="text-gray-400 text-center">
                You don't have any tests assigned yet.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TestsScreen;
