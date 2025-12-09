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
      className={`relative bg-gray-900/60 ${className}`}
    >
      {title && (
        <View className="relative p-4 border-b border-green-500/20">
          <View className="flex-row items-center gap-2">
            {icon && <View>{icon}</View>}
            <Text className="font-semibold text-green-100 text-lg">
              {title}
            </Text>
          </View>
        </View>
      )}

      <View className="relative p-4">{children}</View>
    </View>
  );
};

export default GamifiedCard;
