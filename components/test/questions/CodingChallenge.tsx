import GamifiedCard from "@/components/card/GamifiedCard";
import { MonacoEditor } from "@/components/editor";
import type {
    CodingChallenge as CodingChallengeType,
    TestItem,
} from "@/types/test";
import React from "react";
import { Text, View } from "react-native";

interface CodingChallengeProps {
  item: TestItem;
  challenge: CodingChallengeType;
  currentAnswer: any;
  onAnswer: (itemId: number, answer: any) => void;
}

const CodingChallenge: React.FC<CodingChallengeProps> = ({
  item,
  challenge,
  currentAnswer,
  onAnswer,
}) => {
  const savedAnswer = currentAnswer;
  const currentCode =
    typeof savedAnswer === "object" ? savedAnswer?.code : savedAnswer || "";
  const languageConfig = challenge.programming_languages?.[0];
  const starterCode = languageConfig?.starter_code || "";

  const handleCodeChange = (code: string) => {
    const answerData = {
      code: code,
      language_id: languageConfig?.language_id || languageConfig?.id,
    };
    onAnswer(item.id, JSON.stringify(answerData));
  };

  return (
    <View>
      <GamifiedCard className="mb-4">
        <Text className="text-white text-lg mb-2">Coding Challenge</Text>
        <Text className="text-gray-300">{challenge.problem_statement}</Text>
      </GamifiedCard>

      <View className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
        <View className="bg-gray-900/50 px-4 py-2 border-b border-gray-700/50 flex-row justify-between items-center">
          <Text className="text-gray-400 text-sm">Your Solution</Text>
          {languageConfig && (
            <Text className="text-green-400 text-xs">
              {languageConfig.name}
            </Text>
          )}
        </View>
        <MonacoEditor
          key={`editor-${challenge.id}`}
          value={currentCode || starterCode}
          onChange={handleCodeChange}
          language={
            challenge.programming_languages?.[0]?.name.toLowerCase() as
              | "python"
              | "javascript"
              | "typescript"
              | "java"
              | "cpp"
              | "c"
              | "csharp"
          }
        />
      </View>
    </View>
  );
};

export default CodingChallenge;
