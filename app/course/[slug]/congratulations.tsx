import { PrimaryButton, SecondaryOutlineButton } from "@/components/button";
import GamifiedCard from "@/components/card/GamifiedCard";
import { courseService } from "@/services/courseService";
import type {
    CourseCompletionStats,
    StudentCourse,
} from "@/types/course/student-course";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CourseCompletionScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<StudentCourse | null>(null);
  const [completionStats, setCompletionStats] =
    useState<CourseCompletionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompletionData = async () => {
      if (!slug) {
        router.push("/courses");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await courseService.getCourseCompletion(slug);
        if (response.success) {
          setCourse(response.data);
          setCompletionStats(response.completion_stats);
        } else {
          setError("Failed to fetch completion data.");
        }
      } catch (err) {
        setError("Failed to load completion data. Please try again.");
        console.error("Error fetching completion data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletionData();
  }, [slug]);

  const calculateDuration = () => {
    if (!completionStats) return 0;
    const start = new Date(completionStats.started_at);
    const end = new Date(completionStats.completed_at);
    const days = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );
    return days || 1;
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-gray-400 mt-4">
            Loading your achievement...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !course || !completionStats) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="alert-circle" size={64} color="#EF4444" />
          <Text className="text-red-400 text-lg font-semibold mt-4 text-center">
            {error || "No data found"}
          </Text>
          <PrimaryButton
            onPress={() => router.push("/courses")}
            className="mt-6"
          >
            <Text className="text-black font-semibold">Back to Courses</Text>
          </PrimaryButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Celebration Header */}
          <View className="items-center py-8 mb-6">
            <View className="flex-row items-center gap-2 mb-4">
              <Ionicons name="sparkles" size={24} color="#EAB308" />
              <Text className="text-4xl font-bold text-yellow-400">
                Congratulations!
              </Text>
              <Ionicons name="sparkles" size={24} color="#EAB308" />
            </View>

            <Text className="text-lg text-gray-300 mb-2">You've completed</Text>

            <Text className="text-2xl font-bold text-white text-center mb-4">
              {course.title}
            </Text>

            {/* Course Badges */}
            <View className="flex-row flex-wrap items-center justify-center gap-2 mb-6">
              <View className="bg-green-500/20 px-4 py-2 rounded-full">
                <Text className="text-green-400 text-sm font-medium">
                  {course.category.name}
                </Text>
              </View>
              <View className="bg-blue-500/20 px-4 py-2 rounded-full">
                <Text className="text-blue-400 text-sm font-medium">
                  {course.difficulty.name}
                </Text>
              </View>
            </View>

            {/* Trophy Icon */}
            <View className="w-24 h-24 rounded-full bg-yellow-500/20 items-center justify-center mb-4">
              <Ionicons name="trophy" size={48} color="#EAB308" />
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-y-3 pb-6">
            <PrimaryButton onPress={() => router.push("/courses")}>
              <Ionicons name="search" size={18} color="#000000" />
              <Text className="text-black ml-2 font-semibold">
                Browse More Courses
              </Text>
            </PrimaryButton>

            <SecondaryOutlineButton onPress={() => router.push("/(tabs)")}>
              <Ionicons name="home-outline" size={16} color="#9CA3AF" />
              <Text className="text-gray-400 ml-2 font-semibold">
                Go to Dashboard
              </Text>
            </SecondaryOutlineButton>
          </View>

          {/* Stats Grid */}
          <View className="gap-y-4 mb-8">
            {/* Total XP */}
            <GamifiedCard title="Total XP Earned" icon={<Ionicons name="star-outline" size={20} color="#05df72" />}>
              <View className="p-5">
                <Text className="text-3xl font-bold text-yellow-400 text-center">
                  {completionStats.total_exp_earned.toLocaleString()} XP
                </Text>
              </View>
            </GamifiedCard>

            <View className="flex-1">
              <GamifiedCard title="Lessons" icon={<Ionicons name="book-outline" size={16} color="#05df72" />}>
                <View className="p-5">
                  <Text className="text-2xl font-bold text-white text-center">
                    {completionStats.total_lessons_completed}
                  </Text>
                </View>
              </GamifiedCard>
            </View>

            <View className="flex-1">
              <GamifiedCard title="Activities" icon={<Ionicons name="code-slash" size={16} color="#05df72" />}>
                <View className="p-5">
                  <Text className="text-2xl font-bold text-white text-center">
                    {completionStats.total_activities_completed}
                  </Text>
                </View>
              </GamifiedCard>
            </View>

            {/* Days Completed */}
            <GamifiedCard title="Days Completed" icon={<Ionicons name="time-outline" size={20} color="#05df72" />}>
              <View className="p-5">
                <Text className="text-3xl font-bold text-white text-center">
                  {calculateDuration()}{" "}
                  {calculateDuration() === 1 ? "Day" : "Days"}
                </Text>
              </View>
            </GamifiedCard>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
