import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
}

const CustomAlert = ({
  visible,
  title,
  message,
  type = "info",
  onClose,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "OK",
}: CustomAlertProps) => {
  const getIconColor = () => {
    switch (type) {
      case "success":
        return "#10B981";
      case "error":
        return "#EF4444";
      default:
        return "#3B82F6";
    }
  };

  const getIconName = () => {
    switch (type) {
      case "success":
        return "check-circle";
      case "error":
        return "close-circle";
      default:
        return "info-cirlce";
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center p-4">
        <View className="bg-gray-800 rounded-xl w-full max-w-sm border border-gray-700">
          {/* Icon and Title */}
          <View className="items-center pt-6 pb-4 px-6">
            <AntDesign name={getIconName() as any} size={48} color={getIconColor()} />
            <Text className="text-xl font-bold text-gray-100 mt-4 text-center">
              {title}
            </Text>
          </View>

          {/* Message */}
          <View className="px-6 pb-6">
            <Text className="text-gray-300 text-center">{message}</Text>
          </View>

          {/* Buttons */}
          <View className="border-t border-gray-700">
            {onConfirm ? (
              <View className="flex-row">
                <TouchableOpacity
                  onPress={onClose}
                  className="flex-1 py-4 border-r border-gray-700"
                >
                  <Text className="text-gray-400 text-center font-semibold">
                    {cancelText}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="flex-1 py-4"
                >
                  <Text
                    className="text-center font-semibold"
                    style={{ color: getIconColor() }}
                  >
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={onClose} className="py-4">
                <Text
                  className="text-center font-semibold"
                  style={{ color: getIconColor() }}
                >
                  {confirmText}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;
