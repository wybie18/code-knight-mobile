import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import Markdown from "react-native-markdown-display";
import { markdownStyles } from "../../styles/markdownStyles";

interface ConsoleOutputProps {
  output: string;
  isRunning: boolean;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  output,
  isRunning,
}) => {
  return (
    <View className="flex-1 bg-[#1e1e1e]">
      <View className="border-b border-gray-700 px-4 py-3">
        <Text className="text-gray-300 font-semibold text-sm">Console</Text>
      </View>
      <ScrollView className="flex-1 p-4">
        {isRunning ? (
          <View className="flex-row items-center gap-3">
            <ActivityIndicator size="small" color="#10B981" />
            <Text className="text-gray-400 text-sm">Running...</Text>
          </View>
        ) : output ? (
          <Markdown style={markdownStyles}>{output}</Markdown>
        ) : (
          <Text className="text-gray-500 text-sm">
            No output yet. Run your code to see results.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};
