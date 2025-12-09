import GamifiedCard from "@/components/card/GamifiedCard";
import type { StudentTestStats, Test, TestAttempt } from "@/types/test";
import {
    Feather,
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TestOverviewProps {
  test: Test;
  studentStats: StudentTestStats | null;
  canStartAttempt: boolean;
  maxViolations: number;
  onBack: () => void;
  onStartTest: () => void;
  onResumeAttempt: (attemptId: number) => void;
  onViewAttemptResult: (attempt: TestAttempt) => void;
}

const TestOverview: React.FC<TestOverviewProps> = ({
  test,
  studentStats,
  canStartAttempt,
  maxViolations,
  onBack,
  onStartTest,
  onResumeAttempt,
  onViewAttemptResult,
}) => {
  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="px-4 py-4 border-b border-gray-800/50">
          <View className="flex-row items-center mb-1">
            <TouchableOpacity onPress={onBack} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text
              className="text-2xl font-bold text-white flex-1"
              numberOfLines={1}
            >
              {test?.title}
            </Text>
          </View>
        </View>

        <View className="p-4">
          {/* Test Info */}
          <GamifiedCard
            title="Test Details"
            icon={<Feather name="info" size={18} color="#22c55e" />}
            className="mb-4"
          >
            {test?.description && (
              <Text className="text-gray-400 mb-4">{test.description}</Text>
            )}

            {test?.instructions && (
              <View className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                <Text className="text-blue-300 text-sm">{test.instructions}</Text>
              </View>
            )}

            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={18}
                    color="#9ca3af"
                  />
                  <Text className="text-gray-400 ml-2">Duration</Text>
                </View>
                <Text className="text-white font-semibold">
                  {test?.duration_minutes
                    ? `${test.duration_minutes} minutes`
                    : "No time limit"}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Feather name="help-circle" size={18} color="#9ca3af" />
                  <Text className="text-gray-400 ml-2">Questions</Text>
                </View>
                <Text className="text-white font-semibold">
                  {test?.items?.length || 0}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <FontAwesome5 name="star" size={14} color="#9ca3af" />
                  <Text className="text-gray-400 ml-2">Total Points</Text>
                </View>
                <Text className="text-white font-semibold">
                  {test?.total_points || 0}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Feather name="repeat" size={16} color="#9ca3af" />
                  <Text className="text-gray-400 ml-2">Max Attempts</Text>
                </View>
                <Text className="text-white font-semibold">
                  {test?.max_attempts || "Unlimited"}
                </Text>
              </View>
            </View>
          </GamifiedCard>

          {/* Anti-Cheat Warning */}
          <View className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="shield-checkmark" size={20} color="#eab308" />
              <Text className="text-yellow-400 font-semibold ml-2">
                Anti-Cheat Enabled
              </Text>
            </View>
            <Text className="text-yellow-200/70 text-sm">
              This test has anti-cheat protection. Leaving the app during the test
              will be recorded as a violation. {maxViolations} violations will
              automatically submit your test.
            </Text>
          </View>

          {/* Student Stats */}
          {studentStats && (
            <GamifiedCard
              title="Your Progress"
              icon={<FontAwesome5 name="chart-line" size={16} color="#22c55e" />}
              className="mb-4"
            >
              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-400">Attempts Used</Text>
                  <Text className="text-white font-semibold">
                    {studentStats.total_attempts}/{test?.max_attempts || "∞"}
                  </Text>
                </View>
                {studentStats.best_score !== null && (
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-400">Best Score</Text>
                    <Text className="text-amber-400 font-semibold">
                      {studentStats.best_score}/{studentStats.max_possible_score} (
                      {studentStats.best_percentage.toFixed(1)}%)
                    </Text>
                  </View>
                )}
              </View>
            </GamifiedCard>
          )}

          {/* Start Button */}
          <TouchableOpacity
            onPress={onStartTest}
            disabled={!canStartAttempt}
            className={`w-full py-4 rounded-lg items-center mb-4 ${
              canStartAttempt ? "bg-green-600" : "bg-gray-700"
            }`}
          >
            <Text
              className={`font-bold text-lg ${
                canStartAttempt ? "text-white" : "text-gray-400"
              }`}
            >
              {studentStats?.total_attempts
                ? "Start New Attempt"
                : "Start Test"}
            </Text>
          </TouchableOpacity>

          {!canStartAttempt && (
            <Text className="text-red-400 text-center text-sm mb-4">
              You have reached the maximum number of attempts for this test.
            </Text>
          )}

          {/* Previous Attempts */}
          {test?.attempts && test.attempts.length > 0 && (
            <GamifiedCard
              title="Previous Attempts"
              icon={<Feather name="list" size={18} color="#22c55e" />}
            >
              <View className="gap-3">
                {test.attempts.slice(0, 5).map((attemptItem) => {
                  const isClickable = attemptItem.status === "submitted" || attemptItem.status === "graded";
                  const isInProgress = attemptItem.status === "in_progress";
                  
                  return (
                    <TouchableOpacity
                      key={attemptItem.id}
                      onPress={() => {
                        if (isInProgress) {
                          onResumeAttempt(attemptItem.id);
                        } else if (isClickable) {
                          onViewAttemptResult(attemptItem);
                        }
                      }}
                      disabled={!isClickable && !isInProgress}
                      className={`flex-row items-center justify-between p-3 bg-gray-800/30 rounded-lg ${
                        isClickable || isInProgress ? "active:bg-gray-700/50" : ""
                      }`}
                    >
                      <View className="flex-1">
                        <Text className="text-white font-medium">
                          Attempt #{attemptItem.attempt_number}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          {new Date(attemptItem.started_at).toLocaleDateString()}
                        </Text>
                        {attemptItem.violations_count !== undefined &&
                          attemptItem.violations_count > 0 && (
                            <Text className="text-red-400 text-xs">
                              {attemptItem.violations_count} violation(s)
                            </Text>
                          )}
                      </View>
                      <View className="items-end flex-row gap-2">
                        <View className="items-end">
                          {attemptItem.status === "submitted" ||
                          attemptItem.status === "graded" ? (
                            <>
                              <Text
                                className={`font-bold ${
                                  attemptItem.total_score !== null &&
                                  attemptItem.total_score >=
                                    (test?.total_points || 0) * 0.5
                                    ? "text-green-400"
                                    : "text-red-400"
                                }`}
                              >
                                {attemptItem.total_score ?? "-"}/{test?.total_points}
                              </Text>
                              <Text
                                className={`text-xs ${
                                  attemptItem.status === "graded"
                                    ? "text-green-500"
                                    : "text-yellow-500"
                                }`}
                              >
                                {attemptItem.status === "graded"
                                  ? "Graded"
                                  : "Submitted"}
                              </Text>
                            </>
                          ) : (
                            <Text className="text-yellow-400 text-sm">
                              {attemptItem.status === "in_progress"
                                ? "In Progress"
                                : attemptItem.status}
                            </Text>
                          )}
                        </View>
                        {(isClickable || isInProgress) && (
                          <Feather name="chevron-right" size={16} color="#6b7280" />
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </GamifiedCard>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TestOverview;
