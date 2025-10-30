import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PrimaryButton, SecondaryOutlineButton } from "../button";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  loading?: boolean;
  children: ReactNode;
  onClearAll?: () => void;
  onApply?: () => void;
  clearAllDisabled?: boolean;
  clearAllText?: string;
  applyText?: string;
  showFooter?: boolean;
}

/**
 * Reusable Filter Modal Component
 * Provides a consistent bottom sheet modal for filtering options
 */
const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  title = "Filters",
  loading = false,
  children,
  onClearAll,
  onApply,
  clearAllDisabled = false,
  clearAllText = "Clear All",
  applyText = "Apply Filters",
  showFooter = true,
}) => {
  const handleApply = () => {
    if (onApply) {
      onApply();
    } else {
      onClose();
    }
  };

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        {/* Backdrop - tap to close */}
        <Pressable className="flex-1" onPress={onClose} />

        {/* Modal Content */}
        <View className="bg-gray-900 rounded-t-3xl border-t border-gray-700/50 max-h-[80%]">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-800/50">
            <View className="flex-row items-center">
              <Ionicons name="filter-outline" size={20} color="#10B981" />
              <Text className="text-lg font-semibold text-white ml-2">
                {title}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Modal Body */}
          <ScrollView className="px-4 py-4">
            {loading ? (
              <View className="py-10 items-center">
                <ActivityIndicator size="large" color="#10B981" />
              </View>
            ) : (
              children
            )}
          </ScrollView>

          {/* Modal Footer */}
          {showFooter && (
            <View className="px-4 py-4 border-t border-gray-800/50 flex-row space-x-3 gap-x-3">
              {onClearAll && (
                <SecondaryOutlineButton
                  onPress={handleClearAll}
                  disabled={clearAllDisabled}
                >
                  <Text className="text-gray-300">
                    {clearAllText}
                  </Text>
                </SecondaryOutlineButton>
              )}
              <PrimaryButton className="flex-1" onPress={handleApply}>
                <Text>
                  {applyText}
                </Text>
              </PrimaryButton>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
