import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface TermsOfServiceModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TermsOfServiceModal({
  visible,
  onClose,
}: TermsOfServiceModalProps) {
  const lastUpdated = "November 27, 2025";

  const sections: {
    title: string;
    content: { subtitle?: string; text: string }[];
  }[] = [
    {
      title: "1. Acceptance of Terms",
      content: [
        {
          text: "By accessing CodeKnight, you agree to these Terms and our Privacy Policy. The platform is intended for educational purposes.",
        },
      ],
    },
    {
      title: "2. Account Registration",
      content: [
        {
          text: "You must be at least 13 years old to use this service. You are responsible for maintaining the security of your account credentials.",
        },
      ],
    },
    {
      title: "3. Code of Conduct",
      content: [
        {
          subtitle: "Academic Integrity",
          text: "You agree to complete challenges honestly. Cheating, sharing solutions, or using unauthorized assistance is prohibited.",
        },
        {
          subtitle: "Respect",
          text: "Harassment or abusive behavior toward other students or instructors will result in account suspension.",
        },
        {
          subtitle: "Security",
          text: "You agree not to attempt to circumvent security measures or disrupt the service.",
        },
      ],
    },
    {
      title: "4. Intellectual Property",
      content: [
        {
          subtitle: "Platform Content",
          text: "All course materials and logos are owned by CodeKnight.",
        },
        {
          subtitle: "User Content",
          text: "You retain ownership of the code you write, but grant us a license to run and test it for evaluation purposes.",
        },
      ],
    },
    {
      title: "5. Disclaimer",
      content: [
        {
          text: 'The services are provided "AS IS" without warranties. We do not guarantee that the platform will be uninterrupted or error-free.',
        },
      ],
    },
    {
      title: "6. Termination",
      content: [
        {
          text: "We reserve the right to suspend accounts that violate these terms or engage in fraudulent activity.",
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
                Terms of Service
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
                Please read these terms carefully before using CodeKnight.
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
