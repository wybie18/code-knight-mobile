import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ViolationModalProps {
  visible: boolean;
  violationCount: number;
  maxViolations: number;
  lastViolationType: string;
  onDismiss: () => void;
  onForceSubmit?: () => void;
  isForceSubmit?: boolean;
}

const getViolationMessage = (type: string): string => {
  switch (type) {
    case "app_background":
      return "You switched away from the app";
    case "tab_switch":
      return "You switched to another app";
    case "copy_paste":
      return "Copy/paste detected";
    case "screenshot":
      return "Screenshot attempt detected";
    case "screen_record":
      return "Screen recording detected";
    default:
      return "Suspicious activity detected";
  }
};

export const ViolationModal: React.FC<ViolationModalProps> = ({
  visible,
  violationCount,
  maxViolations,
  lastViolationType,
  onDismiss,
  onForceSubmit,
  isForceSubmit = false,
}) => {
  const remainingWarnings = maxViolations - violationCount;
  const isLastWarning = remainingWarnings <= 1 && !isForceSubmit;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={isForceSubmit ? undefined : onDismiss}
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        <View className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm border border-red-500/30">
          {/* Icon */}
          <View className="items-center mb-4">
            <View
              className={`w-16 h-16 rounded-full items-center justify-center ${
                isForceSubmit ? "bg-red-500/20" : "bg-yellow-500/20"
              }`}
            >
              <Ionicons
                name={isForceSubmit ? "close-circle" : "warning"}
                size={40}
                color={isForceSubmit ? "#ef4444" : "#eab308"}
              />
            </View>
          </View>

          {/* Title */}
          <Text
            className={`text-xl font-bold text-center mb-2 ${
              isForceSubmit ? "text-red-400" : "text-yellow-400"
            }`}
          >
            {isForceSubmit ? "Test Terminated" : "Warning!"}
          </Text>

          {/* Message */}
          <Text className="text-gray-300 text-center mb-4">
            {getViolationMessage(lastViolationType)}
          </Text>

          {isForceSubmit ? (
            <>
              <Text className="text-gray-400 text-center text-sm mb-6">
                You have exceeded the maximum number of violations. Your test has
                been automatically submitted.
              </Text>
              <TouchableOpacity
                onPress={onForceSubmit}
                className="bg-red-600 py-3 rounded-xl items-center"
              >
                <Text className="text-white font-semibold">View Results</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* Violation Counter */}
              <View className="bg-gray-800/50 rounded-xl p-4 mb-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-400">Violations</Text>
                  <Text
                    className={`font-bold ${
                      isLastWarning ? "text-red-400" : "text-yellow-400"
                    }`}
                  >
                    {violationCount} / {maxViolations}
                  </Text>
                </View>
                {/* Progress bar */}
                <View className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <View
                    className={`h-full rounded-full ${
                      isLastWarning ? "bg-red-500" : "bg-yellow-500"
                    }`}
                    style={{
                      width: `${(violationCount / maxViolations) * 100}%`,
                    }}
                  />
                </View>
              </View>

              {/* Warning Text */}
              <Text className="text-gray-400 text-center text-sm mb-6">
                {isLastWarning ? (
                  <Text className="text-red-400 font-semibold">
                    This is your final warning! One more violation will
                    automatically submit your test.
                  </Text>
                ) : (
                  `You have ${remainingWarnings} warning${
                    remainingWarnings > 1 ? "s" : ""
                  } remaining before your test is automatically submitted.`
                )}
              </Text>

              {/* Action Button */}
              <TouchableOpacity
                onPress={onDismiss}
                className={`py-3 rounded-xl items-center ${
                  isLastWarning ? "bg-red-600" : "bg-yellow-600"
                }`}
              >
                <Text className="text-white font-semibold">
                  I Understand, Continue Test
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ViolationModal;
