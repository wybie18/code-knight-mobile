import GamifiedCard from "@/components/card/GamifiedCard";
import type { QuizQuestion as QuizQuestionType, TestItem } from "@/types/test";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface QuizQuestionProps {
  item: TestItem;
  question: QuizQuestionType;
  currentAnswer: any;
  onAnswer: (itemId: number, answer: any) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  item,
  question,
  currentAnswer,
  onAnswer,
}) => {
  // Parse options - they might be a JSON string from the API
  let options: string[] = [];
  try {
    if (question.options) {
      options = typeof question.options === "string"
        ? JSON.parse(question.options)
        : question.options;
    }
  } catch (e) {
    console.error("Failed to parse options", e);
  }

  // Boolean type question
  if (question.type === "boolean") {
    return (
      <View>
        <GamifiedCard className="mb-4">
          <Text className="text-white text-lg">{question.question}</Text>
        </GamifiedCard>

        <View className="gap-3">
          {["True", "False"].map((option) => {
            const isSelected = currentAnswer === option;
            return (
              <TouchableOpacity
                key={option}
                onPress={() => onAnswer(item.id, option)}
                className={`p-4 rounded-xl border ${
                  isSelected
                    ? "bg-green-500/20 border-green-500/50"
                    : "bg-gray-800/30 border-gray-700/30"
                }`}
              >
                <View className="flex-row items-center">
                  <View
                    className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                      isSelected
                        ? "border-green-500 bg-green-500"
                        : "border-gray-600"
                    }`}
                  >
                    {isSelected && (
                      <Feather name="check" size={14} color="#fff" />
                    )}
                  </View>
                  <Text
                    className={isSelected ? "text-green-100" : "text-gray-300"}
                  >
                    {option}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  // Fill in the blank
  if (question.type === "fill_blank") {
    return (
      <View>
        <GamifiedCard className="mb-4">
          <Text className="text-white text-lg">{question.question}</Text>
        </GamifiedCard>

        <TextInput
          value={currentAnswer || ""}
          onChangeText={(text) => onAnswer(item.id, text)}
          placeholder="Type your answer..."
          placeholderTextColor="#6b7280"
          className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-white"
          autoCapitalize="none"
        />
      </View>
    );
  }

  // Multiple choice (default)
  return (
    <View>
      <GamifiedCard className="mb-4">
        <Text className="text-white text-lg">{question.question}</Text>
      </GamifiedCard>

      <View className="gap-3">
        {options.map((option, index) => {
          const isSelected = currentAnswer === option;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onAnswer(item.id, option)}
              className={`p-4 rounded-xl border ${
                isSelected
                  ? "bg-green-500/20 border-green-500/50"
                  : "bg-gray-800/30 border-gray-700/30"
              }`}
            >
              <View className="flex-row items-center">
                <View
                  className={`w-6 h-6 rounded-full border-2 items-center justify-center mr-3 ${
                    isSelected
                      ? "border-green-500 bg-green-500"
                      : "border-gray-600"
                  }`}
                >
                  {isSelected && (
                    <Feather name="check" size={14} color="#fff" />
                  )}
                </View>
                <Text
                  className={`flex-1 ${
                    isSelected ? "text-green-100" : "text-gray-300"
                  }`}
                >
                  {option}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default QuizQuestion;
