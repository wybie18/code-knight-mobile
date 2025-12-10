import { PrimaryButton, SecondaryOutlineButton } from "@/components/button";
import { ConsoleOutput, MonacoEditor } from "@/components/editor";
import {
  executeCode,
  getLessonBySlug,
  markLessonComplete,
} from "@/services/contentService";
import { markdownStyles } from "@/styles/markdownStyles";
import type { StudentLesson } from "@/types/course/lesson";
import type { NextContent, PrevContent } from "@/types/navigation/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LessonScreen() {
  const router = useRouter();
  const { course, module, slug } = useLocalSearchParams<{
    course: string;
    module: string;
    slug: string;
  }>();

  const [lesson, setLesson] = useState<StudentLesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editorValue, setEditorValue] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [showConsole, setShowConsole] = useState(false);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  const [nextUrl, setNextUrl] = useState<NextContent | null>(null);
  const [prevUrl, setPrevUrl] = useState<PrevContent | null>(null);

  const [activeTab, setActiveTab] = useState<"lesson" | "code">("lesson");
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!course || !module || !slug) {
        router.push("/courses");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await getLessonBySlug(course, module, slug);
        if (response.success) {
          setLesson(response.data);
          setEditorValue(
            response.data.course.programming_language.name === "Python"
              ? "# Write your code here\n"
              : "// Write your code here\n"
          );
          setNextUrl(response.next_content || null);
          setPrevUrl(response.prev_content || null);
        } else {
          setError("Failed to load lesson data.");
        }
      } catch (err) {
        setError("Failed to load lesson. Please try again.");
        console.error("Error fetching lesson:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLesson();
  }, [course, module, slug]);

  const markAsComplete = useCallback(async () => {
    if (isLessonComplete || isMarkingComplete || !lesson) return;

    setIsMarkingComplete(true);
    setIsLessonComplete(true);

    try {
      const response = await markLessonComplete(lesson.slug);
      if (response.success) {
        setNextUrl(response.data || null);
      }
    } catch (error) {
      console.error("Error marking lesson as complete:", error);
      setIsLessonComplete(false);
    } finally {
      setIsMarkingComplete(false);
    }
  }, [isLessonComplete, isMarkingComplete, lesson]);

  const handleScroll = useCallback(
    (event: any) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

      const distanceFromBottom =
        contentSize.height - (contentOffset.y + layoutMeasurement.height);

      if (distanceFromBottom <= 50) {
        markAsComplete();
      }
    },
    [markAsComplete]
  );

  useEffect(() => {
    if (contentHeight > 0 && scrollViewHeight > 0 && !isLessonComplete) {
      // If content fits in screen (with small buffer), mark as complete
      if (contentHeight <= scrollViewHeight + 50) {
        markAsComplete();
      }
    }
  }, [contentHeight, scrollViewHeight, isLessonComplete, markAsComplete]);

  const handleExecuteCode = async () => {
    if (!lesson) return;

    setOutput("Running...");
    setIsRunning(true);
    setShowConsole(true);

    try {
      const response = await executeCode(
        lesson.course.programming_language.id,
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
        router.push(`/course/${course}/congratulations` as any);
        break;
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-gray-400 mt-4">Loading lesson...</Text>
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

  if (!lesson) return null;

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
              {lesson.title}
            </Text>
          </View>
          <View className="flex-row items-center gap-2 ml-2">
            <View className="bg-green-500/20 px-3 py-1 rounded-full">
              <Text className="text-green-400 text-xs font-medium">
                +{lesson.exp_reward} XP
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tab Switcher (Mobile) */}
      <View className="border-b border-gray-800">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => setActiveTab("lesson")}
            className={`flex-1 py-3 border-b-2 ${
              activeTab === "lesson"
                ? "border-green-500 bg-green-500/10"
                : "border-transparent"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === "lesson" ? "text-green-400" : "text-gray-400"
              }`}
            >
              Lesson
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
        {activeTab === "lesson" ? (
          <>
            <ScrollView
              className="flex-1 bg-black"
              onScroll={handleScroll}
              scrollEventThrottle={16}
              onLayout={(e) => setScrollViewHeight(e.nativeEvent.layout.height)}
              onContentSizeChange={(_, height) => setContentHeight(height)}
            >
              <View className="p-6">
                <Markdown style={markdownStyles}>{lesson.content}</Markdown>
              </View>

              {/* Navigation */}
            </ScrollView>
            <View className="px-6 pb-6 space-y-3">
              <View className="flex-row gap-3">
                <SecondaryOutlineButton
                  onPress={handlePrevNav}
                  className="flex-1"
                  disabled={!prevUrl}
                >
                  <Ionicons name="chevron-back" size={16} color="#9CA3AF" />
                  <Text className="text-gray-400 ml-2">Previous</Text>
                </SecondaryOutlineButton>

                <PrimaryButton
                  onPress={handleNextNav}
                  className="flex-1"
                  disabled={!nextUrl}
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
                  lesson.course.programming_language.name.toLowerCase() as any
                }
              />
            </View>

            {/* Console */}
            {showConsole && (
              <View className="h-64 border-t border-gray-800">
                <ConsoleOutput output={output} isRunning={isRunning} />
              </View>
            )}

            {/* Action Buttons */}
            <View className="border-t border-gray-800 px-4 py-3 bg-black">
              <View className="flex-row gap-3">
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
                <PrimaryButton
                  onPress={handleExecuteCode}
                  disabled={isRunning}
                  loading={isRunning}
                  className="flex-1"
                >
                  <Ionicons name="play" size={16} color="#FFFFFF" />
                  <Text className="text-white ml-2">Run Code</Text>
                </PrimaryButton>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
