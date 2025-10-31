import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

interface CustomInputProps extends TextInputProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  isPassword?: boolean;
}

export default function CustomInput({
  label,
  icon,
  error,
  isPassword = false,
  value,
  onChangeText,
  editable = true,
  ...props
}: CustomInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <Text className="text-sm text-gray-400 mb-2">{label}</Text>
      <View className="relative">
        {/* Left Icon */}
        {icon && (
          <View className="absolute left-3 top-1/2 -translate-y-3 z-10">
            <Ionicons name={icon} size={20} color="#9CA3AF" />
          </View>
        )}

        {/* Input Field */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          secureTextEntry={isPassword && !showPassword}
          className={`w-full ${icon ? "pl-10" : "pl-4"} ${
            isPassword ? "pr-12" : "pr-4"
          } py-3 bg-gray-900 border ${
            error ? "border-red-500" : "border-gray-700"
          } text-white rounded ${!editable ? "opacity-50" : ""}`}
          placeholderTextColor="#6B7280"
          {...props}
        />

        {/* Password Toggle Button */}
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            disabled={!editable}
            className="absolute right-3 top-1/2 -translate-y-3"
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Error Message */}
      {error && <Text className="text-red-400 text-xs mt-1">{error}</Text>}
    </View>
  );
}
