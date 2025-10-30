import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { profileService } from "../../services/profileService";
import GamifiedModal from "./GamifiedModal";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DeleteModal = ({ isOpen, onClose }: DeleteModalProps) => {
  const { logout } = useAuth();
  const [password, setPassword] = useState("");
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

  useEffect(() => {
    if (isOpen) {
      setErrors({});
      setPassword("");
    }
  }, [isOpen]);

  const handleDelete = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      await profileService.deleteAccount(password);

      Alert.alert("Success", "Account deleted successfully");
      onClose();
      logout();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to delete account. Please try again.";
      
      Alert.alert("Error", errorMessage);
      
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
  };

  return (
    <GamifiedModal
      isOpen={isOpen}
      onClose={onClose}
      icon={<AntDesign name="warning" size={20} color="#EF4444" />}
      title="Confirm Deletion"
      size="md"
      closeOnBackdropClick={false}
    >
      <View className="space-y-4">
        {/* Alert box */}
        <View className="flex-row items-start gap-3 p-4 bg-red-900/30 border border-red-700 rounded-md">
          <AntDesign name="warning" size={20} color="#FCA5A5" />
          <View className="flex-1">
            <Text className="font-medium text-red-300 mb-1">
              Are you sure you want to delete your account?
            </Text>
            <Text className="text-sm text-gray-400">
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </Text>
          </View>
        </View>

        {/* Errors */}
        {errors.general && (
          <View className="bg-red-900/30 border border-red-700 px-4 py-3 rounded-md">
            <Text className="text-red-300">{errors.general[0]}</Text>
          </View>
        )}

        {/* Password input */}
        <View>
          <Text className="text-sm font-medium text-gray-300 mb-1">
            Enter your password to confirm
          </Text>
          <View className="relative">
            <TextInput
              secureTextEntry={!showPasswordField}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({});
              }}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-100"
              placeholder="Enter your password"
              placeholderTextColor="#6B7280"
            />
            <TouchableOpacity
              onPress={() => setShowPasswordField(!showPasswordField)}
              className="absolute right-3 top-3"
            >
              <AntDesign
                name={showPasswordField ? "eye" : "eye"}
                size={20}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row justify-end gap-3 pt-4">
          <TouchableOpacity
            onPress={() => {
              onClose();
              setPassword("");
              setErrors({});
            }}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-md"
          >
            <Text className="text-gray-300">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            disabled={isLoading || !password}
            className={`flex-row items-center gap-2 px-4 py-2 rounded-md ${
              isLoading || !password
                ? "bg-red-600/50"
                : "bg-red-600"
            }`}
          >
            <AntDesign name="delete" size={16} color="white" />
            <Text className="text-white">
              {isLoading ? "Deleting..." : "Delete Account"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </GamifiedModal>
  );
};

export default DeleteModal;
