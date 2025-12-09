import GamifiedCard from "@/components/card/GamifiedCard";
import { MonacoEditor } from "@/components/editor";
import { starterCodeTemplates } from "@/constants/starterCodeTemplates";
import { playgroundService } from "@/services/playgroundService";
import type { ProgrammingLanguage } from "@/types/playground";
import {
    Feather,
    FontAwesome5,
    Ionicons,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Keyboard,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PLAYGROUND_CODE_PREFIX = "playground_code_";

const PlaygroundScreen = () => {
  const router = useRouter();
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
  const [selectedLanguageIndex, setSelectedLanguageIndex] = useState<number>(0);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"editor" | "output">("editor");
  const [isChangingLanguage, setIsChangingLanguage] = useState(false);

  const selectedLanguage = languages[selectedLanguageIndex] || null;

  const getStarterCode = useCallback((language: ProgrammingLanguage): string => {
    return starterCodeTemplates[language.name] || language.boilerplate_code || "";
  }, []);

  const saveCodeToStorage = useCallback(async (languageId: number, codeToSave: string) => {
    try {
      await AsyncStorage.setItem(
        `${PLAYGROUND_CODE_PREFIX}${languageId}`,
        codeToSave
      );
    } catch (err) {
      console.error("Error saving code to storage:", err);
    }
  }, []);

  const loadCodeFromStorage = useCallback(async (languageId: number): Promise<string | null> => {
    try {
      const savedCode = await AsyncStorage.getItem(
        `${PLAYGROUND_CODE_PREFIX}${languageId}`
      );
      return savedCode;
    } catch (err) {
      console.error("Error loading code from storage:", err);
      return null;
    }
  }, []);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await playgroundService.getLanguages();
        if (response.success && response.data.length > 0) {
          setLanguages(response.data);
          const defaultLang = response.data[0];
          const savedCode = await loadCodeFromStorage(defaultLang.id);
          setCode(savedCode || starterCodeTemplates[defaultLang.name] || defaultLang.boilerplate_code || "");
        }
      } catch (err) {
        setError("Failed to load programming languages.");
        console.error("Error fetching languages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLanguages();
  }, [loadCodeFromStorage]);

  useEffect(() => {
    if (selectedLanguage && code) {
      const timeoutId = setTimeout(() => {
        saveCodeToStorage(selectedLanguage.id, code);
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [code, selectedLanguage, saveCodeToStorage]);

  const handleLanguageChange = useCallback(async (index: number) => {
    // Prevent rapid consecutive changes or same language selection
    if (isChangingLanguage || index === selectedLanguageIndex) return;
    
    setIsChangingLanguage(true);
    
    try {
      // Save current code before switching
      if (selectedLanguage) {
        await saveCodeToStorage(selectedLanguage.id, code);
      }

      const newLanguage = languages[index];
      if (!newLanguage) {
        setIsChangingLanguage(false);
        return;
      }
      
      // Load persisted code for new language
      const savedCode = await loadCodeFromStorage(newLanguage.id);
      const newCode = savedCode || starterCodeTemplates[newLanguage.name] || newLanguage.boilerplate_code || "";
      
      // Update state synchronously together
      setSelectedLanguageIndex(index);
      setCode(newCode);
      setOutput("");
    } catch (err) {
      console.error("Error changing language:", err);
    } finally {
      setIsChangingLanguage(false);
    }
  }, [isChangingLanguage, selectedLanguageIndex, selectedLanguage, languages, code, saveCodeToStorage, loadCodeFromStorage]);

  const executeCode = async () => {
    if (!selectedLanguage) {
      setOutput("Please select a programming language first.");
      return;
    }

    Keyboard.dismiss();
    setOutput("Running...");
    setIsRunning(true);
    setActiveTab("output");

    try {
      const response = await playgroundService.executeCode(
        selectedLanguage.id,
        code
      );

      if (response.success) {
        const result = response.data;
        let displayOutput = "";

        if (result.success) {
          if (result.output) {
            displayOutput = result.output;
          } else {
            displayOutput = "Code executed successfully with no output.";
          }

          if (result.execution_time || result.memory_usage) {
            displayOutput += "\n\n--- Execution Stats ---";
            if (result.execution_time) {
              displayOutput += `\nExecution Time: ${result.execution_time}s`;
            }
            if (result.memory_usage) {
              displayOutput += `\nMemory Usage: ${result.memory_usage} KB`;
            }
          }
          if (result.stderr && result.stderr.trim()) {
            displayOutput += "\n\n--- Warnings ---\n" + result.stderr;
          }
        } else {
          displayOutput = "❌ Execution Failed\n\n";

          if (result.error) {
            displayOutput += `Error: ${result.error}\n`;
          }

          if (result.stderr && result.stderr.trim()) {
            displayOutput += "\n--- Error Details ---\n" + result.stderr;
          }

          if (result.output && result.output.trim()) {
            displayOutput += "\n--- Partial Output ---\n" + result.output;
          }
        }

        setOutput(displayOutput);
      } else {
        setOutput("Code execution failed. Please try again.");
      }
    } catch (err) {
      setOutput("❌ Request Failed\nCode execution failed. Please try again.");
      console.error("Execution error:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const clearCode = () => {
    if (selectedLanguage) {
      setCode(starterCodeTemplates[selectedLanguage.name] || selectedLanguage.boilerplate_code || "");
    } else {
      setCode("");
    }
    setOutput("");
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-gray-400 mt-4">Loading playground...</Text>
      </View>
    );
  }

  if (error) {
    return (
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
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black" edges={["top", "bottom"]}>
      <View className="px-4 py-4 border-b border-gray-800/50">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text className="text-xl font-bold text-white">Playground</Text>
              <Text className="text-gray-400 text-xs">
                Write and run code
              </Text>
            </View>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={clearCode}
              className="p-2 bg-gray-800/50 rounded-lg"
            >
              <MaterialCommunityIcons name="eraser" size={20} color="#9ca3af" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={executeCode}
              disabled={isRunning}
              className={`flex-row items-center px-4 py-2 rounded-lg ${
                isRunning ? "bg-gray-700" : "bg-green-600"
              }`}
            >
              {isRunning ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Feather name="play" size={16} color="#fff" />
                  <Text className="text-white font-semibold ml-1">Run</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Language Selector */}
      {languages.length > 0 && (
        <View className="px-4 py-3 border-b border-gray-800/50 bg-gray-900/40">
          <Text className="text-gray-400 text-xs mb-2">
            Select Language:
          </Text>
          <View className="border-b border-gray-600/50 bg-transparent">
            <Picker
              selectedValue={selectedLanguageIndex}
              onValueChange={(itemValue) => {
                if (itemValue !== selectedLanguageIndex) {
                  handleLanguageChange(itemValue);
                }
              }}
              style={{
                color: "#FFFFFF",
                backgroundColor: "transparent",
              }}
              dropdownIconColor="#10B981"
              enabled={!isChangingLanguage}
            >
              {languages.map((lang, index) => (
                <Picker.Item
                  key={lang.id}
                  label={lang.name}
                  value={index}
                />
              ))}
            </Picker>
          </View>
        </View>
      )}

      {/* Tab Switcher */}
      <View className="flex-row border-b border-gray-800/50">
        <TouchableOpacity
          onPress={() => setActiveTab("editor")}
          className={`flex-1 py-3 items-center ${
            activeTab === "editor" ? "border-b-2 border-green-500" : ""
          }`}
        >
          <View className="flex-row items-center">
            <Feather
              name="edit-3"
              size={16}
              color={activeTab === "editor" ? "#22c55e" : "#9ca3af"}
            />
            <Text
              className={`ml-2 font-medium ${
                activeTab === "editor" ? "text-green-400" : "text-gray-400"
              }`}
            >
              Editor
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab("output")}
          className={`flex-1 py-3 items-center ${
            activeTab === "output" ? "border-b-2 border-green-500" : ""
          }`}
        >
          <View className="flex-row items-center">
            <FontAwesome5
              name="terminal"
              size={14}
              color={activeTab === "output" ? "#22c55e" : "#9ca3af"}
            />
            <Text
              className={`ml-2 font-medium ${
                activeTab === "output" ? "text-green-400" : "text-gray-400"
              }`}
            >
              Output
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View className="flex-1">
        {activeTab === "editor" ? (
          <View className="flex-1 bg-black">
            <MonacoEditor
              key={`editor-${selectedLanguageIndex}`}
              value={code}
              onChange={setCode}
              language={selectedLanguage?.name.toLowerCase() as "python" | "javascript" | "typescript" | "java" | "cpp" | "c" | "csharp"}
            />
          </View>
        ) : (
          <ScrollView className="flex-1 p-4">
            <GamifiedCard
              title="Console Output"
              icon={<FontAwesome5 name="terminal" size={16} color="#22c55e" />}
            >
              {output ? (
                <Text className="text-green-100 font-mono text-sm whitespace-pre-wrap">
                  {output}
                </Text>
              ) : (
                <View className="items-center py-8">
                  <FontAwesome5 name="terminal" size={32} color="#6b7280" />
                  <Text className="text-gray-500 mt-3">
                    Run your code to see output
                  </Text>
                </View>
              )}
            </GamifiedCard>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

export default PlaygroundScreen;
