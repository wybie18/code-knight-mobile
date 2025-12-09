import { View } from "react-native";

interface ProgressBarProps {
  progress: number;
  color?: string;
  height?: string;
}

const ProgressBar = ({
  progress,
  color = "green",
  height = "h-2",
}: ProgressBarProps) => {
  const colorMap: Record<string, string> = {
    blue: "#3b82f6",
    purple: "#a855f7",
    yellow: "#f59e0b",
    green: "#10b981",
  };

  const bgColor = colorMap[color] || colorMap.green;

  return (
    <View
      className={`w-full ${height} bg-gray-800 rounded-full overflow-hidden`}
    >
      <View
        className={`${height} rounded-tl-full rounded-bl-full relative`}
        style={{
          width: `${Math.min(progress, 100)}%`,
          backgroundColor: bgColor,
        }}
      >
        <View className="absolute inset-0 bg-white/20" />
      </View>
    </View>
  );
};

export default ProgressBar;
