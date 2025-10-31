import React from "react";
import { Image, Text, View } from "react-native";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  avatar?: string | null;
}

type AvatarSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
  "2xl": "h-20 w-20",
  "3xl": "h-24 w-24",
  "4xl": "h-28 w-28",
  "5xl": "h-32 w-32",
};

const textSizeClasses: Record<AvatarSize, string> = {
  sm: "text-sm",
  md: "text-sm",
  lg: "text-lg",
  xl: "text-xl",
  "2xl": "text-2xl",
  "3xl": "text-3xl",
  "4xl": "text-3xl",
  "5xl": "text-5xl",
};

interface UserAvatarProps {
  user: User;
  size?: AvatarSize;
  className?: string;
}

const UserAvatar = ({ user, size = "md", className = "" }: UserAvatarProps) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const currentSizeClass = sizeClasses[size];
  const textSizeClass = textSizeClasses[size];

  return (
    <View className={className}>
      {user.avatar ? (
        <Image
          className={`rounded-full ${currentSizeClass}`}
          source={{ uri: user.avatar }}
          alt={`${user.first_name} ${user.last_name}`}
        />
      ) : (
        <View
          className={`rounded-full bg-gray-200 flex items-center justify-center ${currentSizeClass}`}
        >
          <Text className={`font-medium text-gray-600 ${textSizeClass}`}>
            {getInitials(user.first_name, user.last_name)}
          </Text>
        </View>
      )}
    </View>
  );
};

export default UserAvatar;
