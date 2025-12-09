import GamifiedCard from "@/components/card/GamifiedCard";
import type { TestAttempt, TestResult as TestResultType, Violation } from "@/types/test";
import { Feather, Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TestResultProps {
  result: TestResultType;
  violations: Violation[];
  viewingAttempt: TestAttempt | null;
  isViewingPast: boolean;
  canStartAttempt: boolean;
  onBack: () => void;
  onBackToOverview: () => void;
  onTryAgain: () => void;
}

const TestResult: React.FC<TestResultProps> = ({
  result,
  violations,
  viewingAttempt,
  isViewingPast,
  canStartAttempt,
  onBack,
  onBackToOverview,
  onTryAgain,
}) => {
  const showPendingGrading = result.needs_manual_grading && result.graded_items < result.total_items;

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      <ScrollView className="flex-1">
        <View className="px-4 py-4 border-b border-gray-800/50">
          <View className="flex-row items-center mb-1">
            <TouchableOpacity 
              onPress={isViewingPast ? onBackToOverview : onBack} 
              className="mr-3"
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-2xl font-bold text-white">Test Result</Text>
              {isViewingPast && viewingAttempt && (
                <Text className="text-gray-400 text-sm">
                  Attempt #{viewingAttempt.attempt_number} • {new Date(viewingAttempt.started_at).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View className="p-4 items-center">
          <View
            className={`w-24 h-24 rounded-full items-center justify-center mb-4 ${
              showPendingGrading 
                ? "bg-yellow-500/20"
                : result.passed 
                  ? "bg-green-500/20" 
                  : "bg-red-500/20"
            }`}
          >
            {showPendingGrading ? (
              <Feather name="clock" size={48} color="#eab308" />
            ) : result.passed ? (
              <Feather name="check-circle" size={48} color="#22c55e" />
            ) : (
              <Feather name="x-circle" size={48} color="#ef4444" />
            )}
          </View>

          <Text
            className={`text-3xl font-bold mb-2 ${
              showPendingGrading
                ? "text-yellow-400"
                : result.passed 
                  ? "text-green-400" 
                  : "text-red-400"
            }`}
          >
            {showPendingGrading 
              ? "Pending Grading" 
              : result.passed 
                ? "Passed!" 
                : "Failed"}
          </Text>

          <Text className="text-gray-400 mb-6 text-center">
            {showPendingGrading
              ? "Some answers require manual grading. Your final score will be updated once grading is complete."
              : result.passed
                ? "Congratulations on completing the test!"
                : "Don't give up, try again!"}
          </Text>

          <GamifiedCard className="w-full mb-4">
            <View className="gap-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400">Score</Text>
                <Text className="text-2xl font-bold text-white">
                  {result.score}/{result.total_points}
                  {showPendingGrading && <Text className="text-yellow-400 text-sm"> (partial)</Text>}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-400">Percentage</Text>
                <Text className="text-white font-semibold">
                  {result.percentage.toFixed(1)}%
                </Text>
              </View>
              {showPendingGrading && (
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-400">Graded</Text>
                  <Text className="text-yellow-400 font-semibold">
                    {result.graded_items}/{result.total_items} items
                  </Text>
                </View>
              )}
              {/* Show violations for current attempt or from viewing attempt */}
              {(violations.length > 0 || (viewingAttempt?.violations_count !== undefined && viewingAttempt.violations_count > 0)) && (
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-400">Violations</Text>
                  <Text className="text-red-400 font-semibold">
                    {isViewingPast ? (viewingAttempt?.violations_count ?? 0) : violations.length}
                  </Text>
                </View>
              )}
              {/* Show time spent if viewing past attempt */}
              {isViewingPast && viewingAttempt?.time_spent_minutes !== undefined && viewingAttempt.time_spent_minutes !== null && (
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-400">Time Spent</Text>
                  <Text className="text-white font-semibold">
                    {`${viewingAttempt.time_spent_minutes} min`}
                  </Text>
                </View>
              )}
              {/* Show status for past attempts */}
              {isViewingPast && viewingAttempt && (
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-400">Status</Text>
                  <Text className={`font-semibold ${
                    viewingAttempt.status === 'graded' ? 'text-green-400' : 
                    viewingAttempt.status === 'submitted' ? 'text-yellow-400' : 'text-gray-400'
                  }`}>
                    {viewingAttempt.status === 'graded' ? 'Graded' : 
                     viewingAttempt.status === 'submitted' ? 'Awaiting Grading' : 
                     viewingAttempt.status}
                  </Text>
                </View>
              )}
            </View>
          </GamifiedCard>

          {isViewingPast ? (
            <View className="w-full gap-3">
              {canStartAttempt && (
                <TouchableOpacity
                  onPress={onTryAgain}
                  className="w-full py-3 bg-green-600 rounded-lg items-center"
                >
                  <Text className="text-white font-semibold">Try Again</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={onBackToOverview}
                className="w-full py-3 bg-gray-700 rounded-lg items-center"
              >
                <Text className="text-white font-semibold">Back to Overview</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={onBack}
              className="w-full py-3 bg-green-600 rounded-lg items-center"
            >
              <Text className="text-white font-semibold">Back to Tests</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TestResult;
