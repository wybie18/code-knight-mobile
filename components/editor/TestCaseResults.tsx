import type { TestResultsData as ChallengeTestResultsData } from "@/types/challenges";
import type { TestResultsData as LessonTestResultsData } from "@/types/course/lesson";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface TestCaseResultsProps {
  results: LessonTestResultsData | ChallengeTestResultsData;
  isRunning?: boolean;
}

export const TestCaseResults: React.FC<TestCaseResultsProps> = ({
  results,
  isRunning = false,
}) => {
  const [activeTab, setActiveTab] = useState(0);

  const formatMemoryUsage = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatInput = (
    input: Record<string, any> | null | undefined
  ): string => {
    if (input === null || input === undefined) {
      return "No input provided.";
    }

    return Object.entries(input)
      .map(([key, value]) => {
        const formattedValue = value === undefined ? null : value;
        return `${key} = ${JSON.stringify(formattedValue)}`;
      })
      .join(", ");
  };

  const formatOutput = (output: any): string => {
    try {
      const parsedOutput = JSON.parse(output);
      return JSON.stringify(parsedOutput);
    } catch (error) {
      return String(output);
    }
  };

  const getTotalExecutionTime = (): string => {
    const total = results.results
      .filter((result) => result.execution_time)
      .reduce(
        (total, result) => total + parseFloat(result.execution_time!),
        0
      );
    return total.toFixed(3);
  };

  const getPeakMemoryUsage = (): string => {
    const memoryUsages = results.results
      .filter((result) => result.memory_usage)
      .map((r) => r.memory_usage!);

    if (memoryUsages.length === 0) return "N/A";
    return formatMemoryUsage(Math.max(...memoryUsages));
  };

  if (isRunning) {
    return (
      <View className="flex-1 items-center justify-center bg-[#1e1e1e]">
        <View className="flex-row items-center gap-3">
          <Ionicons name="play" size={20} color="#10B981" />
          <Text className="text-gray-300 text-sm font-medium">
            Running test cases...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#1e1e1e]">
      <ScrollView className="flex-1">
        {/* Summary Header */}
        <View className="bg-[#222222] border-b border-gray-700/30 px-6 py-4">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <Ionicons
                name={results.passed ? "checkmark-circle" : "close-circle"}
                size={20}
                color={results.passed ? "#10B981" : "#EF4444"}
              />
              <Text
                className={`font-semibold text-sm ${
                  results.passed ? "text-green-400" : "text-red-400"
                }`}
              >
                {results.passed ? "All Tests Passed" : "Some Tests Failed"}
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <Ionicons name="time-outline" size={14} color="#9CA3AF" />
              <Text className="text-gray-400 text-xs">
                {getTotalExecutionTime()}s total
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="hardware-chip-outline" size={14} color="#9CA3AF" />
              <Text className="text-gray-400 text-xs">
                {getPeakMemoryUsage()} peak
              </Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View className="border-b border-gray-700">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row px-4">
              {results.results.map((result, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setActiveTab(index)}
                  className={`flex-row items-center gap-2 px-4 py-3 border-b-2 ${
                    activeTab === index
                      ? "border-green-500 bg-green-500/10"
                      : "border-transparent"
                  }`}
                >
                  <Ionicons
                    name="ellipse"
                    size={16}
                    color={activeTab === index ? "#10B981" : "#6B7280"}
                  />
                  <Text
                    className={`text-sm font-medium ${
                      activeTab === index ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    Case {result.test_case + 1}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Test Case Details */}
        {results.results.map((result, index) => (
          <View
            key={index}
            className={activeTab === index ? "block" : "hidden"}
          >
            <View className="p-6 space-y-6">
              {/* Test Case Header */}
              <View className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/50">
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-3">
                    <Ionicons
                      name={result.passed ? "checkmark-circle" : "close-circle"}
                      size={24}
                      color={result.passed ? "#10B981" : "#EF4444"}
                    />
                    <Text
                      className={`text-base font-semibold ${
                        result.passed ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      Test Case {result.test_case + 1}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-4 mt-2">
                  {result.execution_time && (
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="time-outline" size={14} color="#9CA3AF" />
                      <Text className="text-gray-400 text-sm">
                        {result.execution_time}s
                      </Text>
                    </View>
                  )}
                  {result.memory_usage !== undefined && (
                    <View className="flex-row items-center gap-1">
                      <Ionicons
                        name="hardware-chip-outline"
                        size={14}
                        color="#9CA3AF"
                      />
                      <Text className="text-gray-400 text-sm">
                        {formatMemoryUsage(result.memory_usage)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Error Case */}
              {"error" in result && result.error && (
                <View className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <View className="flex-row items-center gap-2 mb-3">
                    <Ionicons name="alert-circle" size={20} color="#EF4444" />
                    <Text className="text-red-400 font-semibold text-sm">
                      Runtime Error
                    </Text>
                  </View>
                  <View className="bg-black/30 rounded p-3">
                    <Text className="text-red-300 text-xs font-mono">
                      {result.error}
                    </Text>
                  </View>
                  {"stderr" in result && result.stderr && (
                    <View className="mt-3">
                      <Text className="text-gray-400 text-xs mb-2">
                        Standard Error:
                      </Text>
                      <View className="bg-black/30 rounded p-3">
                        <Text className="text-red-300 text-xs font-mono">
                          {result.stderr}
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* Normal Case (Input/Output Details) */}
              {!("error" in result && result.error) && (
                <View className="space-y-4">
                  {/* Input */}
                  <View>
                    <Text className="text-gray-300 font-semibold text-sm mb-2">
                      Input
                    </Text>
                    <View className="bg-gray-800/50 rounded-lg p-3">
                      <Text className="text-gray-300 text-xs font-mono">
                        {formatInput(result.input)}
                      </Text>
                    </View>
                  </View>

                  {/* Actual Output */}
                  <View>
                    <Text className="text-gray-300 font-semibold text-sm mb-2">
                      Your Output
                    </Text>
                    <View className="bg-gray-800/50 rounded-lg p-3">
                      <Text
                        className={`text-xs font-mono ${
                          result.passed ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {JSON.stringify(result.actual_output) || "No output"}
                      </Text>
                    </View>
                  </View>

                  {/* Expected Output (if failed) */}
                  {!result.passed &&
                    result.expected_output !== undefined &&
                    result.actual_output !== undefined && (
                      <View>
                        <Text className="text-gray-300 font-semibold text-sm mb-2">
                          Expected Output
                        </Text>
                        <View className="bg-gray-800/50 rounded-lg p-3">
                          <Text className="text-green-400 text-xs font-mono">
                            {formatOutput(result.expected_output)}
                          </Text>
                        </View>
                      </View>
                    )}
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
