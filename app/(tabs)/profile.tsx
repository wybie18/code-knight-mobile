import GamifiedCard from "@/components/card/GamifiedCard";
import UserAvatar from "@/components/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

const ProfileScreen = () => {
  const { user, userStats, refreshStats } = useAuth();
  const router = useRouter();

  useEffect(() => {
    refreshStats();
  }, []);

  if (!user) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <Text className="text-gray-400">Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView className="flex-1">
        <View className="relative">
          <View className="relative z-10 py-6">
            <View className="mb-8 px-4">
              <Text className="text-3xl font-bold mb-2 text-white">
                Profile Settings
              </Text>
              <Text className="text-gray-400">
                Manage your account information
              </Text>
            </View>

            {/* Profile Picture and Stats */}
            <View className="mb-6">
              <GamifiedCard
                title="Profile Picture"
                icon={
                  <MaterialIcons
                    name="photo-camera"
                    size={20}
                    color="#10B981"
                  />
                }
              >
                <View className="items-center gap-y-4">
                  <View className="rounded-full p-0.5 overflow-hidden">
                    <LinearGradient
                      colors={[
                        "rgba(74, 222, 128, 0.5)",
                        "rgba(59, 130, 246, 0.5)",
                      ]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ borderRadius: 9999, padding: 2 }}
                    >
                      <View className="rounded-full bg-gray-900 p-0.5">
                        <UserAvatar
                          user={user}
                          size="5xl"
                          className="ring-2 ring-transparent"
                        />
                        <View className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-gray-900 rounded-full">
                          <View className="w-full h-full bg-green-500 rounded-full" />
                        </View>
                      </View>
                    </LinearGradient>
                  </View>
                  <View className="items-center">
                    <Text className="text-xl font-bold text-gray-100">
                      {user.first_name} {user.last_name}
                    </Text>
                    <Text className="text-gray-400">@{user.username}</Text>
                  </View>
                </View>
              </GamifiedCard>
            </View>

            {/* Account Stats */}
            <View className="mb-6">
              <GamifiedCard
                title="Account Stats"
                icon={<AntDesign name="bar-chart" size={20} color="#10B981" />}
              >
                <View className="gap-y-3">
                  <View className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <Text className="text-gray-300">Student ID</Text>
                    <Text className="text-gray-100 font-semibold capitalize">
                      {user.student_id || "N/A"}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <Text className="text-gray-300">Level</Text>
                    <Text className="text-gray-100 font-semibold capitalize">
                      {userStats?.level.current_level || 1}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <Text className="text-gray-300">Total XP</Text>
                    <Text className="text-gray-100 font-semibold">
                      {userStats?.level.total_xp || 0}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <Text className="text-gray-300">Member Since</Text>
                    <Text className="text-gray-100 font-semibold">
                      {new Date(
                        user.created_at || Date.now()
                      ).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </GamifiedCard>
            </View>

            {/* Account Information */}
            <View className="mb-6">
              <GamifiedCard
                title="Account Information"
                icon={<AntDesign name="user" size={20} color="#10B981" />}
              >
                <View className="gap-y-3">
                  <View className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <Text className="text-gray-300">First Name</Text>
                    <Text className="text-gray-100 font-semibold">
                      {user.first_name}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <Text className="text-gray-300">Last Name</Text>
                    <Text className="text-gray-100 font-semibold">
                      {user.last_name}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <Text className="text-gray-300">Username</Text>
                    <Text className="text-gray-100 font-semibold">
                      {user.username}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <Text className="text-gray-300">Email</Text>
                    <Text className="text-gray-100 font-semibold">
                      {user.email}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => router.push("/profile/edit")}
                    className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg mt-2"
                  >
                    <View className="flex-row items-center gap-3">
                      <AntDesign name="edit" size={20} color="#10B981" />
                      <Text className="text-gray-100">Edit Profile</Text>
                    </View>
                    <AntDesign name="right" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </GamifiedCard>
            </View>

            {/* Security Settings */}
            <View className="mb-6">
              <GamifiedCard
                title="Security Settings"
                icon={<AntDesign name="lock" size={20} color="#10B981" />}
              >
                <View className="gap-y-3">
                  <TouchableOpacity
                    onPress={() => router.push("/profile/change-password")}
                    className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                  >
                    <View className="flex-row items-center gap-3">
                      <AntDesign name="lock" size={20} color="#10B981" />
                      <Text className="text-gray-100">Change Password</Text>
                    </View>
                    <AntDesign name="right" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </GamifiedCard>
            </View>

            {/* Danger Zone */}
            <View className="mb-6">
              <GamifiedCard
                title="Danger Zone"
                icon={<AntDesign name="warning" size={20} color="#05df72" />}
              >
                <View className="gap-y-3">
                  <TouchableOpacity
                    onPress={() => router.push("/profile/delete-account")}
                    className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                  >
                    <View className="flex-row items-center gap-3">
                      <AntDesign name="delete" size={20} color="#EF4444" />
                      <Text className="text-red-400">Delete Account</Text>
                    </View>
                    <AntDesign name="right" size={16} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </GamifiedCard>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default ProfileScreen;
