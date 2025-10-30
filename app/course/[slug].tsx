import { Ionicons } from "@expo/vector-icons";
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
import GamifiedCard from "../../components/card/GamifiedCard";
import CourseThumbnail from "../../components/CourseThumbnail";
import ProgressBar from "../../components/ProgressBar";
import { courseService } from "../../services/courseService";
import { markdownStyles } from "../../styles/markdownStyles";
import type {
  CourseStatistics,
  CurrentActiveContent,
  ModuleWithContent,
  StudentCourse,
} from "../../types/course/student-course";

const CourseViewScreen = () => {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<StudentCourse | null>(null);
  const [stats, setStats] = useState<CourseStatistics | null>(null);
  const [contentByModules, setContentByModules] = useState<ModuleWithContent[]>(
    []
  );
  const [currentActiveContent, setCurrentActiveContent] =
    useState<CurrentActiveContent | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set([1])
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourse = async () => {
    if (!slug) {
      router.back();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await courseService.getCourseBySlug(slug);
      if (response.success) {
        setCourse(response.data);
        setStats(response.statistics || null);
        setContentByModules(response.content_by_modules || []);
        setCurrentActiveContent(response.current_active_content || null);
      } else {
        setError("Failed to fetch course details.");
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Course not found.");
      } else {
        setError("Failed to load course data. Please try again.");
      }
      console.error("Error fetching course:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCourse();
    setRefreshing(false);
  };

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return "newspaper-outline";
      case "code":
        return "code-slash-outline";
      case "quiz":
        return "help-circle-outline";
      default:
        return "book-outline";
    }
  };

  const handleViewContent = (
    moduleSlug: string,
    contentSlug: string | undefined,
    type: string
  ) => {
    console.log("Navigate to:", type, moduleSlug, contentSlug);
    switch (type) {
      case "lesson":
        router.push(`/lesson/${slug}/${moduleSlug}/${contentSlug}` as any);
        break;
      case "code":
        router.push(`/exercise/${slug}/${moduleSlug}/${contentSlug}` as any);
        break;
      case "quiz":
        router.push(`/quiz/${slug}/${moduleSlug}/${contentSlug}` as any);
        break;
    }
  };

  const handleViewCurrentActiveContent = () => {
    if (!currentActiveContent) return;
    handleViewContent(
      currentActiveContent.module.slug,
      currentActiveContent.slug,
      currentActiveContent.type
    );
  };

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center px-4">
          <View className="w-16 h-16 bg-red-500/10 rounded-full items-center justify-center mb-4">
            <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
          </View>
          <Text className="text-xl font-semibold text-white mb-2 text-center">
            {error}
          </Text>
          <TouchableOpacity
            onPress={fetchCourse}
            className="px-6 py-3 bg-green-600 rounded-lg mt-4"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.back()} className="mt-3">
            <Text className="text-gray-400 underline">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-800/50 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-white">Course Details</Text>
      </View>

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
        {loading && !refreshing ? (
          <View className="py-20 items-center">
            <ActivityIndicator size="large" color="#10B981" />
            <Text className="text-gray-400 mt-4">Loading course...</Text>
          </View>
        ) : (
          <View className="px-4 py-4">
            {/* Course Thumbnail */}
            {course?.thumbnail && (
              <CourseThumbnail
                title={currentActiveContent?.title || ""}
                thumbnail={course?.thumbnail}
                onClick={handleViewCurrentActiveContent}
              />
            )}

            {/* Category & Difficulty */}
            <View className="flex-row items-center mb-3">
              <View className="bg-green-500/20 px-3 py-1 rounded">
                <Text className="text-green-400 text-xs font-semibold">
                  {course?.category.name}
                </Text>
              </View>
              <Text className="text-gray-400 mx-2">•</Text>
              <Text className="text-gray-400 text-sm">
                {course?.difficulty.name}
              </Text>
            </View>

            {/* Title */}
            <Text className="text-2xl font-bold text-white mb-3">
              {course?.title}
            </Text>

            {/* Description */}
            <Markdown style={markdownStyles}>
              {course?.description || ""}
            </Markdown>

            {/* Stats */}
            <View className="flex-row flex-wrap gap-4 mb-4">
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                <Text className="text-gray-400 text-sm ml-1">
                  {course?.estimated_duration || 0}h
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="book-outline" size={16} color="#9CA3AF" />
                <Text className="text-gray-400 text-sm ml-1">
                  {stats?.total_lessons || 0} lessons
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="people-outline" size={16} color="#9CA3AF" />
                <Text className="text-gray-400 text-sm ml-1">
                  {course?.enrolled_users_count || 0} students
                </Text>
              </View>
            </View>

            {/* Progress Bar */}
            {stats?.progress_percentage !== undefined &&
              stats.progress_percentage > 0 && (
                <View className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-4 mb-4">
                  <ProgressBar
                    progress={stats.progress_percentage}
                    color="purple"
                    height="h-3"
                  />
                  <Text className="text-xs text-gray-400 mt-2">
                    {stats.progress_percentage}% complete
                  </Text>
                </View>
              )}

            {/* Objectives */}
            <View className="mb-6">
              <Text className="text-xl font-bold text-white mb-3">
                Objectives
              </Text>
              <Markdown style={markdownStyles}>
                {course?.objectives || ""}
              </Markdown>
            </View>

            {/* Skills */}
            {course?.skill_tags && course.skill_tags.length > 0 && (
              <View className="mb-6">
                <Text className="text-xl font-bold text-white mb-3">
                  Skills you'll gain
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {course.skill_tags.map((skill) => (
                    <View
                      key={skill.id}
                      className="bg-gray-800/50 border border-gray-700/50 px-3 py-1.5 rounded-full"
                    >
                      <Text className="text-gray-300 text-sm">
                        {skill.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Requirements */}
            {course?.requirements && (
              <View className="mb-6">
                <Text className="text-xl font-bold text-white mb-3">
                  Requirements
                </Text>
                <Markdown style={markdownStyles}>
                  {course.requirements}
                </Markdown>
              </View>
            )}

            {/* Course Curriculum */}
            {contentByModules.length > 0 && (
              <View className="mb-6">
                <Text className="text-xl font-bold text-white mb-4">
                  Course Curriculum
                </Text>
                {contentByModules.map((module) => (
                  <View key={module.id} className="mb-3">
                    <GamifiedCard
                      title={module.title}
                      className="overflow-hidden"
                    >
                      <TouchableOpacity
                        onPress={() => toggleModule(module.id)}
                        className="flex-row items-center justify-between mb-2"
                        activeOpacity={0.7}
                      >
                        <Text className="text-sm text-gray-400">
                          {module.title}
                        </Text>
                        <View className="flex-row items-center gap-x-2">
                          <Text className="text-sm text-gray-400">
                            {
                              module.content.filter(
                                (item) => item.type === "lesson"
                              ).length
                            }{" "}
                            lessons
                          </Text>
                          <Ionicons
                            name={
                              expandedModules.has(module.id)
                                ? "chevron-down"
                                : "chevron-forward"
                            }
                            size={20}
                            color="#9CA3AF"
                          />
                        </View>
                      </TouchableOpacity>

                      {expandedModules.has(module.id) && (
                        <View className="gap-y-2 mt-2">
                          {module.content.map((content, index) => (
                            <TouchableOpacity
                              key={index}
                              onPress={() =>
                                handleViewContent(
                                  module.slug,
                                  content?.slug || content?.id,
                                  content.activity_type?.toString() ||
                                    content.type
                                )
                              }
                              className="flex-row items-center justify-between p-3 bg-gray-800/30 active:bg-gray-800/50"
                            >
                              <View className="flex-row items-center flex-1">
                                <Ionicons
                                  name={getContentIcon(
                                    content.activity_type?.toString() ||
                                      content.type
                                  )}
                                  size={16}
                                  color="#9CA3AF"
                                />
                                <Text
                                  className={`text-sm ml-2 flex-1 ${
                                    content.is_completed
                                      ? "text-gray-500 line-through"
                                      : "text-gray-300"
                                  }`}
                                  numberOfLines={2}
                                >
                                  {content.title}
                                </Text>
                              </View>
                              {content.estimated_duration !== undefined &&
                                content.estimated_duration > 0 && (
                                  <Text className="text-xs text-gray-500 ml-2">
                                    {content.estimated_duration}min
                                  </Text>
                                )}
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </GamifiedCard>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CourseViewScreen;
