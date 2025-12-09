import { TestAttempt, TestOverview, TestResult } from "@/components/test";
import { transformToTestResult } from "@/helpers/test/testHelpers";
import { testService } from "@/services/testService";
import type {
  StudentTestStats,
  Test,
  TestAttempt as TestAttemptType,
  TestItem,
  TestResult as TestResultType,
  Violation,
  ViolationType,
} from "@/types/test";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  AppState,
  AppStateStatus,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenState = "loading" | "overview" | "attempt" | "result" | "view_result";

const MAX_VIOLATIONS = 3;

const TestDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const testSlug = id || "";

  // Screen state
  const [screenState, setScreenState] = useState<ScreenState>("loading");
  const [error, setError] = useState<string | null>(null);

  // Test data
  const [test, setTest] = useState<Test | null>(null);
  const [items, setItems] = useState<TestItem[]>([]);
  const [attempt, setAttempt] = useState<TestAttemptType | null>(null);
  const [studentStats, setStudentStats] = useState<StudentTestStats | null>(null);
  const [canStartAttempt, setCanStartAttempt] = useState(false);

  // Attempt state
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Result state
  const [result, setResult] = useState<TestResultType | null>(null);
  const [viewingAttempt, setViewingAttempt] = useState<TestAttemptType | null>(null);

  // Anti-cheat state
  const [violations, setViolations] = useState<Violation[]>([]);
  const [showViolationModal, setShowViolationModal] = useState(false);
  const [lastViolationType, setLastViolationType] = useState<string>("");
  const [isForceSubmit, setIsForceSubmit] = useState(false);

  // Refs
  const appState = useRef(AppState.currentState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch test details on mount
  useEffect(() => {
    fetchTestDetail();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    };
  }, [testSlug]);

  // Anti-cheat: monitor app state
  useEffect(() => {
    if (screenState !== "attempt") return;

    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => subscription.remove();
  }, [screenState, violations.length]);

  // Timer countdown
  useEffect(() => {
    if (screenState !== "attempt" || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAutoSubmit("Time is up!");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [screenState]);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (
        appState.current === "active" &&
        (nextAppState === "background" || nextAppState === "inactive")
      ) {
        recordViolation("app_background");
      }
      appState.current = nextAppState;
    },
    [violations.length]
  );

  const recordViolation = useCallback(
    async (type: ViolationType, details?: string) => {
      const newViolation: Violation = {
        type,
        timestamp: new Date().toISOString(),
        details,
      };

      const updatedViolations = [...violations, newViolation];
      setViolations(updatedViolations);
      setLastViolationType(type);

      if (updatedViolations.length >= MAX_VIOLATIONS) {
        setIsForceSubmit(true);
        setShowViolationModal(true);
        handleAutoSubmit("Maximum violations exceeded");
      } else {
        setShowViolationModal(true);
      }
    },
    [violations, attempt?.id]
  );

  const fetchTestDetail = async () => {
    if (!testSlug) {
      setError("Invalid test ID");
      setScreenState("overview");
      return;
    }

    try {
      setError(null);
      const response = await testService.getTestDetail(testSlug);

      if (response.success) {
        setTest(response.data);
        setStudentStats(response.student_stats);
        setCanStartAttempt(response.can_start_attempt);
        
        const latestAttempt = response.student_stats?.latest_attempt;
        const inProgressAttempt = response.data.attempts?.find(
          (a) => a.status === "in_progress"
        ) || (latestAttempt?.status === "in_progress" ? latestAttempt : null);

        if (inProgressAttempt) {
          await handleResumeAttempt(inProgressAttempt.id);
        } else if (!response.can_start_attempt && latestAttempt && 
                   (latestAttempt.status === "submitted" || latestAttempt.status === "graded")) {
          try {
            const attemptResponse = await testService.getAttemptDetail(testSlug, latestAttempt.id);
            if (attemptResponse.success) {
              const attemptData = attemptResponse.data;
              const totalPoints = attemptData.test?.total_points || response.data.total_points || 0;
              const score = attemptData.total_score ?? 0;
              const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
              const passed = percentage >= 50;
              
              const submissions = attemptData.submissions || [];
              const gradedItems = submissions.filter((sub: any) => sub.score !== null).length;
              const totalItems = attemptData.test?.items?.length || response.data.items?.length || 0;
              const needsManualGrading = gradedItems < totalItems;
              
              setResult({
                score,
                total_points: totalPoints,
                percentage,
                passed,
                needs_manual_grading: needsManualGrading,
                graded_items: gradedItems,
                total_items: totalItems,
              });
              setViewingAttempt(attemptData);
              setScreenState("view_result");
            } else {
              setScreenState("overview");
            }
          } catch (attemptErr) {
            console.error("Error fetching attempt details:", attemptErr);
            setScreenState("overview");
          }
        } else {
          setScreenState("overview");
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to load test details.";
      const statusCode = err.response?.status;
      
      if (statusCode === 404) {
        setError("Test not found. It may have been removed or you don't have access.");
      } else if (statusCode === 401) {
        setError("Please log in to view this test.");
      } else if (statusCode === 403) {
        setError("You don't have permission to view this test.");
      } else {
        setError(errorMessage);
      }
      
      console.error("Error fetching test:", err);
      setScreenState("overview");
    }
  };

  const handleResumeAttempt = async (attemptId: number) => {
    try {
      const response = await testService.getAttemptDetail(testSlug, attemptId);
      if (response.success) {
        const attemptData = response.data;
        setAttempt(attemptData);
        setItems(attemptData.test?.items || []);
        
        const testDuration = attemptData.test?.duration_minutes || 60;
        const startedAt = new Date(attemptData.started_at).getTime();
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startedAt) / 1000);
        const remainingSeconds = Math.max(0, testDuration * 60 - elapsedSeconds);
        setTimeLeft(remainingSeconds);

        const savedAnswers: Record<number, any> = {};
        attemptData.submissions?.forEach((sub: any) => {
          savedAnswers[sub.test_item_id] = sub.answer;
        });
        setAnswers(savedAnswers);

        setScreenState("attempt");
      }
    } catch (err) {
      console.error("Error resuming attempt:", err);
      setScreenState("overview");
    }
  };

  const handleStartTest = async () => {
    if (!canStartAttempt) {
      Alert.alert(
        "Cannot Start Test",
        "You have reached the maximum number of attempts or the test is not available."
      );
      return;
    }

    try {
      const response = await testService.startAttempt(testSlug);
      if (response.success) {
        const attemptData = response.data;
        await handleResumeAttempt(attemptData.id);
        setAnswers({});
        setViolations([]);
        setCurrentItemIndex(0);
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to start test.";
      Alert.alert("Error", message);
      console.error("Error starting test:", err);
    }
  };

  const handleAnswer = useCallback(
    (itemId: number, answer: any) => {
      setAnswers((prev) => ({ ...prev, [itemId]: answer }));

      if (!answer || (typeof answer === 'string' && answer.trim() === '')) {
        return;
      }

      if (!attempt?.id || attempt.status !== 'in_progress') {
        return;
      }

      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
      autoSaveRef.current = setTimeout(async () => {
        if (attempt?.id && attempt.status === 'in_progress' && screenState === 'attempt') {
          try {
            await testService.submitAnswer(testSlug, attempt.id, itemId, answer);
          } catch (err: any) {
            if (err.response?.data?.message?.includes('not in progress')) {
              console.log("Auto-save skipped: attempt no longer in progress");
              return;
            }
            console.error("Error auto-saving answer:", err);
          }
        }
      }, 1000);
    },
    [attempt?.id, attempt?.status, testSlug, screenState]
  );

  const handleAutoSubmit = async (reason: string) => {
    if (!attempt?.id || isSubmitting) return;

    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current);
      autoSaveRef.current = null;
    }

    setIsSubmitting(true);
    try {
      const response = await testService.submitAttempt(testSlug, attempt.id);
      if (response.success) {
        setResult(transformToTestResult(response.data));
        setScreenState("result");
      }
    } catch (err) {
      console.error("Error auto-submitting:", err);
      Alert.alert("Error", "Failed to submit test. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!attempt?.id) return;

    const unansweredCount = items.filter((item) => !answers[item.id]).length;

    if (unansweredCount > 0) {
      Alert.alert(
        "Incomplete Test",
        `You have ${unansweredCount} unanswered question${
          unansweredCount > 1 ? "s" : ""
        }. Are you sure you want to submit?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Submit Anyway", onPress: confirmSubmit },
        ]
      );
    } else {
      confirmSubmit();
    }
  };

  const confirmSubmit = async () => {
    if (!attempt?.id || isSubmitting) return;

    if (autoSaveRef.current) {
      clearTimeout(autoSaveRef.current);
      autoSaveRef.current = null;
    }

    setIsSubmitting(true);
    try {
      const response = await testService.submitAttempt(testSlug, attempt.id);
      if (response.success) {
        setResult(transformToTestResult(response.data));
        setScreenState("result");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to submit test.";
      Alert.alert("Error", message);
      console.error("Error submitting test:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewAttemptResult = async (attemptItem: TestAttemptType) => {
    try {
      const response = await testService.getAttemptDetail(testSlug, attemptItem.id);
      
      if (response.success) {
        const attemptData = response.data;
        const totalPoints = attemptData.test?.total_points || test?.total_points || 0;
        const score = attemptData.total_score ?? 0;
        const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
        const passed = percentage >= 50;
        
        const submissions = attemptData.submissions || [];
        const gradedItems = submissions.filter((sub: any) => sub.score !== null).length;
        const totalItems = attemptData.test?.items?.length || test?.items?.length || 0;
        const needsManualGrading = gradedItems < totalItems;
        
        setResult({
          score,
          total_points: totalPoints,
          percentage,
          passed,
          needs_manual_grading: needsManualGrading,
          graded_items: gradedItems,
          total_items: totalItems,
        });
        setViewingAttempt(attemptData);
        setScreenState("view_result");
      }
    } catch (err) {
      console.error("Error fetching attempt details:", err);
      const totalPoints = test?.total_points || 0;
      const score = attemptItem.total_score ?? 0;
      const percentage = totalPoints > 0 ? (score / totalPoints) * 100 : 0;
      const passed = percentage >= 50;
      
      setResult({
        score,
        total_points: totalPoints,
        percentage,
        passed,
        needs_manual_grading: attemptItem.status === 'submitted',
        graded_items: attemptItem.status === 'graded' ? (test?.items?.length || 0) : 0,
        total_items: test?.items?.length || 0,
      });
      setViewingAttempt(attemptItem);
      setScreenState("view_result");
    }
  };

  const handleBackToOverview = () => {
    setResult(null);
    setViewingAttempt(null);
    setViolations([]);
    setScreenState("overview");
  };

  const handleTryAgain = () => {
    handleBackToOverview();
    setTimeout(handleStartTest, 100);
  };

  // Loading Screen
  if (screenState === "loading") {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-gray-400 mt-4">Loading test...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error Screen
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center px-4">
          <View className="w-16 h-16 bg-red-500/10 rounded-full items-center justify-center mb-4">
            <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
          </View>
          <Text className="text-xl font-semibold text-white mb-2">Error</Text>
          <Text className="text-gray-400 text-center mb-6">{error}</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="px-6 py-3 bg-green-600 rounded-lg"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Result Screen
  if ((screenState === "result" || screenState === "view_result") && result) {
    return (
      <TestResult
        result={result}
        violations={violations}
        viewingAttempt={viewingAttempt}
        isViewingPast={screenState === "view_result"}
        canStartAttempt={canStartAttempt}
        onBack={() => router.back()}
        onBackToOverview={handleBackToOverview}
        onTryAgain={handleTryAgain}
      />
    );
  }

  // Attempt Screen
  if (screenState === "attempt" && items.length > 0) {
    return (
      <TestAttempt
        items={items}
        currentItemIndex={currentItemIndex}
        answers={answers}
        timeLeft={timeLeft}
        violations={violations}
        maxViolations={MAX_VIOLATIONS}
        showViolationModal={showViolationModal}
        lastViolationType={lastViolationType}
        isForceSubmit={isForceSubmit}
        isSubmitting={isSubmitting}
        onAnswer={handleAnswer}
        onSetCurrentItemIndex={setCurrentItemIndex}
        onSubmit={handleSubmit}
        onDismissViolationModal={() => setShowViolationModal(false)}
        onForceSubmit={() => setShowViolationModal(false)}
      />
    );
  }

  // Overview Screen (default)
  if (test) {
    return (
      <TestOverview
        test={test}
        studentStats={studentStats}
        canStartAttempt={canStartAttempt}
        maxViolations={MAX_VIOLATIONS}
        onBack={() => router.back()}
        onStartTest={handleStartTest}
        onResumeAttempt={handleResumeAttempt}
        onViewAttemptResult={handleViewAttemptResult}
      />
    );
  }

  return null;
};

export default TestDetailScreen;
