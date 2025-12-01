import CtfChallengeCard from "@/components/card/CtfChallengeCard";
import { FilterModal, FilterSection } from "@/components/modal";
import CtfChallengeModal from "@/components/modal/CtfChallengeModal";
import { challengesService } from "@/services/challengesService";
import type {
    Challenge,
    CtfCategory,
    PaginationMeta,
} from "@/types/challenges";
import type { Difficulty } from "@/types/settings";
import { Feather, Ionicons } from "@expo/vector-icons";
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
import { SafeAreaView } from "react-native-safe-area-context";

const CTFChallenges = () => {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);
  const [categories, setCategories] = useState<CtfCategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<number[]>(
    []
  );
  const [hideSolved, setHideSolved] = useState(false);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );

  const fetchChallenges = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await challengesService.getCtfChallenges({
        page: currentPage,
        search: searchTerm,
        difficulty_ids: selectedDifficulties,
        category_ids: selectedCategories,
        hide_solved: hideSolved,
      });

      if (response.success) {
        setChallenges(response.data);
        setPaginationMeta(response.meta);
      } else {
        setError("Failed to fetch challenges.");
        setChallenges([]);
        setPaginationMeta(null);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error("Error fetching challenges:", err);
      setChallenges([]);
      setPaginationMeta(null);
    } finally {
      setLoading(false);
    }
  }, [
    currentPage,
    searchTerm,
    selectedDifficulties,
    selectedCategories,
    hideSolved,
  ]);

  const fetchData = async () => {
    try {
      const [difficultiesResponse, categoriesResponse] = await Promise.all([
        challengesService.getDifficulties(),
        challengesService.getCtfCategories(),
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
    fetchChallenges();
  }, [fetchChallenges]);

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
  }, [selectedCategories, selectedDifficulties, hideSolved]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchChallenges();
    setRefreshing(false);
  }, [fetchChallenges]);

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

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedDifficulties([]);
    setHideSolved(false);
    setCurrentPage(1);
  };

  const hasActiveFilters = useMemo(() => {
    return (
      searchTerm.trim() !== "" ||
      selectedCategories.length > 0 ||
      selectedDifficulties.length > 0 ||
      hideSolved
    );
  }, [searchTerm, selectedCategories, selectedDifficulties, hideSolved]);

  const handleViewChallenge = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
  };

  const handleModalClose = () => {
    setSelectedChallenge(null);
  };

  const handleSuccess = () => {
    // Refresh challenges list after successful submission
    fetchChallenges();
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-black" edges={["top"]}>
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
          <View className="px-4 py-4 flex-row items-center border-b border-gray-800/50">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Feather name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-xl font-bold text-white">
                Capture The Flag
              </Text>
              <Text className="text-gray-400 text-sm">
                Find hidden flags in security challenges
              </Text>
            </View>
          </View>

          {/* Search Bar */}
          <View className="px-4 py-3 border-b border-gray-800/50">
            <View className="flex-row items-center bg-gray-900/60 border border-gray-700/50 rounded-lg px-3 py-2">
              <Ionicons name="search-outline" size={20} color="#9CA3AF" />
              <TextInput
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Search challenges..."
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

          {/* Challenge Count & Hide Solved */}
          <View className="px-4 py-3 flex-row items-center justify-between">
            <Text className="text-gray-300">
              <Text className="font-semibold text-white">
                {paginationMeta?.total || challenges.length}
              </Text>{" "}
              challenges found
            </Text>
            <TouchableOpacity
              onPress={() => setHideSolved(!hideSolved)}
              className="flex-row items-center gap-x-2"
            >
              <View
                className={`w-5 h-5 rounded border-2 items-center justify-center ${
                  hideSolved
                    ? "bg-green-500 border-green-500"
                    : "border-gray-600"
                }`}
              >
                {hideSolved && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
              <Text className="text-gray-300 text-sm">Hide Solved</Text>
            </TouchableOpacity>
          </View>

          {hasActiveFilters && (
            <View className="px-4 pb-3">
              <TouchableOpacity onPress={clearAllFilters}>
                <Text className="text-sm text-red-400 underline">
                  Clear all filters
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Content */}
          <View className="flex-1 px-4">
            {loading && !refreshing ? (
              <View className="py-20 items-center">
                <ActivityIndicator size="large" color="#10B981" />
                <Text className="text-gray-400 mt-4">
                  Loading challenges...
                </Text>
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
                  Error Loading Challenges
                </Text>
                <Text className="text-gray-400 text-center mb-6">{error}</Text>
                <TouchableOpacity
                  onPress={fetchChallenges}
                  className="px-6 py-3 bg-green-600 rounded-lg"
                >
                  <Text className="text-white font-semibold">Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : challenges.length > 0 ? (
              <View className="pb-6">
                {challenges.map((challenge) => (
                  <CtfChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onPress={() => handleViewChallenge(challenge)}
                  />
                ))}
              </View>
            ) : (
              <View className="py-20 items-center px-4">
                <View className="w-16 h-16 bg-gray-800/50 rounded-full items-center justify-center mb-4">
                  <Ionicons name="search-outline" size={32} color="#9CA3AF" />
                </View>
                <Text className="text-xl font-semibold text-white mb-2">
                  No challenges found
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
      </SafeAreaView>

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
          title="Categories"
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
      </FilterModal>

      <CtfChallengeModal
        challenge={selectedChallenge}
        visible={!!selectedChallenge}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default CTFChallenges;
