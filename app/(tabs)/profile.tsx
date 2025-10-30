import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GamifiedCard from "../../components/card/GamifiedCard";
import DeleteModal from "../../components/modal/DeleteModal";
import UserAvatar from "../../components/UserAvatar";
import { useAuth } from "../../hooks/useAuth";
import { profileService, type PasswordChangeData, type ProfileFormData } from "../../services/profileService";

const Profile = () => {
  const { updateUser, user, userStats, refreshStats } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [passwordErrors, setPasswordErrors] = useState<{
    [key: string]: string[];
  }>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const initialFormData: ProfileFormData = useMemo<ProfileFormData>(
    () => ({
      username: user?.username || "",
      student_id: user?.student_id || "",
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      avatar: null,
    }),
    [user]
  );

  useEffect(() => {
    refreshStats();
  }, []);

  const [formData, setFormData] = useState(initialFormData);

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: [],
      });
    }
  };

  const handlePasswordChange = (name: string, value: string) => {
    setPasswordData({
      ...passwordData,
      [name]: value,
    });

    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: [],
      });
    }
  };

  const handleAvatarChange = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setFormData({
        ...formData,
        avatar: asset,
      });
      setAvatarPreview(asset.uri);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setErrors({});
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("_method", "PUT");
      formDataToSend.append("first_name", formData.first_name);
      formDataToSend.append("last_name", formData.last_name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("username", formData.username);
      
      if (formData.avatar) {
        const uriParts = formData.avatar.uri.split('.');
        const fileType = uriParts[uriParts.length - 1];
        
        formDataToSend.append("avatar", {
          uri: formData.avatar.uri,
          name: `avatar.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      const responseData = await profileService.updateProfile(formDataToSend);
      
      Alert.alert("Success", "Profile updated successfully!");
      updateUser(responseData);
      setIsEditing(false);
      setAvatarPreview(null);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        Alert.alert("Error", "Please fix the errors in the form");
      } else if (error.response?.data?.message) {
        setErrors({ general: [error.response.data.message] });
        Alert.alert("Error", error.response.data.message);
      } else {
        setErrors({
          general: ["Failed to update profile. Please try again."],
        });
        Alert.alert("Error", "Failed to update profile. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordErrors({});

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setPasswordErrors({
        new_password_confirmation: ["Passwords don't match!"],
      });
      Alert.alert("Error", "Passwords don't match!");
      return;
    }

    setIsPasswordLoading(true);
    try {
      await profileService.changePassword(passwordData);
      
      Alert.alert("Success", "Password changed successfully!");
      setShowChangePassword(false);
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setPasswordErrors(error.response.data.errors);
        Alert.alert("Error", "Please fix the errors in the form");
      } else if (error.response?.data?.message) {
        setPasswordErrors({ general: [error.response.data.message] });
        Alert.alert("Error", error.response.data.message);
      } else {
        Alert.alert("Error", "Failed to change password. Please try again.");
      }
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(initialFormData);
    setAvatarPreview(null);
    setIsEditing(false);
    setErrors({});
  };

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400">Loading...</Text>
        </View>
      </SafeAreaView>
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
              <Text className="text-gray-400">Manage your account information</Text>
            </View>

            {/* Profile Picture and Stats */}
            <View className="mb-6">
              <GamifiedCard
                title="Profile Picture"
                icon={<MaterialIcons name="photo-camera" size={20} color="#10B981" />}
              >
                <View className="items-center gap-y-4">
                  <TouchableOpacity
                    onPress={isEditing ? handleAvatarChange : undefined}
                    disabled={!isEditing}
                    className="relative"
                  >
                    {avatarPreview || user.avatar ? (
                      <Image
                        source={{ uri: avatarPreview || user.avatar || undefined }}
                        className="w-32 h-32 rounded-full"
                      />
                    ) : (
                      <View className="w-32 h-32 rounded-full bg-gray-700 items-center justify-center">
                        <UserAvatar user={user} size="5xl" />
                      </View>
                    )}
                    {isEditing && (
                      <View className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2">
                        <MaterialIcons name="photo-camera" size={20} color="white" />
                      </View>
                    )}
                  </TouchableOpacity>
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
                    <Text className="text-gray-100 font-semibold capitalize">{user.student_id || "N/A"}</Text>
                  </View>
                  <View className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <Text className="text-gray-300">Level</Text>
                    <Text className="text-gray-100 font-semibold capitalize">{userStats?.level.current_level || 1}</Text>
                  </View>
                  <View className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <Text className="text-gray-300">Total XP</Text>
                    <Text className="text-gray-100 font-semibold">{userStats?.level.total_xp || 0}</Text>
                  </View>
                  <View className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <Text className="text-gray-300">Member Since</Text>
                    <Text className="text-gray-100 font-semibold">
                      {new Date(user.created_at || Date.now()).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </GamifiedCard>
            </View>

            {/* Personal Information */}
            <View className="mb-6">
              <GamifiedCard
                title="Personal Information"
                icon={<AntDesign name="user" size={20} color="#10B981" />}
              >
                <View className="gap-y-4">
                  {errors.general && (
                    <View className="bg-red-900/30 border border-red-700 px-4 py-3 rounded-md">
                      <Text className="text-red-300">{errors.general[0]}</Text>
                    </View>
                  )}

                  <View className="flex-row justify-end mb-4">
                    {!isEditing ? (
                      <TouchableOpacity
                        onPress={() => setIsEditing(true)}
                        className="flex-row items-center gap-2 px-4 py-2 bg-green-600 rounded-md"
                      >
                        <AntDesign name="edit" size={16} color="white" />
                        <Text className="text-white">Edit Profile</Text>
                      </TouchableOpacity>
                    ) : (
                      <View className="flex-row gap-2">
                        <TouchableOpacity
                          onPress={handleCancel}
                          disabled={isLoading}
                          className="px-4 py-2 bg-gray-700 rounded-md"
                        >
                          <Text className="text-gray-300">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleSaveProfile}
                          disabled={isLoading}
                          className={`flex-row items-center gap-2 px-4 py-2 rounded-md ${
                            isLoading ? "bg-green-600/50" : "bg-green-600"
                          }`}
                        >
                          <AntDesign name="save" size={16} color="white" />
                          <Text className="text-white">
                            {isLoading ? "Saving..." : "Save Changes"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {/* Form fields */}
                  <View className="gap-y-4">
                    <View>
                      <Text className="text-sm font-medium text-gray-300 mb-1">
                        First Name
                      </Text>
                      <TextInput
                        value={formData.first_name}
                        onChangeText={(text) => handleInputChange("first_name", text)}
                        editable={isEditing}
                        className={`px-4 py-3 rounded-lg text-gray-100 ${
                          isEditing
                            ? "bg-gray-800/50 border border-gray-700"
                            : "bg-gray-800/30 border border-gray-800"
                        }`}
                        placeholderTextColor="#6B7280"
                      />
                      {errors.first_name && (
                        <Text className="text-red-400 text-sm mt-1">
                          {errors.first_name[0]}
                        </Text>
                      )}
                    </View>

                    <View>
                      <Text className="text-sm font-medium text-gray-300 mb-1">
                        Last Name
                      </Text>
                      <TextInput
                        value={formData.last_name}
                        onChangeText={(text) => handleInputChange("last_name", text)}
                        editable={isEditing}
                        className={`px-4 py-3 rounded-lg text-gray-100 ${
                          isEditing
                            ? "bg-gray-800/50 border border-gray-700"
                            : "bg-gray-800/30 border border-gray-800"
                        }`}
                        placeholderTextColor="#6B7280"
                      />
                      {errors.last_name && (
                        <Text className="text-red-400 text-sm mt-1">
                          {errors.last_name[0]}
                        </Text>
                      )}
                    </View>

                    <View>
                      <Text className="text-sm font-medium text-gray-300 mb-1">
                        Username
                      </Text>
                      <TextInput
                        value={formData.username}
                        onChangeText={(text) => handleInputChange("username", text)}
                        editable={isEditing}
                        className={`px-4 py-3 rounded-lg text-gray-100 ${
                          isEditing
                            ? "bg-gray-800/50 border border-gray-700"
                            : "bg-gray-800/30 border border-gray-800"
                        }`}
                        placeholderTextColor="#6B7280"
                      />
                      {errors.username && (
                        <Text className="text-red-400 text-sm mt-1">
                          {errors.username[0]}
                        </Text>
                      )}
                    </View>

                    <View>
                      <Text className="text-sm font-medium text-gray-300 mb-1">
                        Email
                      </Text>
                      <TextInput
                        value={formData.email}
                        onChangeText={(text) => handleInputChange("email", text)}
                        editable={isEditing}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className={`px-4 py-3 rounded-lg text-gray-100 ${
                          isEditing
                            ? "bg-gray-800/50 border border-gray-700"
                            : "bg-gray-800/30 border border-gray-800"
                        }`}
                        placeholderTextColor="#6B7280"
                      />
                      {errors.email && (
                        <Text className="text-red-400 text-sm mt-1">
                          {errors.email[0]}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              </GamifiedCard>
            </View>

            {/* Security Settings */}
            <View className="mb-6">
              <GamifiedCard
                title="Security Settings"
                icon={<AntDesign name="lock" size={20} color="#10B981" />}
              >
                <View className="gap-y-4">
                  {!showChangePassword ? (
                    <TouchableOpacity
                      onPress={() => setShowChangePassword(true)}
                      className="flex-row items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                    >
                      <View className="flex-row items-center gap-3">
                        <AntDesign name="lock" size={20} color="#10B981" />
                        <Text className="text-gray-100">Change Password</Text>
                      </View>
                      <AntDesign name="right" size={16} color="#6B7280" />
                    </TouchableOpacity>
                  ) : (
                    <View className="gap-y-4">
                      {passwordErrors.general && (
                        <View className="bg-red-900/30 border border-red-700 px-4 py-3 rounded-md">
                          <Text className="text-red-300">
                            {passwordErrors.general[0]}
                          </Text>
                        </View>
                      )}

                      <View>
                        <Text className="text-sm font-medium text-gray-300 mb-1">
                          Current Password
                        </Text>
                        <View className="relative">
                          <TextInput
                            secureTextEntry={!showPasswords.current}
                            value={passwordData.current_password}
                            onChangeText={(text) =>
                              handlePasswordChange("current_password", text)
                            }
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 pr-12"
                            placeholder="Enter current password"
                            placeholderTextColor="#6B7280"
                          />
                          <TouchableOpacity
                            onPress={() =>
                              setShowPasswords({
                                ...showPasswords,
                                current: !showPasswords.current,
                              })
                            }
                            className="absolute right-3 top-3"
                          >
                            <AntDesign
                              name="eye"
                              size={20}
                              color="#6B7280"
                            />
                          </TouchableOpacity>
                        </View>
                        {passwordErrors.current_password && (
                          <Text className="text-red-400 text-sm mt-1">
                            {passwordErrors.current_password[0]}
                          </Text>
                        )}
                      </View>

                      <View>
                        <Text className="text-sm font-medium text-gray-300 mb-1">
                          New Password
                        </Text>
                        <View className="relative">
                          <TextInput
                            secureTextEntry={!showPasswords.new}
                            value={passwordData.new_password}
                            onChangeText={(text) =>
                              handlePasswordChange("new_password", text)
                            }
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 pr-12"
                            placeholder="Enter new password"
                            placeholderTextColor="#6B7280"
                          />
                          <TouchableOpacity
                            onPress={() =>
                              setShowPasswords({
                                ...showPasswords,
                                new: !showPasswords.new,
                              })
                            }
                            className="absolute right-3 top-3"
                          >
                            <AntDesign
                              name="eye"
                              size={20}
                              color="#6B7280"
                            />
                          </TouchableOpacity>
                        </View>
                        {passwordErrors.new_password && (
                          <Text className="text-red-400 text-sm mt-1">
                            {passwordErrors.new_password[0]}
                          </Text>
                        )}
                      </View>

                      <View>
                        <Text className="text-sm font-medium text-gray-300 mb-1">
                          Confirm New Password
                        </Text>
                        <View className="relative">
                          <TextInput
                            secureTextEntry={!showPasswords.confirm}
                            value={passwordData.new_password_confirmation}
                            onChangeText={(text) =>
                              handlePasswordChange("new_password_confirmation", text)
                            }
                            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 pr-12"
                            placeholder="Confirm new password"
                            placeholderTextColor="#6B7280"
                          />
                          <TouchableOpacity
                            onPress={() =>
                              setShowPasswords({
                                ...showPasswords,
                                confirm: !showPasswords.confirm,
                              })
                            }
                            className="absolute right-3 top-3"
                          >
                            <AntDesign
                              name="eye"
                              size={20}
                              color="#6B7280"
                            />
                          </TouchableOpacity>
                        </View>
                        {passwordErrors.new_password_confirmation && (
                          <Text className="text-red-400 text-sm mt-1">
                            {passwordErrors.new_password_confirmation[0]}
                          </Text>
                        )}
                      </View>

                      <View className="flex-row justify-end gap-2 pt-2">
                        <TouchableOpacity
                          onPress={() => {
                            setShowChangePassword(false);
                            setPasswordData({
                              current_password: "",
                              new_password: "",
                              new_password_confirmation: "",
                            });
                            setPasswordErrors({});
                          }}
                          disabled={isPasswordLoading}
                          className="px-4 py-2 bg-gray-700 rounded-md"
                        >
                          <Text className="text-gray-300">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={handleChangePassword}
                          disabled={isPasswordLoading}
                          className={`flex-row items-center gap-2 px-4 py-2 rounded-md ${
                            isPasswordLoading ? "bg-green-600/50" : "bg-green-600"
                          }`}
                        >
                          <AntDesign name="save" size={16} color="white" />
                          <Text className="text-white">
                            {isPasswordLoading ? "Changing..." : "Change Password"}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </GamifiedCard>
            </View>

            {/* Danger Zone */}
            <View className="mb-6">
              <GamifiedCard
                title="Danger Zone"
                icon={<AntDesign name="warning" size={20} color="#EF4444" />}
              >
                <View className="gap-y-4">
                  <View className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
                    <Text className="text-red-300 mb-2 font-semibold">
                      Delete Account
                    </Text>
                    <Text className="text-gray-400 text-sm mb-4">
                      Once you delete your account, there is no going back. Please
                      be certain.
                    </Text>
                    <TouchableOpacity
                      onPress={() => setShowDeleteModal(true)}
                      className="flex-row items-center gap-2 bg-red-600 px-4 py-2 rounded-md self-start"
                    >
                      <AntDesign name="delete" size={16} color="white" />
                      <Text className="text-white">Delete Account</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </GamifiedCard>
            </View>
          </View>
        </View>
      </ScrollView>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
};

export default Profile;