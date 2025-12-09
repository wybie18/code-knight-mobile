import { useEffect } from 'react';
import Toast from 'react-native-toast-message';
import echo from '../services/echo';
import { AchievementEarnedEvent } from '../types/achievement';

export function useAchievementListener(userId: number | undefined | null) {
  useEffect(() => {
    if (!userId) return;

    console.log(`Listening for achievements on channel: App.Models.User.${userId}`);
    const channel = echo.private(`App.Models.User.${userId}`);

    const handleAchievementEarned = (event: AchievementEarnedEvent) => {
      console.log('Achievement earned!', event);
      
      Toast.show({
        type: 'achievementToast',
        props: { event },
        visibilityTime: 5000,
        topOffset: 50,
      });
    };

    channel.listen('.achievement.earned', handleAchievementEarned);

    return () => {
      console.log(`Stopped listening for achievements on channel: App.Models.User.${userId}`);
      channel.stopListening('.achievement.earned', handleAchievementEarned);
      echo.leave(`App.Models.User.${userId}`);
    };
  }, [userId]);
}
