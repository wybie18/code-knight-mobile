import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({
  visible,
  onClose,
}: PrivacyPolicyModalProps) {
  const lastUpdated = "November 27, 2025";

  const sections: {
    title: string;
    content: { subtitle?: string; text: string }[];
  }[] = [
    {
      title: "1. Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "Name, email address, and username (collected upon registration).",
        },
        {
          subtitle: "Usage Data",
          text: "Pages visited, challenges completed, time spent on activities, and course progress.",
        },
        {
          subtitle: "Technical Data",
          text: "IP address, browser type, device info to ensure security.",
        },
      ],
    },
    {
      title: "2. How We Use Your Information",
      content: [
        {
          text: "To provide personalized learning experiences and track academic progress.",
        },
        {
          text: "To communicate important updates about your account or achievements.",
        },
        {
          text: "To analyze usage patterns and improve the platform.",
        },
        {
          text: "To display usernames on public leaderboards (privacy settings available).",
        },
      ],
    },
    {
      title: "3. Data Security",
      content: [
        {
          text: "We implement industry-standard security measures, including HTTPS encryption and secure password hashing. We never store plain-text passwords.",
        },
      ],
    },
    {
      title: "4. Third-Party Services",
      content: [
        {
          text: "We utilize trusted third-party services like Judge0 for code execution. These partners are bound by strict confidentiality agreements.",
        },
      ],
    },
    {
      title: "5. Your Rights",
      content: [
        {
          text: "You have the right to access, update, or request the deletion of your personal data. Contact support@codeknight.online for assistance.",
        },
      ],
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/90">
        <SafeAreaView className="flex-1">
          <View className="flex-1 bg-gray-900 m-4 rounded-xl overflow-hidden border border-gray-800">
            {/* Header */}
            <View className="flex-row items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
              <Text className="text-white text-lg font-bold">
                Privacy Policy
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
              <Text className="text-gray-400 mb-4">
                Last updated: {lastUpdated}
              </Text>
              <Text className="text-gray-300 mb-6">
                Your privacy is important to us. This policy explains how we
                collect, use, and protect your information.
              </Text>

              {sections.map((section, index) => (
                <View key={index} className="mb-6">
                  <Text className="text-white font-bold text-lg mb-2">
                    {section.title}
                  </Text>
                  {section.content.map((item, idx) => (
                    <View key={idx} className="mb-3">
                      {item.subtitle && (
                        <Text className="text-green-400 font-semibold mb-1">
                          {item.subtitle}
                        </Text>
                      )}
                      <Text className="text-gray-400 leading-5">
                        {item.text}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
              <View className="h-8" />
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
