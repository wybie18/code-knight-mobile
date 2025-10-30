import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface FilterOption {
  id: number | string;
  name: string;
  value?: any;
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  selectedValues: (number | string)[];
  onToggle: (value: number | string) => void;
  className?: string;
}

/**
 * Reusable Filter Section Component
 * Displays a group of checkbox filter options
 */
const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  selectedValues,
  onToggle,
  className = "",
}) => {
  return (
    <View className={`mb-6 ${className}`}>
      <Text className="text-sm font-medium text-gray-300 mb-3">{title}</Text>
      <View className="space-y-2">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.id);
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => onToggle(option.id)}
              className="flex-row items-center py-2"
              activeOpacity={0.7}
            >
              <View
                className={`w-5 h-5 rounded border-2 items-center justify-center mr-3 ${
                  isSelected
                    ? "bg-green-500 border-green-500"
                    : "border-gray-600 bg-gray-700"
                }`}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={14} color="white" />
                )}
              </View>
              <Text className="text-gray-300 flex-1">{option.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default FilterSection;
