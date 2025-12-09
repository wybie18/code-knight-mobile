import GamifiedCard from "@/components/card/GamifiedCard";
import { countWords } from "@/helpers/test/testHelpers";
import type { EssayQuestion as EssayQuestionType, TestItem } from "@/types/test";
import React from "react";
import { Text, TextInput, View } from "react-native";

interface EssayQuestionProps {
  item: TestItem;
  essay: EssayQuestionType;
  currentAnswer: string;
  onAnswer: (itemId: number, answer: any) => void;
}

const EssayQuestion: React.FC<EssayQuestionProps> = ({
  item,
  essay,
  currentAnswer,
  onAnswer,
}) => {
  const answer = currentAnswer || "";
  const wordCount = countWords(answer);

  return (
    <View>
      <GamifiedCard className="mb-4">
        <Text className="text-white text-lg">{essay.question}</Text>
        {essay.word_limit && (
          <Text className="text-gray-400 text-sm mt-2">
            Word limit: {essay.word_limit} words
          </Text>
        )}
      </GamifiedCard>

      <View className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
        <TextInput
          value={answer}
          onChangeText={(text) => onAnswer(item.id, text)}
          placeholder="Write your essay here..."
          placeholderTextColor="#6b7280"
          multiline
          textAlignVertical="top"
          className="p-4 text-white min-h-[200px]"
        />
        <View className="bg-gray-900/50 px-4 py-2 border-t border-gray-700/50 flex-row justify-between">
          <Text className="text-gray-400 text-sm">Words: {wordCount}</Text>
          {essay.word_limit && (
            <Text
              className={`text-sm ${
                wordCount > essay.word_limit ? "text-red-400" : "text-gray-400"
              }`}
            >
              {wordCount}/{essay.word_limit}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default EssayQuestion;
