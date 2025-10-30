import React from 'react';
import { Image, Text, View } from 'react-native';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  avatar?: string | null;
}

type AvatarSize = "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";

const sizeClasses: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-lg",
  xl: "h-16 w-16 text-xl",
  "2xl": "h-20 w-20 text-2xl",
  "3xl": "h-24 w-24 text-3xl",
  "4xl": "h-28 w-28 text-3xl",
  "5xl": "h-32 w-32 text-5xl",
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
          <Text className="font-medium text-gray-600">
            {getInitials(user.first_name, user.last_name)}
          </Text>
        </View>
      )}
    </View>
  );
};

export default UserAvatar;
