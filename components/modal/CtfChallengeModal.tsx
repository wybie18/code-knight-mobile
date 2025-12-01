import { PrimaryButton, SecondaryOutlineButton } from "@/components/button";
import { useCustomAlert } from "@/hooks/useCustomAlert";
import { challengesService } from "@/services/challengesService";
import { markdownStyles } from "@/styles/markdownStyles";
import type { Challenge, CtfChallenge } from "@/types/challenges";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    Linking,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Markdown from "react-native-markdown-display";
import CustomAlert from "../alert/CustomAlert";

interface CtfChallengeModalProps {
  challenge: Challenge | null;
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CtfChallengeModal = ({
  challenge,
  visible,
  onClose,
  onSuccess,
}: CtfChallengeModalProps) => {
  const [flag, setFlag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const { alertConfig, showAlert, hideAlert } = useCustomAlert();

  useEffect(() => {
    if (visible && challenge) {
      setFlag("");
      setShowHints(false);
    }
  }, [visible, challenge]);

  if (!challenge) return null;

  const ctfChallenge = challenge.challengeable as CtfChallenge;

  const handleSubmit = async () => {
    if (!flag.trim()) {
      showAlert({
        title: "Error",
        message: "Please enter a flag",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await challengesService.submitCtfFlag(
        challenge.slug,
        flag.trim()
      );

      if (response.success) {
        showAlert({
          title: "Success!",
          message: response.message,
          type: "success",
        });
        setFlag("");
        onSuccess?.();
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        showAlert({
          title: "Incorrect Flag",
          message: response.message || "Try again!",
          type: "error",
        });
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Incorrect flag. Try again!";
      showAlert({
        title: "Error",
        message: errorMsg,
        type: "error",
      });
      console.error("Error submitting flag:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenFile = async (fileUrl: string) => {
    try {
      const supported = await Linking.canOpenURL(fileUrl);
      if (supported) {
        await Linking.openURL(fileUrl);
      } else {
        showAlert({
          title: "Error",
          message: "Cannot open this file",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error opening file:", error);
      showAlert({
        title: "Error",
        message: "Failed to open file",
        type: "error",
      });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/90">
        <View className="flex-1 bg-gray-900 mt-16 rounded-t-3xl">
          {/* Header */}
          <View className="border-b border-gray-800 px-4 py-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-white flex-1" numberOfLines={1}>
                {challenge.title}
              </Text>
              <TouchableOpacity
                onPress={onClose}
                className="ml-4 w-8 h-8 items-center justify-center"
              >
                <Ionicons name="close" size={28} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Meta Info */}
            <View className="flex-row items-center justify-between mt-3">
              <View className="flex-row items-center gap-2">
                <View
                  className="px-2 py-1 rounded-lg border"
                  style={{
                    backgroundColor: `${ctfChallenge.category.color}20`,
                    borderColor: `${ctfChallenge.category.color}50`,
                  }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: ctfChallenge.category.color }}
                  >
                    {ctfChallenge.category.name}
                  </Text>
                </View>
                <View
                  className={`px-2 py-1 rounded-full ${
                    challenge.difficulty.name === "Beginner"
                      ? "bg-green-500/20 border border-green-500/30"
                      : challenge.difficulty.name === "Intermediate"
                        ? "bg-yellow-500/20 border border-yellow-500/30"
                        : "bg-red-500/20 border border-red-500/30"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      challenge.difficulty.name === "Beginner"
                        ? "text-green-400"
                        : challenge.difficulty.name === "Intermediate"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }`}
                  >
                    {challenge.difficulty.name}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-1">
                <AntDesign name="fire" size={16} color="#F97316" />
                <Text className="text-orange-400 font-semibold">
                  {challenge.points} Points
                </Text>
              </View>
            </View>
          </View>

          <ScrollView className="flex-1">
            <View className="p-4">
              {/* Description */}
              <View className="mb-6">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="document-text" size={18} color="#10B981" />
                  <Text className="text-green-400 text-sm font-semibold ml-2 tracking-wide">
                    DESCRIPTION
                  </Text>
                </View>
                <View className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                  <Markdown style={markdownStyles}>{challenge.description}</Markdown>
                </View>
              </View>

              {/* Challenge Files */}
              {ctfChallenge.file_paths && ctfChallenge.file_paths.length > 0 && (
                <View className="mb-6">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="document-attach" size={18} color="#10B981" />
                    <Text className="text-green-400 text-sm font-semibold ml-2 tracking-wide">
                      CHALLENGE FILES
                    </Text>
                  </View>
                  <View className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                    {ctfChallenge.file_paths.map((filePath, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleOpenFile(filePath)}
                        className="flex-row items-center py-2 border-b border-gray-700/30 last:border-b-0"
                      >
                        <Ionicons name="document" size={20} color="#3B82F6" />
                        <Text className="text-blue-400 font-mono text-sm ml-2 flex-1">
                          {filePath.split("/").pop() || filePath}
                        </Text>
                        <Ionicons
                          name="open-outline"
                          size={16}
                          color="#3B82F6"
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Hints */}
              {challenge.hints && (
                <View className="mb-6">
                  <TouchableOpacity
                    onPress={() => setShowHints(!showHints)}
                    className="flex-row items-center mb-3"
                  >
                    <Ionicons name="bulb" size={18} color="#10B981" />
                    <Text className="text-green-400 text-sm font-semibold ml-2 tracking-wide">
                      HINTS
                    </Text>
                    <Ionicons
                      name={showHints ? "chevron-up" : "chevron-down"}
                      size={18}
                      color="#10B981"
                      className="ml-2"
                    />
                  </TouchableOpacity>
                  {showHints && (
                    <View className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <Text className="text-blue-300 text-sm leading-relaxed">
                        {challenge.hints}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Flag Submission */}
              {!challenge.is_solved && (
                <View className="mb-4">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="flag" size={18} color="#10B981" />
                    <Text className="text-green-400 text-sm font-semibold ml-2 tracking-wide">
                      FLAG SUBMISSION
                    </Text>
                  </View>
                  <View className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                    <View className="relative mb-4">
                      <Ionicons
                        name="flag-outline"
                        size={20}
                        color="#9CA3AF"
                        className="absolute left-3 top-3"
                      />
                      <TextInput
                        value={flag}
                        onChangeText={setFlag}
                        placeholder="CTF{s4mpl3_fl4g}"
                        placeholderTextColor="#6B7280"
                        className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-600/50 focus:border-green-400 text-white rounded-lg font-mono"
                        editable={!isSubmitting}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                    </View>
                    <PrimaryButton
                      onPress={handleSubmit}
                      disabled={isSubmitting || !flag.trim()}
                      loading={isSubmitting}
                    >
                      <Text className="font-semibold">
                        {isSubmitting ? "Submitting..." : "Submit Flag"}
                      </Text>
                    </PrimaryButton>
                  </View>
                </View>
              )}

              {/* Solved Badge */}
              {challenge.is_solved && (
                <View className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-6 items-center mb-4">
                  <Ionicons name="trophy" size={48} color="#10B981" />
                  <Text className="text-green-400 text-xl font-bold mt-3">
                    Challenge Solved!
                  </Text>
                  <Text className="text-gray-400 text-sm mt-2">
                    You've successfully captured the flag
                  </Text>
                  <View className="flex-row items-center mt-3 bg-yellow-500/20 px-4 py-2 rounded-lg">
                    <AntDesign name="fire" size={20} color="#F59E0B" />
                    <Text className="text-yellow-400 font-semibold ml-2">
                      +{challenge.points} XP Earned
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="border-t border-gray-800 px-4 py-4">
            <SecondaryOutlineButton onPress={onClose}>
              <Text className="text-gray-400 font-semibold">
                {challenge.is_solved ? "Close" : "Cancel"}
              </Text>
            </SecondaryOutlineButton>
          </View>
        </View>
      </View>
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
    </Modal>
  );
};

export default CtfChallengeModal;
