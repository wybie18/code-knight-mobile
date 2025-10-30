import { AntDesign } from "@expo/vector-icons";
import React from "react";
import {
    Modal,
    ScrollView,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from "react-native";

interface GamifiedModalProps {
  isOpen: boolean;
  onClose: () => void;
  icon?: React.ReactNode;
  title: string;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnBackdropClick?: boolean;
  children: React.ReactNode;
}

const sizeClasses: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

const GamifiedModal = ({
  isOpen,
  onClose,
  icon,
  title,
  size = "md",
  closeOnBackdropClick = true,
  children,
}: GamifiedModalProps) => {
  const handleBackdropPress = () => {
    if (closeOnBackdropClick) {
      onClose();
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View className="flex-1 bg-black/60 justify-center items-center p-4">
          <TouchableWithoutFeedback>
            <View className={`${sizeClasses[size]} w-full bg-gray-800 rounded-xl shadow-2xl`}>
              {/* Header */}
              <View className="flex-row items-center justify-between p-4 border-b border-gray-700">
                <View className="flex-row items-center gap-2">
                  {icon && <View className="text-green-400">{icon}</View>}
                  <Text className="text-lg font-semibold text-gray-100">
                    {title}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onClose}
                  className="p-1 hover:bg-gray-700 rounded-lg"
                >
                  <AntDesign name="close" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Content */}
              <ScrollView className="max-h-96">
                <View className="p-4">{children}</View>
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default GamifiedModal;
