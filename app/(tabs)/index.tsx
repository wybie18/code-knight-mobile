import api from "@/api/AxiosConfig";
import GamifiedCard from "@/components/card/GamifiedCard";
import CodeMascot from "@/components/CodeMascot";
import { ActivityHeatmap } from "@/components/heatmap/ActivityHeatmap";
import ProgressBar from "@/components/ProgressBar";
import { getPHDate } from "@/helper/date";
import { useAuth } from "@/hooks/useAuth";
import { Achievement } from "@/types/achievement";
import { StudentCourse } from "@/types/course/student-course";
import { UserRank } from "@/types/leaderboard";
import {
  Entypo,
  Feather,
  FontAwesome5,
  FontAwesome6,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ActivityHeatmapData {
  date: string;
  count: number;
  level: number;
}

const now = new Date();

const endDate = getPHDate(now.getFullYear(), now.getMonth(), now.getDate());

const startDate = getPHDate(
  now.getFullYear() - 1,
  now.getMonth(),
  now.getDate() + 1
);

const Page = () => {
  const { user, userStats, refreshStats } = useAuth();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [loadingMyCourses, setLoadingMyCourses] = useState(true);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [loadingHeatmap, setLoadingHeatmap] = useState(true);
  const [loadingAchievements, setLoadingAchievements] = useState(true);
  const [loadingRank, setLoadingRank] = useState(true);

  const [myCourses, setMyCourses] = useState<StudentCourse[]>([]);
  const [solvedChallenges, setSolvedChallenges] = useState<any[]>([]);
  const [heatmap, setHeatmap] = useState<ActivityHeatmapData[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [rank, setRank] = useState<UserRank | null>(null);

  const fetchData = async () => {
    try {
      await refreshStats();

      // Fetch courses
      setLoadingMyCourses(true);
      const coursesRes = await api.get("/student/courses/my-progress", {
        params: { limit: 5 },
      });
      setMyCourses(coursesRes.data.data);
      setLoadingMyCourses(false);

      // Fetch challenges
      setLoadingChallenges(true);
      const challengesRes = await api.get("/challenges/solved", {
        params: { limit: 5 },
      });
      setSolvedChallenges(challengesRes.data.data);
      setLoadingChallenges(false);

      // Fetch heatmap
      setLoadingHeatmap(true);
      const heatmapRes = await api.get("/activities/heatmap");
      setHeatmap(heatmapRes.data.activities);
      setLoadingHeatmap(false);

      // Fetch achievements
      setLoadingAchievements(true);
      const achievementsRes = await api.get("/my-achievements", {
        params: { limit: 2 },
      });
      setAchievements(achievementsRes.data);
      setLoadingAchievements(false);

      // Fetch rank
      setLoadingRank(true);
      const rankRes = await api.get("/my-rank");
      setRank(rankRes.data);
      setLoadingRank(false);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleCourseClick = (slug: string) => {
    router.push(`/course/${slug}` as any);
  };

  const handleChallengeClick = (type: string, slug: string) => {
    switch (type) {
      case "CodingChallenge":
        router.push(`/challenges/coding/${slug}` as any);
        break;
      case "CtfChallenge":
        router.push(`/challenges/ctf` as any);
        break;
      default:
        break;
    }
  };

  const getBgDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Advanced":
        return "bg-red-400/20";
      case "Intermediate":
        return "bg-yellow-400/20";
      default:
        return "bg-green-400/20";
    }
  };

  const getTextDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Advanced":
        return "text-red-400";
      case "Intermediate":
        return "text-yellow-400";
      default:
        return "text-green-400";
    }
  };

  return (
    <ScrollView
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="py-6">
        <View className="mb-6 px-4">
          <Text className="text-2xl font-bold text-white mb-1">
            Welcome back, {user?.username}!
          </Text>
          <Text className="text-gray-400 text-sm">
            Ready to level up your coding skills?
          </Text>
        </View>

        {/* Mascot */}
        <View className="mb-6 px-4">
          <CodeMascot />
        </View>

        {/* Level Card */}
        <View className="mb-4 px-4">
          <GamifiedCard
            title={`Level ${userStats?.level.current_level}`}
            icon={<FontAwesome5 name="crown" size={20} color="#05df72" />}
          >
            <View className="items-center py-4">
              {userStats?.level.current_milestone && (
                <>
                  <View className="w-20 h-20 mb-3">
                    <Image
                      source={{ uri: userStats.level.current_milestone.icon }}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="text-lg font-bold text-green-100 mb-1">
                    {userStats.level.current_milestone.name}
                  </Text>
                  {userStats.level.current_milestone.description && (
                    <Text className="text-xs text-green-100/60 text-center px-2 mb-4">
                      {userStats.level.current_milestone.description}
                    </Text>
                  )}
                </>
              )}

              <Text className="text-3xl font-bold text-green-100 mb-2">
                Level {userStats?.level.current_level}
              </Text>
              <Text className="text-sm text-gray-400 mb-3">
                {userStats?.level.total_xp.toLocaleString()} /{" "}
                {userStats?.level.xp_for_next_level.toLocaleString()} XP
              </Text>

              <ProgressBar
                progress={userStats?.level.progress_percentage ?? 0}
                height="h-3"
              />

              <Text className="text-xs text-gray-500 mt-2">
                {(
                  (userStats?.level?.xp_for_next_level ?? 0) -
                  (userStats?.level?.total_xp ?? 0)
                ).toLocaleString()}{" "}
                XP to next level
              </Text>
            </View>
          </GamifiedCard>
        </View>

        {/* Quick Stats */}
        <View className="mb-4 px-4">
          <GamifiedCard
            title="Quick Stats"
            icon={<Feather name="zap" size={20} color="#05df72" />}
          >
            <View className="flex-row items-center mb-3">
              <Text className="text-white font-semibold ml-2">Quick Stats</Text>
            </View>

            <View className="space-y-2">
              <View className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg mb-2">
                <View className="flex-row items-center">
                  <FontAwesome6
                    name="graduation-cap"
                    size={16}
                    color="#60a5fa"
                  />
                  <Text className="text-sm text-white ml-2">Courses</Text>
                </View>
                <Text className="font-bold text-blue-400">
                  {userStats?.courses_completed ?? 0}
                </Text>
              </View>

              <View className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg mb-2">
                <View className="flex-row items-center">
                  <FontAwesome5 name="clock" size={16} color="#facc15" />
                  <Text className="text-sm text-white ml-2">Activities</Text>
                </View>
                <Text className="font-bold text-yellow-400">
                  {userStats?.activities_completed ?? 0}
                </Text>
              </View>

              <View className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg mb-2">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="sword-cross"
                    size={16}
                    color="#f87171"
                  />
                  <Text className="text-sm text-white ml-2">Challenges</Text>
                </View>
                <Text className="font-bold text-red-400">
                  {userStats?.challenges_completed ?? 0}
                </Text>
              </View>

              <View className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <View className="flex-row items-center">
                  <Octicons name="flame" size={16} color="#fb923c" />
                  <Text className="text-sm text-white ml-2">Streak</Text>
                </View>
                <Text className="font-bold text-orange-400">{userStats?.current_streak ?? 0} {(userStats?.current_streak ?? 0) <= 1 ? 'day' : 'days'}</Text>
              </View>
            </View>
          </GamifiedCard>
        </View>

        {/* Rank & Progress */}
        <View className="mb-4 px-4">
          <GamifiedCard
            title="Rank & Progress"
            icon={<Octicons name="trophy" size={20} color="#fb923c" />}
          >
            {loadingRank || loadingAchievements ? (
              <ActivityIndicator size="small" color="#10b981" />
            ) : (
              <View>
                <View className="items-center mb-4">
                  <Text className="text-4xl font-bold text-yellow-400 mb-2">
                    #{rank?.rank}
                  </Text>
                  <Text className="text-gray-400 text-sm mb-3">
                    Top {rank?.top_percentage}% of{" "}
                    {rank?.total_users.toLocaleString()} users
                  </Text>
                  <ProgressBar
                    progress={rank?.top_percentage ?? 0}
                    height="h-2"
                  />
                </View>

                {achievements.length > 0 && (
                  <View>
                    <Text className="text-sm font-semibold text-gray-300 mb-2">
                      Recent Achievements
                    </Text>
                    {achievements.map((achievement) => (
                      <View
                        key={achievement.id}
                        className="flex-row items-center p-2 bg-gray-800/30 rounded-lg mb-2"
                      >
                        {achievement.icon ? (
                          <Image
                            source={{ uri: achievement.icon }}
                            className="w-5 h-5 mr-2"
                            resizeMode="contain"
                          />
                        ) : (
                          <Octicons name="trophy" size={16} color="#facc15" />
                        )}
                        <Text className="text-sm text-white ml-2">
                          {achievement.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </GamifiedCard>
        </View>

        {/* Activity Heatmap */}
        <View className="mb-4 px-4">
          <GamifiedCard
            title="Activity Heatmap"
            icon={<Feather name="calendar" size={20} color="#00a6f4" />}
          >
            {loadingHeatmap ? (
              <ActivityIndicator size="small" color="#10b981" />
            ) : (
              <View>
                <ActivityHeatmap
                  startDate={startDate}
                  endDate={endDate}
                  activities={heatmap}
                  cellSize={12}
                />
                <View className="flex-row items-center justify-between mt-4">
                  <Text className="text-xs text-gray-500">
                    {heatmap.filter((d) => d.count > 0).length} active days in
                    the last year
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="text-xs text-gray-400 mr-2">Less</Text>
                    <View className="flex-row items-center gap-1">
                      <View className="w-3 h-3 bg-gray-800/30" />
                      <View className="w-3 h-3 bg-green-400/30" />
                      <View className="w-3 h-3 bg-green-400/50" />
                      <View className="w-3 h-3 bg-green-400/70" />
                      <View className="w-3 h-3 bg-green-400" />
                    </View>
                    <Text className="text-xs text-gray-400 ml-2">More</Text>
                  </View>
                </View>
              </View>
            )}
          </GamifiedCard>
        </View>

        {/* Continue Learning */}
        <View className="mb-4 px-4">
          <GamifiedCard
            title="Continue Learning"
            icon={<Entypo name="open-book" size={20} color="#00a6f4" />}
          >
            {loadingMyCourses ? (
              <ActivityIndicator size="small" color="#10b981" />
            ) : (
              <View>
                {myCourses.map((course) => (
                  <TouchableOpacity
                    key={course.id}
                    onPress={() => handleCourseClick(course.slug)}
                    className="p-4 bg-gray-800/30 rounded-lg mb-3 active:bg-gray-800/50"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="font-medium text-sm text-white flex-1">
                        {course.title}
                      </Text>
                      <FontAwesome6
                        name="chevron-right"
                        size={16}
                        color="#9ca3af"
                      />
                    </View>

                    <View className="flex-row items-center justify-between mb-2">
                      <View
                        className={`px-2 py-1 rounded ${getBgDifficultyColor(
                          course.difficulty.name
                        )}`}
                      >
                        <Text
                          className={`text-xs ${getTextDifficultyColor(course.difficulty.name)}`}
                        >
                          {course.difficulty.name}
                        </Text>
                      </View>
                      <Text className="text-xs text-gray-400">
                        {course.exp_reward} XP
                      </Text>
                    </View>

                    <ProgressBar
                      progress={course.progress?.progress_percentage ?? 0}
                    />
                    <Text className="text-xs text-gray-500 mt-1">
                      {course.progress?.progress_percentage}% complete
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </GamifiedCard>
        </View>

        {/* Challenges */}
        <View className="mb-4 px-4">
          <GamifiedCard
            title="Challenges"
            icon={
              <MaterialCommunityIcons
                name="sword-cross"
                size={20}
                color="#ff2056"
              />
            }
          >
            {loadingChallenges ? (
              <ActivityIndicator size="small" color="#10b981" />
            ) : (
              <View>
                {solvedChallenges.map((challenge) => (
                  <TouchableOpacity
                    key={challenge.id}
                    onPress={() =>
                      handleChallengeClick(challenge.type, challenge.slug)
                    }
                    className="p-4 bg-gray-800/30 rounded-lg mb-3 active:bg-gray-800/50"
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="font-medium text-sm text-white flex-1">
                        {challenge.title}
                      </Text>
                      <Feather name="star" size={16} color="#facc15" />
                    </View>

                    <View className="flex-row items-center justify-between">
                      <View
                        className={`px-2 py-1 rounded ${getBgDifficultyColor(
                          challenge.difficulty.name
                        )}`}
                      >
                        <Text
                          className={`text-xs ${getTextDifficultyColor(challenge.difficulty.name)}`}
                        >
                          {challenge.difficulty.name}
                        </Text>
                      </View>
                      <Text
                        className={`text-xs font-medium ${
                          challenge.status === "completed"
                            ? "text-green-400"
                            : challenge.status === "locked"
                              ? "text-gray-500"
                              : "text-blue-400"
                        }`}
                      >
                        {challenge.points} XP
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </GamifiedCard>
        </View>
      </View>
    </ScrollView>
  );
};

export default Page;
