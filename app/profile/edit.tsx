import CustomAlert from "@/components/alert/CustomAlert";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import GamifiedCard from "@/components/card/GamifiedCard";
import CustomInput from "@/components/input/CustomInput";
import UserAvatar from "@/components/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import {
  profileService,
  type ProfileFormData,
} from "@/services/profileService";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProfile = () => {
  const { updateUser, user } = useAuth();
  const router = useRouter();
  const { alertConfig, showAlert, hideAlert } = useCustomAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
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

  const [formData, setFormData] = useState(initialFormData);

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

  const handleAvatarChange = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      showAlert({
        title: "Permission Required",
        message: "Permission to access camera roll is required!",
        type: "error",
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
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
        const uriParts = formData.avatar.uri.split(".");
        const fileType = uriParts[uriParts.length - 1];

        formDataToSend.append("avatar", {
          uri: formData.avatar.uri,
          name: `avatar.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      const responseData = await profileService.updateProfile(formDataToSend);

      showAlert({
        title: "Success",
        message: "Profile updated successfully!",
        type: "success",
        onConfirm: () => {
          updateUser(responseData);
          router.back();
        },
      });
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        showAlert({
          title: "Error",
          message: "Please fix the errors in the form",
          type: "error",
        });
      } else if (error.response?.data?.message) {
        setErrors({ general: [error.response.data.message] });
        showAlert({
          title: "Error",
          message: error.response.data.message,
          type: "error",
        });
      } else {
        setErrors({
          general: ["Failed to update profile. Please try again."],
        });
        showAlert({
          title: "Error",
          message: "Failed to update profile. Please try again.",
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
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
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      {/* Header */}
      <View className="px-4 py-4 flex-row items-center border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold text-white">Edit Profile</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="relative">
            <View className="relative z-10 py-6">
              {/* Profile Picture */}
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
                    <TouchableOpacity
                      onPress={handleAvatarChange}
                      className="relative"
                    >
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
                            {avatarPreview ? (
                              <Image
                                source={{
                                  uri: avatarPreview,
                                }}
                                className="w-32 h-32 rounded-full"
                              />
                            ) : (
                              <UserAvatar
                                user={user}
                                size="5xl"
                                className="ring-2 ring-transparent"
                              />
                            )}
                          </View>
                        </LinearGradient>
                      </View>
                      <View className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2">
                        <MaterialIcons
                          name="photo-camera"
                          size={20}
                          color="white"
                        />
                      </View>
                    </TouchableOpacity>
                    <Text className="text-gray-400 text-sm">
                      Tap to change profile picture
                    </Text>
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
                        <Text className="text-red-300">
                          {errors.general[0]}
                        </Text>
                      </View>
                    )}

                    {/* Form fields */}
                    <View className="gap-y-4">
                      <CustomInput
                        label="First Name"
                        value={formData.first_name}
                        onChangeText={(text) =>
                          handleInputChange("first_name", text)
                        }
                        error={
                          errors.first_name ? errors.first_name[0] : undefined
                        }
                      />

                      <CustomInput
                        label="Last Name"
                        value={formData.last_name}
                        onChangeText={(text) =>
                          handleInputChange("last_name", text)
                        }
                        error={
                          errors.last_name ? errors.last_name[0] : undefined
                        }
                      />

                      <CustomInput
                        label="Username"
                        value={formData.username}
                        onChangeText={(text) =>
                          handleInputChange("username", text)
                        }
                        error={
                          errors.username ? errors.username[0] : undefined
                        }
                      />

                      <CustomInput
                        label="Email"
                        value={formData.email}
                        onChangeText={(text) =>
                          handleInputChange("email", text)
                        }
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={
                          errors.email ? errors.email[0] : undefined
                        }
                      />
                      
                    </View>
                  </View>
                </GamifiedCard>
              </View>

              {/* Action Buttons */}
              <View className="px-4 flex-row gap-x-3">
                <SecondaryButton
                  onPress={handleCancel}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Text className="text-gray-300">Cancel</Text>
                </SecondaryButton>
                <PrimaryButton
                  onPress={handleSaveProfile}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <AntDesign name="save" size={16} />
                  <Text className="ml-2">
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Text>
                </PrimaryButton>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {alertConfig && (
        <CustomAlert
          visible={true}
          title={alertConfig.title}
          message={alertConfig.message}
          type={alertConfig.type}
          onClose={hideAlert}
          onConfirm={alertConfig.onConfirm}
          cancelText={alertConfig.cancelText}
          confirmText={alertConfig.confirmText}
        />
      )}
    </SafeAreaView>
  );
};

export default EditProfile;
