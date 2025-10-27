export interface Achievement {
    id: number;
    name: string;
    description: string;
    icon: string | null;
    exp_reward: number;
    type: string | null;
}

export interface AchievementEarnedEvent {
    achievement: Achievement;
    message: string;
    earned_at: string;
}