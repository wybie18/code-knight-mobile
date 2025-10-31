import CustomAlert from "@/components/alert/CustomAlert";
import { DangerButton, SecondaryButton } from "@/components/button";
import GamifiedCard from "@/components/card/GamifiedCard";
import { useAuth } from "@/hooks/useAuth";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import { profileService } from "@/services/profileService";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DeleteAccount = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { alertConfig, showAlert, hideAlert } = useCustomAlert();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>(
    {}
  );

  const handleDelete = async () => {
    if (!password) {
      showAlert({
        title: "Error",
        message: "Please enter your password",
        type: "error",
      });
      return;
    }

    showAlert({
      title: "Confirm Deletion",
      message: "Are you absolutely sure? This action cannot be undone.",
      type: "error",
      cancelText: "Cancel",
      confirmText: "Delete",
      onConfirm: async () => {
        setIsLoading(true);
        setErrors({});

        try {
          await profileService.deleteAccount(password);

          showAlert({
            title: "Account Deleted",
            message: "Your account has been successfully deleted.",
            type: "success",
            onConfirm: () => logout(),
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            "Failed to delete account. Please try again.";

          showAlert({
            title: "Error",
            message: errorMessage,
            type: "error",
          });

          if (error.response?.data?.message) {
            setErrors({ general: [error.response.data.message] });
          } else {
            setErrors({
              general: ["An unexpected error occurred. Please try again."],
            });
          }
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      <View className="px-4 py-4 flex-row items-center border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-bold text-white">Delete Account</Text>
        </View>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView className="flex-1">
          <View className="relative">
            <View className="relative z-10 py-6">
              <View className="mb-6">
                <GamifiedCard
                  title="Warning"
                  icon={<AntDesign name="warning" size={20} color="#05df72" />}
                >
                  <View className="gap-y-3">
                    <View className="flex-row items-start gap-3 p-4 bg-red-900/30 border border-red-700 rounded-md">
                      <AntDesign name="warning" size={20} color="#FCA5A5" />
                      <View className="flex-1">
                        <Text className="font-medium text-red-300 mb-1">
                          This action is irreversible
                        </Text>
                        <Text className="text-sm text-gray-400">
                          Deleting your account will permanently remove all your
                          data, including:
                        </Text>
                      </View>
                    </View>

                    <View className="gap-y-2 px-4">
                      <Text className="text-gray-300">
                        • Profile information
                      </Text>
                      <Text className="text-gray-300">
                        • Course progress and completions
                      </Text>
                      <Text className="text-gray-300">
                        • Achievements and badges
                      </Text>
                      <Text className="text-gray-300">
                        • Submitted exercises and quizzes
                      </Text>
                      <Text className="text-gray-300">• Activity history</Text>
                    </View>

                    <View className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-md">
                      <Text className="text-yellow-300 text-sm">
                        💡 Consider exporting your data before deletion if you
                        need to keep any records.
                      </Text>
                    </View>
                  </View>
                </GamifiedCard>
              </View>

              {/* Delete Form */}
              <View className="mb-6">
                <GamifiedCard
                  title="Confirm Deletion"
                  icon={<AntDesign name="lock" size={20} color="#05df72" />}
                >
                  <View className="gap-y-4">
                    {errors.general && (
                      <View className="bg-red-900/30 border border-red-700 px-4 py-3 rounded-md">
                        <Text className="text-red-300">
                          {errors.general[0]}
                        </Text>
                      </View>
                    )}

                    <View>
                      <Text className="text-sm font-medium text-gray-300 mb-1">
                        Enter your password to confirm
                      </Text>
                      <View className="relative">
                        <TextInput
                          secureTextEntry={!showPassword}
                          value={password}
                          onChangeText={(text) => {
                            setPassword(text);
                            setErrors({});
                          }}
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100 pr-12"
                          placeholder="Enter your password"
                          placeholderTextColor="#6B7280"
                        />
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3"
                        >
                          <AntDesign name="eye" size={20} color="#6B7280" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <Text className="text-gray-300 text-sm">
                        By deleting your account, you acknowledge that:
                      </Text>
                      <Text className="text-gray-400 text-xs mt-2">
                        • All your data will be permanently deleted
                      </Text>
                      <Text className="text-gray-400 text-xs">
                        • This action cannot be undone
                      </Text>
                      <Text className="text-gray-400 text-xs">
                        • You will be immediately logged out
                      </Text>
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
                <DangerButton
                  onPress={handleDelete}
                  disabled={isLoading || !password}
                  className="flex-1"
                >
                  <AntDesign name="delete" size={16} color="white" />
                  <Text className="text-white ml-2">
                    {isLoading ? "Deleting..." : "Delete Account"}
                  </Text>
                </DangerButton>
              </View>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

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

export default DeleteAccount;