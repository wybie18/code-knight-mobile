import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, hasRole } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Implement your login logic here
      const result = await login(formData.email, formData.password, "mobile_app", remember);

      if (result.success) {
        if (!hasRole("admin")) {
          // router.replace("/(tabs)/");
        }else{
          setError("Login failed. Please check your credentials.");
        }
      } else {
        setError(
          result.message || "Login failed. Please check your credentials."
        );
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      
      <View className="absolute inset-0 opacity-20">
        {Array.from({ length: 100 }).map((_, i) => (
          <View
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full"
            style={{
              left: `${(i % 10) * 10}%`,
              top: `${Math.floor(i / 10) * 10}%`,
            }}
          />
        ))}
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            className="flex-1 justify-center px-6 py-12"
          >
            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-white text-center mb-2">
                Welcome Back
              </Text>
              <Text className="text-gray-400 text-center">
                Sign in to continue your journey
              </Text>
            </View>

            {error ? (
              <View className="mb-6 p-3 bg-red-900/50 border border-red-700 rounded">
                <Text className="text-red-300 text-sm text-center">
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Email Input */}
            <View className="mb-6">
              <Text className="text-sm text-gray-400 mb-2">Email Address</Text>
              <View className="relative">
                <View className="absolute left-3 top-1/2 -translate-y-3 z-10">
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={20}
                    color="#9CA3AF"
                  />
                </View>
                <TextInput
                  value={formData.email}
                  onChangeText={(text) => {
                    setFormData({ ...formData, email: text });
                    if (error) setError("");
                  }}
                  editable={!isLoading}
                  placeholder="your.email@sfxc.edu.ph"
                  placeholderTextColor="#6B7280"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 text-white rounded ${
                    isLoading ? "opacity-50" : ""
                  }`}
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-sm text-gray-400 mb-2">Password</Text>
              <View className="relative">
                <View className="absolute left-3 top-1/2 -translate-y-3 z-10">
                  <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  value={formData.password}
                  onChangeText={(text) => {
                    setFormData({ ...formData, password: text });
                    if (error) setError("");
                  }}
                  editable={!isLoading}
                  placeholder="••••••••"
                  placeholderTextColor="#6B7280"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  className={`w-full pl-10 pr-12 py-3 bg-gray-900 border border-gray-700 text-white rounded ${
                    isLoading ? "opacity-50" : ""
                  }`}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-3"
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me & Forgot Password */}
            <View className="flex-row justify-between items-center mb-6">
              <Pressable
                onPress={() => setRemember(!remember)}
                disabled={isLoading}
                className="flex-row items-center"
              >
                <View
                  className={`w-4 h-4 border rounded mr-2 ${
                    remember
                      ? "bg-green-400 border-green-400"
                      : "border-gray-700 bg-gray-900"
                  }`}
                >
                  {remember && (
                    <Ionicons name="checkmark" size={12} color="#000" />
                  )}
                </View>
                <Text className="text-sm text-gray-400">Remember me</Text>
              </Pressable>
              <Pressable disabled={isLoading}>
                <Text
                  className={`text-sm text-green-400 ${
                    isLoading ? "opacity-50" : ""
                  }`}
                >
                  Forgot password?
                </Text>
              </Pressable>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              className={`bg-green-400 py-4 px-4 rounded flex-row items-center justify-center ${
                isLoading ? "opacity-50" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator color="#000" className="mr-2" />
                  <Text className="text-black font-semibold">
                    Signing In...
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-black font-semibold mr-2">
                    Sign In
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#000" />
                </>
              )}
            </TouchableOpacity>

            {/* Social Login Divider */}
            <View
              className={`mt-8 mb-6 ${isLoading ? "opacity-50" : ""}`}
            >
              <View className="flex-row items-center">
                <View className="flex-1 h-px bg-gray-700" />
                <Text className="px-4 text-gray-400 text-sm">
                  Or continue with
                </Text>
                <View className="flex-1 h-px bg-gray-700" />
              </View>
            </View>

            {/* Social Login Buttons */}
            <View
              className={`flex-row justify-between gap-4 ${
                isLoading ? "opacity-50" : ""
              }`}
            >
              <TouchableOpacity
                disabled={isLoading}
                className="flex-1 flex-row items-center justify-center py-3 px-4 border border-gray-700 rounded"
              >
                <AntDesign name="google" size={20} color="#fff" />
                <Text className="text-gray-400 ml-2 hidden sm:flex">
                  Google
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                className="flex-1 flex-row items-center justify-center py-3 px-4 border border-gray-700 rounded"
              >
                <Ionicons name="logo-facebook" size={20} color="#1877F2" />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                className="flex-1 flex-row items-center justify-center py-3 px-4 border border-gray-700 rounded"
              >
                <AntDesign name="github" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View
              className={`mt-8 ${isLoading ? "opacity-50" : ""}`}
            >
              <Text className="text-gray-400 text-center text-sm">
                New to CodeKnight?{" "}
                <Link href={"/register"} asChild>
                  <Text className="text-green-400 font-semibold">
                    Create an account
                  </Text>
                </Link>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}