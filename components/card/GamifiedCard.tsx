import React from "react";
import { Text, View } from "react-native";

interface CardProps {
  icon?: React.ReactNode;
  title?: string;
  className?: string;
  children: React.ReactNode;
}

const GamifiedCard = ({ icon, title, className = "", children }: CardProps) => {
  return (
    <View
      className={`relative bg-gray-900/90 border border-gray-800/50 ${className}`}
    >
      {/* Background gradient effect */}
      <View className="absolute inset-0 bg-green-500/5" />

      {title && (
        <View className="relative p-4 border-b border-gray-800/50">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              {icon && <View className="mr-2">{icon}</View>}
              <Text className="font-bold text-gray-100 font-mono">
                <Text className="text-green-400">╔══ </Text>
                <Text className="text-gray-100">{title}</Text>
                <Text className="text-green-400"> ══╗</Text>
              </Text>
            </View>
          </View>
        </View>
      )}

      <View className="relative p-4">{children}</View>
    </View>
  );
};

export default GamifiedCard;
