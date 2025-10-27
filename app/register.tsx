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
    View
} from "react-native";

// Note: You'll need to implement your own useAuth hook
// import { useAuth } from "@/hooks/useAuth";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();
  // const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    username: "",
    studentId: "",
  });

  const handleInputChange = (name: string, value: string) => {
    if (error) setError("");
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: [] }));
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getFieldError = (fieldName: string) => {
    return fieldErrors[fieldName] && fieldErrors[fieldName].length > 0
      ? fieldErrors[fieldName][0]
      : null;
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.firstName.trim()) errors.push("First name is required");
    if (!formData.lastName.trim()) errors.push("Last name is required");
    if (!formData.email.trim()) errors.push("Email is required");
    if (!formData.username.trim()) errors.push("Username is required");
    if (!formData.studentId.trim()) errors.push("Student ID is required");
    if (!formData.password) errors.push("Password is required");
    if (!formData.confirmPassword)
      errors.push("Password confirmation is required");

    if (formData.password !== formData.confirmPassword) {
      errors.push("Passwords do not match");
    }

    if (formData.password && formData.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (!agreedToTerms) {
      errors.push("You must agree to the Terms of Service and Privacy Policy");
    }

    return errors;
  };

  const handleSubmit = async () => {
    setError("");
    setFieldErrors({});

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors[0]);
      return;
    }

    setIsLoading(true);

    try {
      // Implement your registration logic here
      // const deviceName = "mobile_app_" + Platform.OS;
      // const registerData = {
      //   username: formData.username,
      //   email: formData.email,
      //   password: formData.password,
      //   password_confirmation: formData.confirmPassword,
      //   first_name: formData.firstName,
      //   last_name: formData.lastName,
      //   student_id: formData.studentId,
      //   role_id: 2,
      // };
      // const result = await register(registerData, deviceName, false);

      // Mock success - replace with actual logic
      setTimeout(() => {
        // if (result.success) {
        //   router.replace("/dashboard");
        // } else {
        //   if (result.errors) {
        //     setFieldErrors(result.errors);
        //     const firstErrorKey = Object.keys(result.errors)[0];
        //     const firstError = result.errors[firstErrorKey][0];
        //     setError(firstError);
        //   } else {
        //     setError(result.message || "Registration failed. Please check your information.");
        //   }
        // }
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Registration error:", error);
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      {/* Dot Pattern Background */}
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
          contentContainerStyle={{ flexGrow: 1, paddingVertical : 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View
            className="flex-1 justify-center px-6 py-12"
          >
            {/* Header */}
            <View className="mb-8">
              <Text className="text-3xl font-bold text-white text-center mb-2">
                Join CodeKnight
              </Text>
              <Text className="text-gray-400 text-center">
                Create an account to begin your journey
              </Text>
            </View>

            {error ? (
              <View className="mb-6 p-3 bg-red-900/50 border border-red-700 rounded">
                <Text className="text-red-300 text-sm text-center">
                  {error}
                </Text>
              </View>
            ) : null}

            {/* Name Fields */}
            <View className="flex-row gap-4 mb-6">
              <View className="flex-1">
                <Text className="text-sm text-gray-400 mb-2">First Name</Text>
                <View className="relative">
                  <View className="absolute left-3 top-1/2 -translate-y-3 z-10">
                    <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                  </View>
                  <TextInput
                    value={formData.firstName}
                    onChangeText={(text) =>
                      handleInputChange("firstName", text)
                    }
                    editable={!isLoading}
                    placeholder="John"
                    placeholderTextColor="#6B7280"
                    autoCapitalize="words"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-900 border ${
                      getFieldError("first_name")
                        ? "border-red-500"
                        : "border-gray-700"
                    } text-white rounded ${isLoading ? "opacity-50" : ""}`}
                  />
                </View>
                {getFieldError("first_name") && (
                  <Text className="text-red-400 text-xs mt-1">
                    {getFieldError("first_name")}
                  </Text>
                )}
              </View>

              <View className="flex-1">
                <Text className="text-sm text-gray-400 mb-2">Last Name</Text>
                <View className="relative">
                  <View className="absolute left-3 top-1/2 -translate-y-3 z-10">
                    <Ionicons name="person-outline" size={20} color="#9CA3AF" />
                  </View>
                  <TextInput
                    value={formData.lastName}
                    onChangeText={(text) => handleInputChange("lastName", text)}
                    editable={!isLoading}
                    placeholder="Doe"
                    placeholderTextColor="#6B7280"
                    autoCapitalize="words"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-900 border ${
                      getFieldError("last_name")
                        ? "border-red-500"
                        : "border-gray-700"
                    } text-white rounded ${isLoading ? "opacity-50" : ""}`}
                  />
                </View>
                {getFieldError("last_name") && (
                  <Text className="text-red-400 text-xs mt-1">
                    {getFieldError("last_name")}
                  </Text>
                )}
              </View>
            </View>

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
                  onChangeText={(text) => handleInputChange("email", text)}
                  editable={!isLoading}
                  placeholder="your.email@sfxc.edu.ph"
                  placeholderTextColor="#6B7280"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-900 border ${
                    getFieldError("email")
                      ? "border-red-500"
                      : "border-gray-700"
                  } text-white rounded ${isLoading ? "opacity-50" : ""}`}
                />
              </View>
              {getFieldError("email") && (
                <Text className="text-red-400 text-xs mt-1">
                  {getFieldError("email")}
                </Text>
              )}
            </View>

            {/* Username Input */}
            <View className="mb-6">
              <Text className="text-sm text-gray-400 mb-2">Username</Text>
              <View className="relative">
                <View className="absolute left-3 top-1/2 -translate-y-3 z-10">
                  <Ionicons name="at" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  value={formData.username}
                  onChangeText={(text) => handleInputChange("username", text)}
                  editable={!isLoading}
                  placeholder="john_doe123"
                  placeholderTextColor="#6B7280"
                  autoCapitalize="none"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-900 border ${
                    getFieldError("username")
                      ? "border-red-500"
                      : "border-gray-700"
                  } text-white rounded ${isLoading ? "opacity-50" : ""}`}
                />
              </View>
              {getFieldError("username") && (
                <Text className="text-red-400 text-xs mt-1">
                  {getFieldError("username")}
                </Text>
              )}
            </View>

            {/* Student ID Input */}
            <View className="mb-6">
              <Text className="text-sm text-gray-400 mb-2">Student ID</Text>
              <View className="relative">
                <View className="absolute left-3 top-1/2 -translate-y-3 z-10">
                  <Ionicons name="key-outline" size={20} color="#9CA3AF" />
                </View>
                <TextInput
                  value={formData.studentId}
                  onChangeText={(text) => handleInputChange("studentId", text)}
                  editable={!isLoading}
                  placeholder="12-1234"
                  placeholderTextColor="#6B7280"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-900 border ${
                    getFieldError("student_id")
                      ? "border-red-500"
                      : "border-gray-700"
                  } text-white rounded ${isLoading ? "opacity-50" : ""}`}
                />
              </View>
              {getFieldError("student_id") && (
                <Text className="text-red-400 text-xs mt-1">
                  {getFieldError("student_id")}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View className="mb-6">
              <Text className="text-sm text-gray-400 mb-2">Password</Text>
              <View className="relative">
                <View className="absolute left-3 top-1/2 -translate-y-3 z-10">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9CA3AF"
                  />
                </View>
                <TextInput
                  value={formData.password}
                  onChangeText={(text) => handleInputChange("password", text)}
                  editable={!isLoading}
                  placeholder="••••••••"
                  placeholderTextColor="#6B7280"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  className={`w-full pl-10 pr-12 py-3 bg-gray-900 border ${
                    getFieldError("password")
                      ? "border-red-500"
                      : "border-gray-700"
                  } text-white rounded ${isLoading ? "opacity-50" : ""}`}
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
              {getFieldError("password") && (
                <Text className="text-red-400 text-xs mt-1">
                  {getFieldError("password")}
                </Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View className="mb-6">
              <Text className="text-sm text-gray-400 mb-2">
                Confirm Password
              </Text>
              <View className="relative">
                <View className="absolute left-3 top-1/2 -translate-y-3 z-10">
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#9CA3AF"
                  />
                </View>
                <TextInput
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    handleInputChange("confirmPassword", text)
                  }
                  editable={!isLoading}
                  placeholder="••••••••"
                  placeholderTextColor="#6B7280"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  className={`w-full pl-10 pr-12 py-3 bg-gray-900 border ${
                    getFieldError("password_confirmation")
                      ? "border-red-500"
                      : "border-gray-700"
                  } text-white rounded ${isLoading ? "opacity-50" : ""}`}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-3"
                >
                  <Ionicons
                    name={
                      showConfirmPassword ? "eye-off-outline" : "eye-outline"
                    }
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
              {getFieldError("password_confirmation") && (
                <Text className="text-red-400 text-xs mt-1">
                  {getFieldError("password_confirmation")}
                </Text>
              )}
            </View>

            {/* Terms Checkbox */}
            <Pressable
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              disabled={isLoading}
              className="flex-row mb-6"
            >
              <View
                className={`w-4 h-4 border rounded mr-2 mt-1 ${
                  agreedToTerms
                    ? "bg-green-400 border-green-400"
                    : "border-gray-700 bg-gray-900"
                }`}
              >
                {agreedToTerms && (
                  <Ionicons name="checkmark" size={12} color="#000" />
                )}
              </View>
              <Text className="text-sm text-gray-400 flex-1">
                I agree to the{" "}
                <Text className="text-green-400">Terms of Service</Text> and{" "}
                <Text className="text-green-400">Privacy Policy</Text>
              </Text>
            </Pressable>

            {/* Create Account Button */}
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
                    Creating Account...
                  </Text>
                </>
              ) : (
                <>
                  <Text className="text-black font-semibold mr-2">
                    Create Account
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#000" />
                </>
              )}
            </TouchableOpacity>

            {/* Social Login Divider */}
            <View className={`mt-8 mb-6 ${isLoading ? "opacity-50" : ""}`}>
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
                <Text className="text-gray-400 ml-2">Google</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isLoading}
                className="flex-1 flex-row items-center justify-center py-3 px-4 border border-gray-700 rounded"
              >
                <Ionicons name="logo-facebook" size={20} color="#1877F2" />
                <Text className="text-gray-400 ml-2">Facebook</Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View className={`mt-8 ${isLoading ? "opacity-50" : ""}`}>
              <Text className="text-gray-400 text-center text-sm">
                Already have an account?{" "}
                <Link href="/" asChild>
                  <Text className="text-green-400 font-semibold">
                    Sign in
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
