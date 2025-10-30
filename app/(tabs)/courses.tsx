import CourseCard from "@/components/card/CourseCard";
import { FilterModal, FilterSection } from "@/components/modal";
import { courseService } from "@/services/courseService";
import type { Course, PaginationMeta } from "@/types/course/course";
import type { CourseCategory, Difficulty } from "@/types/settings";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const durations = [
  "All",
  "5-10 hours",
  "8-12 hours",
  "10-15 hours",
  "15-20 hours",
  "20+ hours",
];

const durationRanges = {
  All: null,
  "5-10 hours": { min: 5, max: 10 },
  "8-12 hours": { min: 8, max: 12 },
  "10-15 hours": { min: 10, max: 15 },
  "15-20 hours": { min: 15, max: 20 },
  "20+ hours": { min: 20, max: null },
};

const CoursesScreen = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [categories, setCategories] = useState<CourseCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<number[]>(
    []
  );
  const [selectedDurations, setSelectedDurations] = useState<string[]>(["All"]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await courseService.getCourses({
        page: currentPage,
        search: searchTerm,
        category_ids: selectedCategories,
        difficulty_ids: selectedDifficulties,
      });

      if (response.success) {
        let filteredCourses = response.data;

        // Apply duration filter
        if (
          selectedDurations.length > 0 &&
          !selectedDurations.includes("All")
        ) {
          filteredCourses = filteredCourses.filter((course) => {
            return selectedDurations.some((duration) => {
              const range =
                durationRanges[duration as keyof typeof durationRanges];
              if (!range) return true;

              const courseDuration = course.estimated_duration;
              if (range.max === null) {
                return courseDuration >= range.min;
              }
              return courseDuration >= range.min && courseDuration <= range.max;
            });
          });
        }

        setCourses(filteredCourses);
        setPaginationMeta(response.meta);
      } else {
        setError("Failed to fetch courses.");
        setCourses([]);
        setPaginationMeta(null);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error("Error fetching courses:", err);
      setCourses([]);
      setPaginationMeta(null);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    searchTerm,
    selectedCategories,
    selectedDifficulties,
    selectedDurations,
  ]);

  const fetchData = async () => {
    try {
      const [difficultiesResponse, categoriesResponse] = await Promise.all([
        courseService.getDifficulties(),
        courseService.getCategories(),
      ]);

      if (difficultiesResponse.success) {
        setDifficulties(difficultiesResponse.data);
      }
      if (categoriesResponse.success) {
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [selectedCategories, selectedDifficulties, selectedDurations]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  }, [fetchCourses]);

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleDifficulty = (difficultyId: number) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficultyId)
        ? prev.filter((id) => id !== difficultyId)
        : [...prev, difficultyId]
    );
  };

  const toggleDuration = (duration: string) => {
    setSelectedDurations((prev) => {
      if (duration === "All") {
        return ["All"];
      }

      const newDurations = prev.filter((d) => d !== "All");
      const isSelected = newDurations.includes(duration);

      if (isSelected) {
        const filtered = newDurations.filter((d) => d !== duration);
        return filtered.length === 0 ? ["All"] : filtered;
      } else {
        return [...newDurations, duration];
      }
    });
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setSelectedDurations(["All"]);
    setCurrentPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm.trim() !== "" ||
      selectedCategories.length > 0 ||
      selectedDifficulties.length > 0 ||
      (selectedDurations.length > 0 && !selectedDurations.includes("All"))
    );
  }, [searchTerm, selectedCategories, selectedDifficulties, selectedDurations]);

  const handleViewCourse = (slug: string) => {
    router.push(`/course/${slug}` as any);
  };

  return (
    <>
      <ScrollView
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
          <Text className="text-2xl font-bold text-white mb-1">
            Course Catalog
          </Text>
          <Text className="text-gray-400 text-sm">
            Discover and master new skills
          </Text>
        </View>

        {/* Search Bar */}
        <View className="px-4 py-3 border-b border-gray-800/50">
          <View className="flex-row items-center bg-gray-900/60 border border-gray-700/50 rounded-lg px-3 py-2">
            <Ionicons name="search-outline" size={20} color="#9CA3AF" />
            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="Search courses..."
              placeholderTextColor="#6B7280"
              className="flex-1 ml-2 text-white"
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm("")}>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Button */}
          <TouchableOpacity
            onPress={() => setFiltersOpen(true)}
            className="flex-row items-center justify-center mt-3 py-2 px-4 bg-gray-800/50 border border-gray-600/50 rounded-lg"
          >
            <Ionicons name="filter-outline" size={18} color="#10B981" />
            <Text className="text-white ml-2 font-medium">Filters</Text>
            {hasActiveFilters && (
              <View className="ml-2 w-2 h-2 bg-green-400 rounded-full" />
            )}
          </TouchableOpacity>
        </View>

        {/* Course Count */}
        <View className="px-4 py-3 flex-row items-center justify-between">
          <Text className="text-gray-300">
            <Text className="font-semibold text-white">
              {paginationMeta?.total || courses.length}
            </Text>{" "}
            courses found
          </Text>
          {hasActiveFilters && (
            <TouchableOpacity onPress={clearAllFilters}>
              <Text className="text-sm text-red-400 underline">Clear all</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}

        <View className="flex-1 px-4">
          {loading && !refreshing ? (
            <View className="py-20 items-center">
              <ActivityIndicator size="large" color="#10B981" />
              <Text className="text-gray-400 mt-4">Loading courses...</Text>
            </View>
          ) : error ? (
            <View className="py-20 items-center px-4">
              <View className="w-16 h-16 bg-red-500/10 rounded-full items-center justify-center mb-4">
                <Ionicons
                  name="alert-circle-outline"
                  size={32}
                  color="#EF4444"
                />
              </View>
              <Text className="text-xl font-semibold text-white mb-2">
                Error Loading Courses
              </Text>
              <Text className="text-gray-400 text-center mb-6">{error}</Text>
              <TouchableOpacity
                onPress={fetchCourses}
                className="px-6 py-3 bg-green-600 rounded-lg"
              >
                <Text className="text-white font-semibold">Try Again</Text>
              </TouchableOpacity>
            </View>
          ) : courses.length > 0 ? (
            <View className="pb-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onPress={() => handleViewCourse(course.slug)}
                />
              ))}
            </View>
          ) : (
            <View className="py-20 items-center px-4">
              <View className="w-16 h-16 bg-gray-800/50 rounded-full items-center justify-center mb-4">
                <Ionicons name="search-outline" size={32} color="#9CA3AF" />
              </View>
              <Text className="text-xl font-semibold text-white mb-2">
                No courses found
              </Text>
              <Text className="text-gray-400 text-center mb-6">
                Try adjusting your search criteria or filters
              </Text>
              {hasActiveFilters && (
                <TouchableOpacity
                  onPress={clearAllFilters}
                  className="px-6 py-3 bg-green-600 rounded-lg"
                >
                  <Text className="text-white font-semibold">
                    Clear All Filters
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <FilterModal
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        loading={loadingData}
        onClearAll={clearAllFilters}
        clearAllDisabled={!hasActiveFilters}
        clearAllText="Clear All"
      >
        <FilterSection
          title="Category"
          options={categories.map((cat) => ({ id: cat.id, name: cat.name }))}
          selectedValues={selectedCategories}
          onToggle={(id) => toggleCategory(id as number)}
        />

        <FilterSection
          title="Difficulty Level"
          options={difficulties.map((diff) => ({
            id: diff.id,
            name: diff.name,
          }))}
          selectedValues={selectedDifficulties}
          onToggle={(id) => toggleDifficulty(id as number)}
        />

        <FilterSection
          title="Duration"
          options={durations.map((dur) => ({ id: dur, name: dur }))}
          selectedValues={selectedDurations}
          onToggle={(id) => toggleDuration(id as string)}
        />
      </FilterModal>
    </>
  );
};

export default CoursesScreen;
