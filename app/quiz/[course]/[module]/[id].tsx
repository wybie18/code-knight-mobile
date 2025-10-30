import {
  PrimaryButton,
  SecondaryOutlineButton,
  SuccessButton,
} from "@/components/button";
import { getQuizById, submitQuiz } from "@/services/contentService";
import type { QuizQuestion, StudentQuizActivity } from "@/types/course/quiz";
import type { NextContent } from "@/types/navigation/navigation";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuizScreen() {
  const router = useRouter();
  const { course, module, id } = useLocalSearchParams<{
    course: string;
    module: string;
    id: string;
  }>();

  const [activity, setActivity] = useState<StudentQuizActivity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestionSubmitted, setCurrentQuestionSubmitted] =
    useState(false);
  const [currentQuestionCorrect, setCurrentQuestionCorrect] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedSubmissionIndex, setSelectedSubmissionIndex] = useState(0);

  const [nextUrl, setNextUrl] = useState<NextContent | null>(null);

  useEffect(() => {
    const loadQuiz = async () => {
      if (!course || !module || !id) {
        router.push("/courses");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const response = await getQuizById(course, module, id);
        if (response.success) {
          setActivity(response.data);
          setNextUrl(response.next_content || null);
          // Show latest submission if available
          if (
            response.data.submissions &&
            response.data.submissions.length > 0
          ) {
            setShowResults(true);
            setSelectedSubmissionIndex(response.data.submissions.length - 1);
          }
        } else {
          setError("Failed to load quiz data.");
        }
      } catch (err) {
        setError("Failed to load quiz. Please try again.");
        console.error("Error fetching quiz:", err);
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [course, module, id]);

  const currentQuestion = activity?.questions?.[currentQuestionIndex];
  const totalQuestions = activity?.questions?.length || 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleAnswerChange = (value: string, optionIndex?: number) => {
    if (!currentQuestion) return;

    let answerValue = value;
    if (
      currentQuestion.type === "multiple_choice" &&
      optionIndex !== undefined
    ) {
      answerValue = optionIndex.toString();
    }

    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answerValue,
    }));
  };

  const checkAnswer = (question: QuizQuestion, userAnswer: string): boolean => {
    if (!question.correct_answer) return false;

    if (question.type === "multiple_choice") {
      return userAnswer === question.correct_answer;
    }

    return (
      userAnswer.toLowerCase().trim() ===
      question.correct_answer.toLowerCase().trim()
    );
  };

  const handleSubmitAnswer = () => {
    if (!currentQuestion || !answers[currentQuestion.id]) return;

    const userAnswer = answers[currentQuestion.id];
    const isCorrect = checkAnswer(currentQuestion, userAnswer);

    setCurrentQuestionCorrect(isCorrect);
    setCurrentQuestionSubmitted(true);
  };

  const handleNext = async () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setCurrentQuestionSubmitted(false);
      setCurrentQuestionCorrect(false);
    } else {
      await submitQuizResults();
    }
  };

  const submitQuizResults = async () => {
    if (!course || !module || !id || !activity) return;

    try {
      await submitQuiz(activity.id, answers);

      const updatedResponse = await getQuizById(course, module, id);

      if (updatedResponse.success) {
        setActivity(updatedResponse.data);
        setShowResults(true);
        setSelectedSubmissionIndex(updatedResponse.data.submissions.length - 1);
        setAnswers({});
        setCurrentQuestionIndex(0);
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
      setError("Failed to submit quiz. Please try again.");
    }
  };

  const handleRetake = () => {
    setShowResults(false);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setCurrentQuestionSubmitted(false);
    setCurrentQuestionCorrect(false);
  };

  const handleContinue = () => {
    if (!nextUrl) return;
    switch (nextUrl.type) {
      case "lesson":
        router.push(
          `/lesson/${course}/${nextUrl.module.slug}/${nextUrl.content.slug}` as any
        );
        break;
      case "code":
        router.push(
          `/exercise/${course}/${nextUrl.module.slug}/${nextUrl.content.id}` as any
        );
        break;
      case "quiz":
        router.push(
          `/quiz/${course}/${nextUrl.module.slug}/${nextUrl.content.id}` as any
        );
        break;
      case "congratulations":
        router.push(`/course/${course}/congratulations` as any);
        break;
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-gray-400 mt-4">Loading quiz...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-black">
        <View className="flex-1 items-center justify-center p-6">
          <Ionicons name="alert-circle" size={64} color="#EF4444" />
          <Text className="text-red-400 text-lg font-semibold mt-4">
            {error}
          </Text>
          <SecondaryOutlineButton
            onPress={() => router.back()}
            className="mt-6"
          >
            Go Back
          </SecondaryOutlineButton>
        </View>
      </SafeAreaView>
    );
  }

  if (!activity) return null;

  // Results View
  if (showResults && activity.submissions && activity.submissions.length > 0) {
    const currentSubmission = activity.submissions[selectedSubmissionIndex];
    const submissionAnswer = currentSubmission.answer;

    const scorePercentage = Math.round(submissionAnswer.score_percentage);

    let statusInfo: { text: string; color: string; icon: any };

    if (scorePercentage === 100) {
      statusInfo = {
        text: "Perfect Score!",
        color: "text-green-400",
        icon: "trophy",
      };
    } else if (scorePercentage >= 70) {
      statusInfo = {
        text: "Nicely Done!",
        color: "text-green-400",
        icon: "checkmark-circle",
      };
    } else if (scorePercentage >= 50) {
      statusInfo = {
        text: "Almost There!",
        color: "text-yellow-400",
        icon: "star-half",
      };
    } else {
      statusInfo = {
        text: "Keep Studying!",
        color: "text-orange-400",
        icon: "book",
      };
    }

    return (
      <SafeAreaView className="flex-1 bg-black">
        {/* Header */}
        <View className="border-b border-gray-800 px-4 py-3">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#9CA3AF" />
            </TouchableOpacity>
            <Text className="text-white font-semibold text-lg flex-1">
              Quiz Results
            </Text>
          </View>
        </View>

        <ScrollView className="flex-1 bg-black">
          <View className="p-6">
            {/* Hero Section with Icon */}
            <View className="items-center py-6 mb-6">
              <View className="w-20 h-20 rounded-full bg-green-500/20 items-center justify-center mb-4">
                <Ionicons name={statusInfo.icon} size={40} color="#10B981" />
              </View>
              <Text className="text-3xl font-bold text-white mb-2">
                Quiz Results
              </Text>
              <Text className="text-gray-400 text-center">
                {activity.title}
              </Text>
            </View>

            <View className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 mb-6">
              <View className="flex-row items-center justify-center gap-8 mb-6">
                <View className="relative w-36 h-36 items-center justify-center">
                  <View className="absolute w-full h-full rounded-full border-8 border-gray-800" />

                  <View
                    className="absolute w-full h-full rounded-full border-8"
                    style={{
                      transform: [{ rotate: "-90deg" }],
                      borderTopColor:
                        scorePercentage >= 75 ? "#10B981" : "transparent",
                      borderRightColor:
                        scorePercentage >= 25 ? "#10B981" : "transparent",
                      borderBottomColor:
                        scorePercentage >= 50 ? "#10B981" : "transparent",
                      borderLeftColor:
                        scorePercentage > 0 ? "#10B981" : "transparent",
                    }}
                  />

                  <View className="items-center">
                    <Text className="text-4xl font-bold text-white">
                      {scorePercentage}%
                    </Text>
                    <Text className="text-xs text-gray-400 mt-1">Score</Text>
                  </View>
                </View>
              </View>

              {/* Status */}
              <View className="items-center mb-4">
                <Text className={`text-xl font-semibold ${statusInfo.color}`}>
                  {statusInfo.text}
                </Text>
                <Text className="text-gray-400 mt-1">
                  {submissionAnswer.correct_count}/
                  {submissionAnswer.total_questions} correct
                </Text>
              </View>

              {/* Stats Grid */}
              <View className="flex-row gap-3">
                <View className="flex-1 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#10B981"
                    />
                    <Text className="text-gray-400 text-xs">Correct</Text>
                  </View>
                  <Text className="text-green-400 text-2xl font-bold">
                    {submissionAnswer.correct_count}
                  </Text>
                </View>
                <View className="flex-1 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Ionicons name="close-circle" size={16} color="#EF4444" />
                    <Text className="text-gray-400 text-xs">Incorrect</Text>
                  </View>
                  <Text className="text-red-400 text-2xl font-bold">
                    {submissionAnswer.total_questions -
                      submissionAnswer.correct_count}
                  </Text>
                </View>
              </View>
            </View>

            {/* Submission History */}
            {activity.submissions.length > 1 && (
              <View className="mb-6">
                <Text className="text-white font-semibold text-lg mb-3">
                  Attempt History ({activity.submissions.length})
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-3">
                    {[...activity.submissions]
                      .reverse()
                      .map((submission, index) => {
                        const attemptIndex =
                          activity.submissions.length - 1 - index;
                        const isSelected =
                          selectedSubmissionIndex === attemptIndex;
                        return (
                          <TouchableOpacity
                            key={submission.id}
                            onPress={() =>
                              setSelectedSubmissionIndex(attemptIndex)
                            }
                            className={`px-4 py-3 rounded-lg border-2 min-w-[100px] ${
                              isSelected
                                ? "bg-green-500/20 border-green-500"
                                : "bg-gray-800/50 border-gray-700"
                            }`}
                          >
                            <Text
                              className={`text-xs font-medium mb-1 ${
                                isSelected ? "text-green-400" : "text-gray-400"
                              }`}
                            >
                              Attempt {activity.submissions.length - index}
                            </Text>
                            <Text
                              className={`text-lg font-bold ${
                                isSelected ? "text-green-400" : "text-white"
                              }`}
                            >
                              {Math.round(submission.answer.score_percentage)}%
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                  </View>
                </ScrollView>
              </View>
            )}

            {/* Action Buttons */}
            <View className="flex gap-y-3 pb-6">
              <PrimaryButton onPress={handleRetake}>
                <Ionicons name="refresh" size={18} />
                <Text className="ml-2 font-semibold">Retake Quiz</Text>
              </PrimaryButton>
              {nextUrl && (
                <SuccessButton onPress={handleContinue}>
                  <Text className="text-white font-semibold">Continue</Text>
                  <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
                </SuccessButton>
              )}
              <SecondaryOutlineButton
                onPress={() => router.push(`/course/${course}`)}
              >
                <Ionicons name="book-outline" size={16} color="#9CA3AF" />
                <Text className="text-gray-400 ml-2">Back to Course</Text>
              </SecondaryOutlineButton>
            </View>

            {/* Question Review */}
            <View className="mb-6">
              <Text className="text-white font-semibold text-lg mb-3">
                Question Review
              </Text>
              <View className="gap-y-3">
                {activity.questions.map((question, index) => {
                  const userAnswer = Array.isArray(submissionAnswer.answers)
                    ? submissionAnswer.answers[index]
                    : submissionAnswer.answers[question.id];
                  const isCorrect = checkAnswer(question, userAnswer);

                  return (
                    <View
                      key={question.id}
                      className={`bg-gray-900/50 border rounded-lg p-4 ${
                        isCorrect ? "border-green-500/30" : "border-red-500/30"
                      }`}
                    >
                      <View className="flex-row items-start gap-3 mb-3">
                        <View
                          className={`w-8 h-8 rounded-full items-center justify-center ${
                            isCorrect ? "bg-green-500/20" : "bg-red-500/20"
                          }`}
                        >
                          <Ionicons
                            name={isCorrect ? "checkmark" : "close"}
                            size={18}
                            color={isCorrect ? "#10B981" : "#EF4444"}
                          />
                        </View>
                        <View className="flex-1">
                          <Text className="text-gray-400 text-xs mb-1">
                            Question {index + 1}
                          </Text>
                          <Text className="text-white font-medium mb-2">
                            {question.question}
                          </Text>
                        </View>
                      </View>

                      <View className="pl-11 space-y-2">
                        <View>
                          <Text className="text-gray-500 text-xs mb-1">
                            Your Answer:
                          </Text>
                          <Text
                            className={`font-medium ${
                              isCorrect ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {question.type === "multiple_choice" &&
                            question.options
                              ? question.options[parseInt(userAnswer)]
                              : userAnswer}
                          </Text>
                        </View>

                        {!isCorrect && question.correct_answer && (
                          <View>
                            <Text className="text-gray-500 text-xs mb-1">
                              Correct Answer:
                            </Text>
                            <Text className="text-green-400 font-medium">
                              {question.type === "multiple_choice" &&
                              question.options
                                ? question.options[
                                    parseInt(question.correct_answer)
                                  ]
                                : question.correct_answer}
                            </Text>
                          </View>
                        )}

                        {question.explanation && (
                          <View className="bg-gray-800/50 rounded-lg p-3 mt-2">
                            <Text className="text-gray-300 text-sm">
                              {question.explanation}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Quiz Taking View
  if (!currentQuestion) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="border-b border-gray-800 px-4 py-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#9CA3AF" />
            </TouchableOpacity>
            <Text
              className="text-white font-semibold text-base flex-1"
              numberOfLines={1}
            >
              {activity.title}
            </Text>
          </View>
          <View className="bg-green-500/20 px-3 py-1 rounded-full">
            <Text className="text-green-400 text-xs font-medium">
              +{activity.exp_reward} XP
            </Text>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="bg-gray-900/50 px-4 py-3 border-b border-gray-800">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-400 text-sm">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </Text>
          <View className="flex-row items-center gap-1">
            <Ionicons name="star" size={14} color="#EAB308" />
            <Text className="text-yellow-400 text-sm font-medium">
              {currentQuestion.points}{" "}
              {currentQuestion.points === 1 ? "point" : "points"}
            </Text>
          </View>
        </View>
        <View className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <View
            className="h-full bg-green-500 rounded-full"
            style={{
              width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
            }}
          />
        </View>
      </View>

      <ScrollView className="flex-1 bg-black">
        <View className="p-6">
          {/* Question Card */}
          <View className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-6">
            <Text className="text-white text-lg font-semibold leading-relaxed">
              {currentQuestion.question}
            </Text>
          </View>

          {/* Answer Options */}
          <View className="flex gap-y-3">
            {currentQuestion.type === "multiple_choice" &&
              currentQuestion.options && (
                <>
                  {currentQuestion.options.map((option, index) => {
                    const isSelected =
                      answers[currentQuestion.id] === index.toString();
                    const isCorrectOption =
                      currentQuestionSubmitted &&
                      currentQuestion.correct_answer === index.toString();
                    const isWrongSelection =
                      currentQuestionSubmitted &&
                      isSelected &&
                      !isCorrectOption;

                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          !currentQuestionSubmitted &&
                          handleAnswerChange(index.toString(), index)
                        }
                        disabled={currentQuestionSubmitted}
                        className={`p-4 rounded-xl border-2 ${
                          isWrongSelection
                            ? "border-red-500/50 bg-red-500/10"
                            : isCorrectOption
                              ? "border-green-500/50 bg-green-500/10"
                              : isSelected
                                ? "border-green-500 bg-green-500/10"
                                : "border-gray-700 bg-gray-800/30"
                        }`}
                      >
                        <View className="flex-row items-center">
                          <View
                            className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                              isWrongSelection
                                ? "border-red-500 bg-red-500"
                                : isCorrectOption
                                  ? "border-green-500 bg-green-500"
                                  : isSelected
                                    ? "border-green-500 bg-green-500"
                                    : "border-gray-600 bg-transparent"
                            }`}
                          >
                            {isWrongSelection && (
                              <Ionicons
                                name="close"
                                size={16}
                                color="#FFFFFF"
                              />
                            )}
                            {(isCorrectOption ||
                              (isSelected && !currentQuestionSubmitted)) && (
                              <Ionicons
                                name="checkmark"
                                size={16}
                                color="#FFFFFF"
                              />
                            )}
                          </View>
                          <Text
                            className={`flex-1 font-medium ${
                              isWrongSelection
                                ? "text-red-400"
                                : isCorrectOption
                                  ? "text-green-400"
                                  : isSelected
                                    ? "text-green-400"
                                    : "text-gray-300"
                            }`}
                          >
                            {option}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}

            {currentQuestion.type === "fill_blank" && (
              <View className="bg-gray-800/30 border-2 border-gray-700 rounded-xl p-4">
                <TextInput
                  value={answers[currentQuestion.id] || ""}
                  onChangeText={(text) => handleAnswerChange(text)}
                  placeholder="Type your answer here..."
                  placeholderTextColor="#6B7280"
                  editable={!currentQuestionSubmitted}
                  className={`text-white text-base ${
                    currentQuestionSubmitted
                      ? currentQuestionCorrect
                        ? "text-green-400"
                        : "text-red-400"
                      : ""
                  }`}
                  multiline
                />
              </View>
            )}

            {currentQuestion.type === "boolean" && (
              <>
                {["True", "False"].map((option) => {
                  const isSelected = answers[currentQuestion.id] === option;
                  const isCorrectOption =
                    currentQuestionSubmitted &&
                    currentQuestion.correct_answer === option;
                  const isWrongSelection =
                    currentQuestionSubmitted && isSelected && !isCorrectOption;

                  return (
                    <TouchableOpacity
                      key={option}
                      onPress={() =>
                        !currentQuestionSubmitted && handleAnswerChange(option)
                      }
                      disabled={currentQuestionSubmitted}
                      className={`p-4 rounded-xl border-2 ${
                        isWrongSelection
                          ? "border-red-500/50 bg-red-500/10"
                          : isCorrectOption
                            ? "border-green-500/50 bg-green-500/10"
                            : isSelected
                              ? "border-green-500 bg-green-500/10"
                              : "border-gray-700 bg-gray-800/30"
                      }`}
                    >
                      <View className="flex-row items-center">
                        <View
                          className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                            isWrongSelection
                              ? "border-red-500 bg-red-500"
                              : isCorrectOption
                                ? "border-green-500 bg-green-500"
                                : isSelected
                                  ? "border-green-500 bg-green-500"
                                  : "border-gray-600 bg-transparent"
                          }`}
                        >
                          {isWrongSelection && (
                            <Ionicons name="close" size={16} color="#FFFFFF" />
                          )}
                          {(isCorrectOption ||
                            (isSelected && !currentQuestionSubmitted)) && (
                            <Ionicons
                              name="checkmark"
                              size={16}
                              color="#FFFFFF"
                            />
                          )}
                        </View>
                        <Text
                          className={`flex-1 font-medium ${
                            isWrongSelection
                              ? "text-red-400"
                              : isCorrectOption
                                ? "text-green-400"
                                : isSelected
                                  ? "text-green-400"
                                  : "text-gray-300"
                          }`}
                        >
                          {option}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}
          </View>

          {/* Feedback */}
          {currentQuestionSubmitted && (
            <View
              className={`mt-6 p-4 rounded-xl border-2 ${
                currentQuestionCorrect
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <View className="flex-row items-start gap-3">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    currentQuestionCorrect ? "bg-green-500/20" : "bg-red-500/20"
                  }`}
                >
                  <Ionicons
                    name={
                      currentQuestionCorrect
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={20}
                    color={currentQuestionCorrect ? "#10B981" : "#EF4444"}
                  />
                </View>
                <View className="flex-1">
                  <Text
                    className={`font-semibold text-base mb-1 ${
                      currentQuestionCorrect ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {currentQuestionCorrect ? "Correct!" : "Incorrect"}
                  </Text>
                  {currentQuestion.explanation && (
                    <Text className="text-gray-300 text-sm leading-relaxed">
                      {currentQuestion.explanation}
                    </Text>
                  )}
                  {!currentQuestion.explanation && (
                    <Text className="text-gray-300 text-sm leading-relaxed">
                      {currentQuestionCorrect
                        ? "Great job! Your answer is correct."
                        : "Review the material and try again next time."}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Action Button */}
      <View className="border-t border-gray-800 px-4 py-3 bg-black">
        {!currentQuestionSubmitted ? (
          <PrimaryButton
            onPress={handleSubmitAnswer}
            disabled={!answers[currentQuestion.id]}
          >
            <Text className="text-white font-semibold">Submit Answer</Text>
          </PrimaryButton>
        ) : (
          <PrimaryButton onPress={handleNext}>
            <Text className="text-white font-semibold mr-2">
              {isLastQuestion ? "View Results" : "Next Question"}
            </Text>
            <Ionicons name="chevron-forward" size={18} color="#FFFFFF" />
          </PrimaryButton>
        )}
      </View>
    </SafeAreaView>
  );
}
