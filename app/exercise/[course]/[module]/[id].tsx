import {
  PrimaryButton,
  SecondaryOutlineButton,
  SuccessButton,
} from "@/components/button";
import {
  ConsoleOutput,
  MonacoEditor,
  TestCaseResults,
} from "@/components/editor";
import {
  executeCode,
  getExerciseById,
  submitCode,
} from "@/services/contentService";
import { markdownStyles } from "@/styles/markdownStyles";
import type { StudentExercise, TestResultsData } from "@/types/course/lesson";
import type { NextContent, PrevContent } from "@/types/navigation/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExerciseScreen() {
  const router = useRouter();
  const { course, module, id } = useLocalSearchParams<{
    course: string;
    module: string;
    id: string;
  }>();

  const [activity, setActivity] = useState<StudentExercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editorValue, setEditorValue] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResultsData | null>(null);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [showConsole, setShowConsole] = useState(false);

  const [nextUrl, setNextUrl] = useState<NextContent | null>(null);
  const [prevUrl, setPrevUrl] = useState<PrevContent | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const [activeTab, setActiveTab] = useState<"description" | "code">(
    "description"
  );
  const [consoleTab, setConsoleTab] = useState<"console" | "tests">("console");

  useEffect(() => {
    const fetchExercise = async () => {
      if (!course || !module || !id) {
        router.push("/courses");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await getExerciseById(course, module, id);
        if (response.success) {
          setActivity(response.data);
          setEditorValue(response.data.problem.starter_code || "");
          setNextUrl(response.next_content || null);
          setPrevUrl(response.prev_content || null);
        } else {
          setError("Failed to load exercise data.");
        }
      } catch (err) {
        setError("Failed to load exercise. Please try again.");
        console.error("Error fetching exercise:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExercise();
  }, [course, module, id]);

  const handleExecuteCode = async () => {
    if (!activity) return;

    setTestResults(null);
    setOutput("Running...");
    setIsRunning(true);
    setShowConsole(true);
    setConsoleTab("console");

    try {
      const response = await executeCode(
        activity.course.programming_language.id,
        editorValue
      );

      if (response.success) {
        let outputText = "";
        if (response.data.output) {
          outputText += `### Output\n\n\`\`\`\n${response.data.output}\n\`\`\`\n\n`;
        }
        if (response.data.error) {
          outputText += `### Error\n\n\`\`\`\n${response.data.error}\n\`\`\`\n\n`;
        }
        outputText += `**Execution Time:** ${response.data.execution_time}s\n`;
        outputText += `**Memory Usage:** ${(
          response.data.memory_usage / 1024
        ).toFixed(2)} KB`;
        setOutput(outputText);
      } else {
        setOutput("Failed to execute code. Please try again.");
      }
    } catch (error) {
      setOutput("### Error\n\nFailed to execute code. Please try again.");
      console.error("Error executing code:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!activity) return;

    setIsTestRunning(true);
    setIsRunning(true);
    setTestResults(null);
    setOutput("Running test cases...");
    setShowConsole(true);
    setConsoleTab("tests");

    try {
      const response = await submitCode(
        activity.id,
        activity.course.programming_language.id,
        editorValue
      );

      if (response.success) {
        setTestResults(response.data);
        if (response.data.passed) {
          setIsCompleted(true);
          setNextUrl(response.next_content || null);
        }
      } else {
        setOutput("Failed to run test cases. Please try again.");
      }
    } catch (error) {
      setOutput("### Error\n\nFailed to run test cases. Please try again.");
      console.error("Error submitting code:", error);
      setTestResults(null);
    } finally {
      setIsTestRunning(false);
      setIsRunning(false);
    }
  };

  const handlePrevNav = () => {
    if (!prevUrl) return;
    switch (prevUrl.type) {
      case "lesson":
        router.push(
          `/lesson/${course}/${prevUrl.module.slug}/${prevUrl.content.slug}` as any
        );
        break;
      case "code":
        router.push(
          `/exercise/${course}/${prevUrl.module.slug}/${prevUrl.content.id}` as any
        );
        break;
      case "quiz":
        router.push(
          `/quiz/${course}/${prevUrl.module.slug}/${prevUrl.content.id}` as any
        );
        break;
    }
  };

  const handleNextNav = () => {
    if (!nextUrl) return;
    switch (nextUrl.type) {
      case "lesson":
        router.push(
          `/lesson/${course}/${nextUrl.module.slug}/${nextUrl.content.slug}` as any
        );
        break;
      case "code":
        router.push(
          `/exercise/${course}/${nextUrl.module.slug}/${nextUrl.content.id}` as any
        );
        break;
      case "quiz":
        router.push(
          `/quiz/${course}/${nextUrl.module.slug}/${nextUrl.content.id}` as any
        );
        break;
      case "congratulations":
        router.push(`/course/${course}`);
        break;
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-gray-400 mt-4">Loading exercise...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="alert-circle" size={64} color="#EF4444" />
          <Text className="text-red-400 text-lg font-semibold mt-4">
            {error}
          </Text>
          <SecondaryOutlineButton
            onPress={() => router.back()}
            className="mt-6"
          >
            Go Back
          </SecondaryOutlineButton>
        </View>
      </SafeAreaView>
    );
  }

  if (!activity) return null;

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="border-b border-gray-800 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#9CA3AF" />
            </TouchableOpacity>
            <Text
              className="text-white font-semibold text-base flex-1"
              numberOfLines={1}
            >
              {activity.title}
            </Text>
          </View>
          <View className="flex-row items-center gap-2 ml-2">
            {activity.is_required && (
              <View className="bg-orange-500/20 px-3 py-1 rounded-full">
                <Text className="text-orange-400 text-xs font-medium">
                  Required
                </Text>
              </View>
            )}
            <View className="bg-green-500/20 px-3 py-1 rounded-full">
              <Text className="text-green-400 text-xs font-medium">
                +{activity.exp_reward} XP
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Switcher */}
      <View className="border-b border-gray-800">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setActiveTab("description")}
            className={`flex-1 py-3 border-b-2 ${
              activeTab === "description"
                ? "border-green-500 bg-green-500/10"
                : "border-transparent"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "description" ? "text-green-400" : "text-gray-400"
              }`}
            >
              Problem
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("code")}
            className={`flex-1 py-3 border-b-2 ${
              activeTab === "code"
                ? "border-green-500 bg-green-500/10"
                : "border-transparent"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "code" ? "text-green-400" : "text-gray-400"
              }`}
            >
              Code Editor
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        {activeTab === "description" ? (
          <>
            <ScrollView className="flex-1 bg-black">
              <View className="p-6 space-y-4">
                <View className="mb-4">
                  <Text className="text-gray-400 text-sm mb-2">Title</Text>
                  <Text className="text-white text-base">{activity.title}</Text>
                </View>

                <View className="mb-4">
                  <Text className="text-gray-400 text-sm mb-2">
                    Description
                  </Text>
                  <Text className="text-white text-base">
                    {activity.description}
                  </Text>
                </View>

                <View className="mb-4">
                  <Text className="text-gray-400 text-sm mb-2">
                    Problem Statement
                  </Text>
                  <Markdown style={markdownStyles}>
                    {activity.problem.problem_statement}
                  </Markdown>
                </View>
              </View>
            </ScrollView>
            <View className="px-6 pb-6 space-y-3">
              <View className="flex-row gap-3">
                <SecondaryOutlineButton
                  onPress={handlePrevNav}
                  className="flex-1"
                  disabled={isRunning || !prevUrl}
                >
                  <Ionicons name="chevron-back" size={16} color="#9CA3AF" />
                  <Text className="text-gray-400 ml-2">Previous</Text>
                </SecondaryOutlineButton>
                <PrimaryButton
                  onPress={handleNextNav}
                  className="flex-1"
                  disabled={!nextUrl || !isCompleted || isRunning}
                >
                  <Text className="text-white mr-2">
                    {nextUrl?.type === "congratulations" ? "Complete" : "Next"}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
                </PrimaryButton>
              </View>
            </View>
          </>
        ) : (
          <View className="flex-1 bg-black">
            <View className="flex-1">
              <MonacoEditor
                value={editorValue}
                onChange={setEditorValue}
                language={
                  activity.course.programming_language.name.toLowerCase() as any
                }
              />
            </View>

            {/* Console/Test Results */}
            {showConsole && (
              <View className="h-64 border-t border-gray-800">
                {/* Console Tab Switcher */}
                <View className="border-b border-gray-700">
                  <View className="flex-row">
                    <TouchableOpacity
                      onPress={() => setConsoleTab("console")}
                      className={`flex-1 py-2 border-b-2 ${
                        consoleTab === "console"
                          ? "border-green-500 bg-green-500/10"
                          : "border-transparent"
                      }`}
                    >
                      <Text
                        className={`text-center text-xs font-medium ${
                          consoleTab === "console"
                            ? "text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        Console
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setConsoleTab("tests")}
                      className={`flex-1 py-2 border-b-2 ${
                        consoleTab === "tests"
                          ? "border-green-500 bg-green-500/10"
                          : "border-transparent"
                      }`}
                    >
                      <Text
                        className={`text-center text-xs font-medium ${
                          consoleTab === "tests"
                            ? "text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        Test Results
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {consoleTab === "console" ? (
                  <ConsoleOutput output={output} isRunning={isRunning} />
                ) : testResults ? (
                  <TestCaseResults
                    results={testResults}
                    isRunning={isTestRunning}
                  />
                ) : (
                  <View className="flex-1 items-center justify-center bg-[#1e1e1e]">
                    <Text className="text-gray-500 text-sm">
                      Run tests to see results
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <View className="border-t border-gray-800 px-4 py-3 bg-black">
              <View className="flex-row gap-3 mb-3">
                <SecondaryOutlineButton
                  onPress={() => setShowConsole(!showConsole)}
                  className="flex-1"
                >
                  <Ionicons
                    name={showConsole ? "chevron-down" : "chevron-up"}
                    size={16}
                    color="#9CA3AF"
                  />
                  <Text className="text-gray-400 ml-2">
                    {showConsole ? "Hide" : "Show"} Output
                  </Text>
                </SecondaryOutlineButton>
                <SecondaryOutlineButton
                  onPress={handleExecuteCode}
                  disabled={isRunning}
                  loading={isRunning}
                  className="flex-1"
                >
                  <Ionicons name="play" size={16} color="#9CA3AF" />
                  <Text className="text-gray-400 ml-2">Run</Text>
                </SecondaryOutlineButton>
              </View>
              <SuccessButton
                onPress={handleSubmitCode}
                disabled={isRunning}
                loading={isTestRunning}
                className="w-full"
              >
                <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                <Text className="text-white ml-2 font-semibold">
                  Submit Code
                </Text>
              </SuccessButton>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
