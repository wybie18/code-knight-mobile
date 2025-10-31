import CustomAlert from "@/components/alert/CustomAlert";
import { PrimaryButton, SecondaryButton } from "@/components/button";
import GamifiedCard from "@/components/card/GamifiedCard";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import {
  profileService,
  type PasswordChangeData,
} from "@/services/profileService";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ChangePassword = () => {
  const router = useRouter();
  const { alertConfig, showAlert, hideAlert } = useCustomAlert();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});

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

  const handlePasswordChange = (name: string, value: string) => {
    setPasswordData({
      ...passwordData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: [],
      });
    }
  };

  const handleSubmit = async () => {
    setErrors({});

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setErrors({
        new_password_confirmation: ["Passwords don't match!"],
      });
      showAlert({
        title: "Error",
        message: "Passwords don't match!",
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    try {
      await profileService.changePassword(passwordData);

      showAlert({
        title: "Success",
        message: "Password changed successfully!",
        type: "success",
        onConfirm: () => router.back(),
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
        showAlert({
          title: "Error",
          message: "Failed to change password. Please try again.",
          type: "error",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      <View className="px-4 py-4 flex-row items-center border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold text-white">
            Change Password
          </Text>
        </View>
      </View>
      <ScrollView className="flex-1">
        <View className="relative">
          <View className="relative z-10 py-6">
            {/* Security Information */}
            <View className="mb-6">
              <GamifiedCard
                title="Password Requirements"
                icon={<AntDesign name="info-circle" size={20} color="#10B981" />}
              >
                <View className="gap-y-2">
                  <Text className="text-gray-300 text-sm">
                    • Password must be at least 8 characters long
                  </Text>
                  <Text className="text-gray-300 text-sm">
                    • Use a mix of letters, numbers, and symbols
                  </Text>
                  <Text className="text-gray-300 text-sm">
                    • Avoid common words or patterns
                  </Text>
                </View>
              </GamifiedCard>
            </View>

            {/* Change Password Form */}
            <View className="mb-6">
              <GamifiedCard
                title="Change Password"
                icon={<AntDesign name="lock" size={20} color="#10B981" />}
              >
                <View className="gap-y-4">
                  {errors.general && (
                    <View className="bg-red-900/30 border border-red-700 px-4 py-3 rounded-md">
                      <Text className="text-red-300">{errors.general[0]}</Text>
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
                        <AntDesign name="eye" size={20} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                    {errors.current_password && (
                      <Text className="text-red-400 text-sm mt-1">
                        {errors.current_password[0]}
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
                        <AntDesign name="eye" size={20} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                    {errors.new_password && (
                      <Text className="text-red-400 text-sm mt-1">
                        {errors.new_password[0]}
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
                          handlePasswordChange(
                            "new_password_confirmation",
                            text
                          )
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
                        <AntDesign name="eye" size={20} color="#6B7280" />
                      </TouchableOpacity>
                    </View>
                    {errors.new_password_confirmation && (
                      <Text className="text-red-400 text-sm mt-1">
                        {errors.new_password_confirmation[0]}
                      </Text>
                    )}
                  </View>
                </View>
              </GamifiedCard>
            </View>

            {/* Action Buttons */}
            <View className="px-4 flex-row gap-x-3">
              <SecondaryButton
                onPress={() => router.back()}
                disabled={isLoading}
                className="flex-1"
              >
                <Text className="text-gray-300">Cancel</Text>
              </SecondaryButton>
              <PrimaryButton
                onPress={handleSubmit}
                disabled={isLoading}
                className="flex-1"
              >
                <AntDesign name="save" size={16}/>
                <Text className="ml-2">
                  {isLoading ? "Changing..." : "Change Password"}
                </Text>
              </PrimaryButton>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Custom Alert */}
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

export default ChangePassword;
