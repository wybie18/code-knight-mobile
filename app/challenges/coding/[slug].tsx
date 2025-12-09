import { PrimaryButton, SecondaryOutlineButton } from "@/components/button";
import {
  ConsoleOutput,
  MonacoEditor,
  TestCaseResults,
} from "@/components/editor";
import { challengesService } from "@/services/challengesService";
import { markdownStyles } from "@/styles/markdownStyles";
import type {
  Challenge,
  ChallengeSubmission,
  CodingChallenge,
  TestResultsData
} from "@/types/challenges";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import * as Clipboard from "expo-clipboard";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const getStorageKey = (slug: string, languageId: number) =>
  `challenge_code_${slug}_${languageId}`;

export default function CodingChallengeScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const codingChallenge = challenge?.challengeable as CodingChallenge | undefined;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedLanguageIndex, setSelectedLanguageIndex] = useState(0);
  const [editorValue, setEditorValue] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [testResults, setTestResults] = useState<TestResultsData | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConsole, setShowConsole] = useState(false);

  // Submissions state
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] =
    useState<ChallengeSubmission | null>(null);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState<"problem" | "submissions" | "code">("problem");

  const fetchSubmissions = async () => {
    if (!slug) return;

    setLoadingSubmissions(true);
    try {
      const response = await challengesService.getChallengeSubmissions(slug);
      if (response.success) {
        setSubmissions(response.data.submissions);
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
    } finally {
      setLoadingSubmissions(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchChallenge = async () => {
      if (!slug) {
        router.push("/challenges/coding");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await challengesService.getChallengeBySlug(slug);
        if (response.success) {
          setChallenge(response.data);
          const coding = response.data.challengeable as CodingChallenge;
          
          const firstLang = coding.programming_languages[0];
          let initialCode = "";
          if (firstLang) {
            const savedCode = await AsyncStorage.getItem(
              getStorageKey(slug, firstLang.id)
            );
            initialCode = savedCode || firstLang.starter_code || "";
          }
          setEditorValue(initialCode);
        } else {
          setError("Failed to load challenge data.");
        }
      } catch (err) {
        setError("Failed to load challenge. Please try again.");
        console.error("Error fetching challenge:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenge();
  }, [slug]);

  // Auto-save code
  useEffect(() => {
    if (!slug || !codingChallenge) return;

    const languageId =
      codingChallenge.programming_languages[selectedLanguageIndex]?.id;
    if (!languageId) return;

    const timer = setTimeout(() => {
      AsyncStorage.setItem(getStorageKey(slug, languageId), editorValue);
    }, 1000);

    return () => clearTimeout(timer);
  }, [editorValue, slug, selectedLanguageIndex, codingChallenge]);

  // Fetch submissions when switching to submissions tab
  useEffect(() => {
    if (activeTab === "submissions" && submissions.length === 0) {
      fetchSubmissions();
    }
  }, [activeTab]);

  const handleLanguageChange = async (index: number) => {
    // Prevent selecting the same language
    if (index === selectedLanguageIndex) return;

    if (codingChallenge?.programming_languages[index]) {
      // Save current code
      const currentLang =
        codingChallenge.programming_languages[selectedLanguageIndex];
      if (currentLang && slug) {
        await AsyncStorage.setItem(
          getStorageKey(slug, currentLang.id),
          editorValue
        );
      }

      const newLang = codingChallenge.programming_languages[index];
      const savedCode = await AsyncStorage.getItem(
        getStorageKey(slug!, newLang.id)
      );

      setSelectedLanguageIndex(index);
      setEditorValue(savedCode || newLang.starter_code || "");
    }
  };

  const handleExecuteCode = async () => {
    if (!challenge || !codingChallenge) return;

    setOutput("Running test cases...");
    setIsRunning(true);
    setShowConsole(true);
    setTestResults(null);

    try {
      const languageId =
        codingChallenge.programming_languages[selectedLanguageIndex].id;

      const response = await challengesService.executeChallenge(
        challenge.slug,
        languageId,
        editorValue
      );

      if (response.success) {
        setTestResults(response.data);
        setOutput("");
      } else {
        setOutput("Failed to execute code. Please try again.");
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to execute code. Please try again.";
      setOutput(`Error: ${errorMsg}`);
      setTestResults(null);
      console.error("Error executing code:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!challenge || !codingChallenge) return;

    setIsSubmitting(true);

    try {
      const languageId =
        codingChallenge.programming_languages[selectedLanguageIndex].id;

      const response = await challengesService.submitChallenge(
        challenge.slug,
        languageId,
        editorValue
      );

      if (response.success) {
        // Refresh submissions list
        await fetchSubmissions();
        setActiveTab("submissions");
      } else {
        setOutput("Submission failed. Please try again.");
        setShowConsole(true);
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Submission failed. Please try again.";
      setOutput(`Error: ${errorMsg}`);
      setShowConsole(true);
      console.error("Error submitting code:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRefreshSubmissions = () => {
    setRefreshing(true);
    fetchSubmissions();
  };

  const formatTime = (time: string | number) => {
    const numTime = typeof time === "string" ? parseFloat(time) : time;
    if (numTime < 1) {
      return `${(numTime * 1000).toFixed(2)} ms`;
    }
    return `${numTime.toFixed(3)} s`;
  };

  const formatMemory = (memory: number) => {
    if (memory < 1024) {
      return `${memory} KB`;
    }
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatTestCaseValue = (value: any): string => {
    if (typeof value === "string") {
      return value;
    }
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }
    if (typeof value === "object" && value !== null) {
      return Object.entries(value)
        .map(([key, val]) => `${key} = ${JSON.stringify(val)}`)
        .join("\n");
    }
    return String(value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins} min${diffInMins > 1 ? "s" : ""} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-gray-400 mt-4">Loading challenge...</Text>
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

  if (!challenge) return null;

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
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
              {challenge.title}
            </Text>
          </View>
          <View className="flex-row items-center gap-2 ml-2">
            <View
              className={`px-2 py-1 rounded-full ${
                challenge.difficulty.name === "Beginner"
                  ? "bg-green-500/20"
                  : challenge.difficulty.name === "Intermediate"
                    ? "bg-yellow-500/20"
                    : "bg-red-500/20"
              }`}
            >
              <Text
                className={`text-xs font-medium ${
                  challenge.difficulty.name === "Beginner"
                    ? "text-green-400"
                    : challenge.difficulty.name === "Intermediate"
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {challenge.difficulty.name}
              </Text>
            </View>
            <View className="bg-orange-500/20 px-2 py-1 rounded-full flex-row items-center gap-1">
              <AntDesign name="fire" size={12} color="#F59E0B" />
              <Text className="text-orange-400 text-xs font-medium">
                {challenge.points}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Switcher */}
      <View className="border-b border-gray-800">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setActiveTab("problem")}
            className={`flex-1 py-3 border-b-2 ${
              activeTab === "problem"
                ? "border-green-500 bg-green-500/10"
                : "border-transparent"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "problem" ? "text-green-400" : "text-gray-400"
              }`}
            >
              Problem
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("submissions")}
            className={`flex-1 py-3 border-b-2 ${
              activeTab === "submissions"
                ? "border-green-500 bg-green-500/10"
                : "border-transparent"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "submissions" ? "text-green-400" : "text-gray-400"
              }`}
            >
              Submissions
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
        {activeTab === "problem" ? (
          <ScrollView className="flex-1 bg-black">
            <View className="p-6">
              <View className="mb-3">
                <Text className="text-white text-xl mb-2 font-bold">{challenge.title}</Text>
              </View>
              <View className="mb-6">
                <Text className="text-lg font-semibold text-white mb-3">
                  Description
                </Text>
                <Text className="text-gray-300 leading-6">
                  {challenge.description}
                </Text>
              </View>

              {/* Problem Statement */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-white mb-3">
                  Problem Statement
                </Text>
                <Markdown style={markdownStyles}>
                  {codingChallenge?.problem_statement || ""}
                </Markdown>
              </View>

              {/* Test Cases */}
              {codingChallenge?.test_cases && (
                <View className="mb-6">
                  <Text className="text-lg font-semibold text-white mb-3">
                    Sample Test Cases
                  </Text>
                  {codingChallenge.test_cases.map((testCase, index) => (
                    <View
                      key={index}
                      className="bg-gray-900/60 border border-gray-700/50 rounded-lg p-4 mb-3"
                    >
                      <Text className="text-green-400 font-semibold mb-2">
                        Test Case {index + 1}
                      </Text>
                      <View className="gap-y-2">
                        <View>
                          <Text className="text-gray-400 text-sm mb-1">
                            Input:
                          </Text>
                          <View className="bg-black/40 rounded px-3 py-2">
                            <Text className="text-gray-300 font-mono text-sm">
                              {formatTestCaseValue(testCase.input)}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Text className="text-gray-400 text-sm mb-1">
                            Expected Output:
                          </Text>
                          <View className="bg-black/40 rounded px-3 py-2">
                            <Text className="text-gray-300 font-mono text-sm">
                              {formatTestCaseValue(testCase.expected_output)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Hints */}
              {challenge.hints && (
                <View className="mb-6">
                  <Text className="text-lg font-semibold text-white mb-3">
                    Hints
                  </Text>
                  <View className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <View className="flex-row items-start gap-2">
                      <Ionicons name="bulb" size={20} color="#3B82F6" />
                      <Text className="text-blue-300 flex-1">
                        {challenge.hints}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Available Languages */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-white mb-3">
                  Available Languages
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {codingChallenge?.programming_languages.map(
                    (lang, index) => (
                      <View
                        key={lang.id}
                        className="bg-gray-800/50 border border-gray-600/50 rounded-lg px-3 py-2"
                      >
                        <Text className="text-gray-300 text-sm">
                          {lang.name}
                        </Text>
                        <Text className="text-gray-500 text-xs">
                          {lang.version}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            </View>
          </ScrollView>
        ) : activeTab === "code" ? (
          <View className="flex-1 bg-black">
            {/* Language Selector */}
            {codingChallenge && codingChallenge.programming_languages.length > 0 && (
              <View className="border-b border-gray-800 px-4 py-3 bg-gray-900/40">
                <Text className="text-gray-400 text-xs mb-2">
                  Select Language:
                </Text>
                <View className="border-b border-gray-600/50 bg-transparent">
                  <Picker
                    selectedValue={selectedLanguageIndex}
                    onValueChange={(itemValue) => {
                      if (itemValue !== selectedLanguageIndex) {
                        handleLanguageChange(itemValue);
                      }
                    }}
                    style={{
                      color: "#FFFFFF",
                      backgroundColor: "transparent",
                    }}
                    dropdownIconColor="#10B981"
                    enabled={
                      codingChallenge.programming_languages.length > 0
                    }
                  >
                    {codingChallenge.programming_languages.map(
                      (lang, index) => (
                        <Picker.Item
                          key={lang.id}
                          label={`${lang.name} ${lang.version}`}
                          value={index}
                        />
                      )
                    )}
                  </Picker>
                </View>
              </View>
            )}

            <View className="flex-1">
              <MonacoEditor
                value={editorValue}
                onChange={setEditorValue}
                language={
                  codingChallenge?.programming_languages[
                    selectedLanguageIndex
                  ]?.name.toLowerCase() as any
                }
              />
            </View>

            {/* Console */}
            {showConsole && (
              <View className="h-64 border-t border-gray-800">
                {testResults ? (
                  <TestCaseResults
                    results={testResults}
                    isRunning={isRunning}
                  />
                ) : (
                  <ConsoleOutput output={output} isRunning={isRunning} />
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
                    {showConsole ? "Hide" : "Show"} Console
                  </Text>
                </SecondaryOutlineButton>
                <SecondaryOutlineButton
                  onPress={handleExecuteCode}
                  disabled={isRunning}
                  className="flex-1"
                >
                  <Ionicons name="play" size={16} color="#9CA3AF" />
                  <Text className="text-gray-400 ml-2">Run Tests</Text>
                </SecondaryOutlineButton>
              </View>
              <PrimaryButton
                onPress={handleSubmitCode}
                disabled={isSubmitting || isRunning}
                loading={isSubmitting}
                className="w-full"
              >
                <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
                <Text className="text-white ml-2 font-semibold">
                  Submit Solution
                </Text>
              </PrimaryButton>
            </View>
          </View>
        ) : selectedSubmission ? (
          <ScrollView className="flex-1 bg-black">
            <View className="p-6">
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => setSelectedSubmission(null)}
                className="flex-row items-center gap-2 mb-4"
              >
                <Ionicons name="arrow-back" size={20} color="#10B981" />
                <Text className="text-green-400 font-medium">
                  Back to Submissions
                </Text>
              </TouchableOpacity>

              {/* Status Banner */}
              <View
                className={`rounded-lg p-4 mb-6 border-2 ${
                  selectedSubmission.is_correct
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <View className="flex-row items-center gap-3 mb-3">
                  <Ionicons
                    name={
                      selectedSubmission.is_correct
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={32}
                    color={selectedSubmission.is_correct ? "#10B981" : "#EF4444"}
                  />
                  <View className="flex-1">
                    <Text
                      className={`text-lg font-bold ${
                        selectedSubmission.is_correct
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {selectedSubmission.is_correct ? "Success!" : "Failed"}
                    </Text>
                    <Text className="text-gray-300 text-sm">
                      {selectedSubmission.results.passed_cases} /{" "}
                      {selectedSubmission.results.total_cases} test cases passed
                    </Text>
                  </View>
                </View>
                {selectedSubmission.is_correct && (
                  <View className="flex-row items-center gap-2 bg-yellow-500/20 px-3 py-2 rounded-lg">
                    <AntDesign name="fire" size={16} color="#F59E0B" />
                    <Text className="text-yellow-400 font-medium">
                      +{challenge.points} XP Earned!
                    </Text>
                  </View>
                )}
              </View>

              {/* Submission Date */}
              <View className="mb-6">
                <Text className="text-gray-400 text-sm">
                  Submitted {formatDate(selectedSubmission.created_at)}
                </Text>
              </View>

              {/* Test Cases Results */}
              {selectedSubmission.results.results && (
                <View className="mb-6">
                  <Text className="text-white font-semibold text-base mb-3">
                    Test Cases
                  </Text>
                  {selectedSubmission.results.results.map((result, index) => (
                    <View
                      key={index}
                      className={`rounded-lg p-4 mb-3 border ${
                        result.passed
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-red-500/10 border-red-500/30"
                      }`}
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <Text
                          className={`font-semibold ${
                            result.passed ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          Test Case {index + 1}
                        </Text>
                        <Ionicons
                          name={result.passed ? "checkmark-circle" : "close-circle"}
                          size={20}
                          color={result.passed ? "#10B981" : "#EF4444"}
                        />
                      </View>
                      <View className="gap-y-2">
                        <View>
                          <Text className="text-gray-400 text-xs mb-1">Input:</Text>
                          <View className="bg-black/40 rounded px-3 py-2">
                            <Text className="text-gray-300 font-mono text-xs">
                              {formatTestCaseValue(result.input)}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Text className="text-gray-400 text-xs mb-1">
                            Expected Output:
                          </Text>
                          <View className="bg-black/40 rounded px-3 py-2">
                            <Text className="text-gray-300 font-mono text-xs">
                              {formatTestCaseValue(result.expected_output)}
                            </Text>
                          </View>
                        </View>
                        <View>
                          <Text className="text-gray-400 text-xs mb-1">
                            Your Output:
                          </Text>
                          <View className="bg-black/40 rounded px-3 py-2">
                            <Text className="text-gray-300 font-mono text-xs">
                              {formatTestCaseValue(result.actual_output)}
                            </Text>
                          </View>
                        </View>
                        <View className="flex-row gap-x-4">
                          <View className="flex-1">
                            <Text className="text-gray-400 text-xs">Time:</Text>
                            <Text className="text-gray-300 text-xs font-mono">
                              {formatTime(result.execution_time)}
                            </Text>
                          </View>
                          <View className="flex-1">
                            <Text className="text-gray-400 text-xs">Memory:</Text>
                            <Text className="text-gray-300 text-xs font-mono">
                              {formatMemory(result.memory_usage)}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Source Code */}
              <View className="mb-6">
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-white font-semibold text-base">
                    Submitted Code
                  </Text>
                  <TouchableOpacity
                    onPress={async () => {
                      await Clipboard.setStringAsync(
                        selectedSubmission.submission_content
                      );
                      Toast.show({
                        type: "success",
                        text1: "Copied to clipboard",
                        position: "bottom",
                      });
                    }}
                    className="flex-row items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-md"
                  >
                    <Ionicons name="copy-outline" size={16} color="#9CA3AF" />
                    <Text className="text-gray-400 text-xs font-medium">
                      Copy
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="bg-[#1e1e1e] border border-gray-700/50 rounded-lg p-4">
                  <ScrollView horizontal>
                    <Text className="text-gray-300 font-mono text-xs">
                      {selectedSubmission.submission_content}
                    </Text>
                  </ScrollView>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="gap-y-3">
                <PrimaryButton onPress={() => setActiveTab("code")}>
                  <Text className="text-white font-semibold">Try Again</Text>
                </PrimaryButton>
              </View>
            </View>
          </ScrollView>
        ) : (
          <ScrollView
            className="flex-1 bg-black"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefreshSubmissions}
                tintColor="#10B981"
                colors={["#10B981"]}
              />
            }
          >
            <View className="p-6">
              {loadingSubmissions && submissions.length === 0 ? (
                <View className="flex-1 items-center justify-center py-20">
                  <ActivityIndicator size="large" color="#10B981" />
                  <Text className="text-gray-400 mt-4">Loading submissions...</Text>
                </View>
              ) : submissions.length > 0 ? (
                <>
                  <View className="mb-4">
                    <Text className="text-white font-semibold text-lg">
                      Your Submissions
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
                    </Text>
                  </View>

                  {submissions.map((submission, index) => (
                    <TouchableOpacity
                      key={submission.id}
                      onPress={() => setSelectedSubmission(submission)}
                      className={`rounded-lg p-4 mb-3 border ${
                        submission.is_correct
                          ? "bg-green-500/10 border-green-500/30"
                          : "bg-red-500/10 border-red-500/30"
                      }`}
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center gap-2">
                          <Ionicons
                            name={
                              submission.is_correct
                                ? "checkmark-circle"
                                : "close-circle"
                            }
                            size={24}
                            color={submission.is_correct ? "#10B981" : "#EF4444"}
                          />
                          <View>
                            <Text
                              className={`font-semibold ${
                                submission.is_correct
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              Submission #{submissions.length - index}
                            </Text>
                            <Text className="text-gray-400 text-xs">
                              {submission.results.passed_cases}/{submission.results.total_cases} test cases passed
                            </Text>
                          </View>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color="#9CA3AF"
                        />
                      </View>
                      <Text className="text-gray-400 text-xs">
                        {formatDate(submission.created_at)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </>
              ) : (
                <View className="flex-1 items-center justify-center py-20">
                  <View className="w-16 h-16 bg-gray-800/50 rounded-full items-center justify-center mb-4">
                    <Ionicons name="code-slash-outline" size={32} color="#9CA3AF" />
                  </View>
                  <Text className="text-xl font-semibold text-white mb-2">
                    No Submissions Yet
                  </Text>
                  <Text className="text-gray-400 text-center mb-6 px-6">
                    Submit your solution to see the results here
                  </Text>
                  <PrimaryButton onPress={() => setActiveTab("code")}>
                    <Text className="text-white font-semibold">Go to Code Editor</Text>
                  </PrimaryButton>
                </View>
              )}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}
