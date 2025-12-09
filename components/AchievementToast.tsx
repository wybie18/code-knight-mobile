import React from 'react';
import { Image, Text, View } from 'react-native';
import { AchievementEarnedEvent } from '../types/achievement';

interface AchievementToastProps {
  event: AchievementEarnedEvent;
}

export default function AchievementToast({ event }: AchievementToastProps) {

  return (
    <View className="flex-row items-center gap-4 p-4 bg-gray-900/90 rounded-xl border border-gray-700 shadow-lg w-[90%] self-center">
      <View className="flex-shrink-0">
        {event.achievement.icon ? (
          <Image 
            source={{ uri: event.achievement.icon }} 
            className="w-14 h-14 object-contain" 
            alt="icon" 
          />
        ) : (
          <Text className="text-4xl">🏆</Text>
        )}
      </View>
      
      <View className="flex-1">
        <Text className="text-base font-bold text-white mb-1">
          Achievement Unlocked! 🎉
        </Text>
        <Text className="text-sm text-white/90 font-medium">
          {event.achievement.name}
        </Text>
        <Text className="text-xs text-white/70 mt-1">
          {event.achievement.description}
        </Text>
        
        {event.achievement.exp_reward > 0 && (
          <View className="mt-2 self-start bg-white/20 rounded-full px-3 py-1">
            <Text className="text-xs font-semibold text-white">
              +{event.achievement.exp_reward} XP
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
