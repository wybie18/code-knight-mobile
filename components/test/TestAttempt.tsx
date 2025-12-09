import ProgressBar from "@/components/ProgressBar";
import ViolationModal from "@/components/test/ViolationModal";
import { CodingChallenge, EssayQuestion, QuizQuestion } from "@/components/test/questions";
import { formatTime, getItemType } from "@/helpers/test/testHelpers";
import type {
    CodingChallenge as CodingChallengeType,
    EssayQuestion as EssayQuestionType,
    QuizQuestion as QuizQuestionType,
    TestItem,
    Violation,
} from "@/types/test";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TestAttemptProps {
  items: TestItem[];
  currentItemIndex: number;
  answers: Record<number, any>;
  timeLeft: number;
  violations: Violation[];
  maxViolations: number;
  showViolationModal: boolean;
  lastViolationType: string;
  isForceSubmit: boolean;
  isSubmitting: boolean;
  onAnswer: (itemId: number, answer: any) => void;
  onSetCurrentItemIndex: (index: number) => void;
  onSubmit: () => void;
  onDismissViolationModal: () => void;
  onForceSubmit: () => void;
}

const TestAttempt: React.FC<TestAttemptProps> = ({
  items,
  currentItemIndex,
  answers,
  timeLeft,
  violations,
  maxViolations,
  showViolationModal,
  lastViolationType,
  isForceSubmit,
  isSubmitting,
  onAnswer,
  onSetCurrentItemIndex,
  onSubmit,
  onDismissViolationModal,
  onForceSubmit,
}) => {
  const currentItem = items[currentItemIndex];
  const progress = ((currentItemIndex + 1) / items.length) * 100;
  const isLastItem = currentItemIndex === items.length - 1;
  const answeredCount = Object.keys(answers).length;

  const renderQuestion = (item: TestItem) => {
    const itemType = getItemType(item);
    const itemable = item.itemable;
    const currentAnswer = answers[item.id];

    switch (itemType) {
      case "quiz":
        return (
          <QuizQuestion
            item={item}
            question={itemable as QuizQuestionType}
            currentAnswer={currentAnswer}
            onAnswer={onAnswer}
          />
        );
      case "coding":
        return (
          <CodingChallenge
            item={item}
            challenge={itemable as CodingChallengeType}
            currentAnswer={currentAnswer}
            onAnswer={onAnswer}
          />
        );
      case "essay":
        return (
          <EssayQuestion
            item={item}
            essay={itemable as EssayQuestionType}
            currentAnswer={currentAnswer || ""}
            onAnswer={onAnswer}
          />
        );
      default:
        return (
          <Text className="text-gray-400">Unknown question type</Text>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      {/* Violation Modal */}
      <ViolationModal
        visible={showViolationModal}
        violationCount={violations.length}
        maxViolations={maxViolations}
        lastViolationType={lastViolationType}
        onDismiss={onDismissViolationModal}
        onForceSubmit={onForceSubmit}
        isForceSubmit={isForceSubmit}
      />

      {/* Header with Timer */}
      <View className="px-4 py-3 border-b border-gray-800/50">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-white font-semibold">
              Question {currentItemIndex + 1}/{items.length}
            </Text>
            <View className="ml-2 bg-gray-800/50 px-2 py-0.5 rounded">
              <Text className="text-gray-400 text-xs">
                {currentItem.points} pts
              </Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3">
            {/* Violation indicator */}
            {violations.length > 0 && (
              <View className="flex-row items-center bg-red-500/20 px-2 py-1 rounded-full">
                <Ionicons name="warning" size={12} color="#ef4444" />
                <Text className="text-red-400 text-xs ml-1">
                  {violations.length}/{maxViolations}
                </Text>
              </View>
            )}
            {/* Timer */}
            <View
              className={`flex-row items-center px-3 py-1 rounded-full ${
                timeLeft < 60 ? "bg-red-500/20" : "bg-gray-800/50"
              }`}
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color={timeLeft < 60 ? "#ef4444" : "#9ca3af"}
              />
              <Text
                className={`ml-1 font-mono font-semibold ${
                  timeLeft < 60 ? "text-red-400" : "text-gray-300"
                }`}
              >
                {formatTime(timeLeft)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="px-4 py-2">
        <ProgressBar progress={progress} height="h-1.5" />
        <Text className="text-gray-500 text-xs mt-1 text-right">
          {answeredCount}/{items.length} answered
        </Text>
      </View>

      {/* Question Content */}
      <ScrollView className="flex-1 p-4">
        {renderQuestion(currentItem)}
      </ScrollView>

      {/* Question Navigator */}
      <View className="px-4 py-2 border-t border-gray-800/50">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-2">
            {items.map((item, index) => {
              const isAnswered = answers[item.id] !== undefined;
              const isCurrent = index === currentItemIndex;
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => onSetCurrentItemIndex(index)}
                  className={`w-10 h-10 rounded-lg items-center justify-center ${
                    isCurrent
                      ? "bg-green-600"
                      : isAnswered
                      ? "bg-green-500/30 border border-green-500/50"
                      : "bg-gray-800/50 border border-gray-700/50"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      isCurrent
                        ? "text-white"
                        : isAnswered
                        ? "text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* Navigation */}
      <View className="p-4 border-t border-gray-800/50 flex-row gap-3">
        {currentItemIndex > 0 && (
          <TouchableOpacity
            onPress={() => onSetCurrentItemIndex(currentItemIndex - 1)}
            className="flex-1 py-3 bg-gray-800/50 rounded-lg items-center flex-row justify-center"
          >
            <Ionicons name="chevron-back" size={20} color="#fff" />
            <Text className="text-white font-semibold ml-1">Previous</Text>
          </TouchableOpacity>
        )}
        {isLastItem ? (
          <TouchableOpacity
            onPress={onSubmit}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-green-600 rounded-lg items-center"
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-white font-semibold">Submit Test</Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => onSetCurrentItemIndex(currentItemIndex + 1)}
            className="flex-1 py-3 bg-green-600 rounded-lg items-center flex-row justify-center"
          >
            <Text className="text-white font-semibold mr-1">Next</Text>
            <Ionicons name="chevron-forward" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TestAttempt;
