import React from "react";
import {
  ActivityIndicator,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle
} from "react-native";

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * PrimaryButton - Solid green button with black text
 */
export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  onPress,
  disabled = false,
  loading = false,
  className = "",
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={`
        flex-row items-center justify-center space-x-2 px-6 py-3
        ${isDisabled ? "bg-gray-400 opacity-70" : "bg-green-400"}
        ${className}
      `}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color="#000000" size="small" />
      ) : (
        <View
          className={`flex-row items-center font-semibold ${isDisabled ? "text-gray-700" : "text-black"}`}
        >
          {children}
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * PrimaryOutlineButton - Outlined green button with green text
 */
export const PrimaryOutlineButton: React.FC<ButtonProps> = ({
  children,
  onPress,
  disabled = false,
  loading = false,
  className = "",
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={`
        flex-row items-center justify-center space-x-2 px-6 py-3 border-2
        ${isDisabled ? "border-gray-400 opacity-70" : "border-green-400"}
        ${className}
      `}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color="#10B981" size="small" />
      ) : (
        <View
          className={`flex-row items-center font-semibold ${isDisabled ? "text-gray-400" : "text-green-400"}`}
        >
          {children}
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * SecondaryButton - Solid gray button with white text
 */
export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  onPress,
  disabled = false,
  loading = false,
  className = "",
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={`
        flex-row items-center justify-center space-x-2 px-6 py-3
        ${isDisabled ? "bg-gray-600 opacity-70" : "bg-gray-700"}
        ${className}
      `}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <View
          className={`flex-row items-center font-semibold ${isDisabled ? "text-gray-400" : "text-white"}`}
        >
          {children}
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * SecondaryOutlineButton - Outlined gray button with gray text
 */
export const SecondaryOutlineButton: React.FC<ButtonProps> = ({
  children,
  onPress,
  disabled = false,
  loading = false,
  className = "",
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={`
        flex-row items-center justify-center space-x-2 px-6 py-3 border-2
        ${isDisabled ? "border-gray-600 opacity-70" : "border-gray-500"}
        ${className}
      `}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color="#9CA3AF" size="small" />
      ) : (
        <View
          className={`flex-row items-center font-semibold ${isDisabled ? "text-gray-600" : "text-gray-300"}`}
        >
          {children}
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * DangerButton - Solid red button with white text
 */
export const DangerButton: React.FC<ButtonProps> = ({
  children,
  onPress,
  disabled = false,
  loading = false,
  className = "",
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={`
        flex-row items-center justify-center space-x-2 px-6 py-3
        ${isDisabled ? "bg-gray-400 opacity-70" : "bg-red-500"}
        ${className}
      `}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <View
          className={`flex-row items-center font-semibold ${isDisabled ? "text-gray-700" : "text-white"}`}
        >
          {children}
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * DangerOutlineButton - Outlined red button with red text
 */
export const DangerOutlineButton: React.FC<ButtonProps> = ({
  children,
  onPress,
  disabled = false,
  loading = false,
  className = "",
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={`
        flex-row items-center justify-center space-x-2 px-6 py-3 border-2
        ${isDisabled ? "border-gray-400 opacity-70" : "border-red-500"}
        ${className}
      `}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color="#EF4444" size="small" />
      ) : (
        <View
          className={`flex-row items-center font-semibold ${isDisabled ? "text-gray-400" : "text-red-500"}`}
        >
          {children}
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * SuccessButton - Solid green button with white text (different from Primary)
 */
export const SuccessButton: React.FC<ButtonProps> = ({
  children,
  onPress,
  disabled = false,
  loading = false,
  className = "",
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={`
        flex-row items-center justify-center space-x-2 px-6 py-3
        ${isDisabled ? "bg-gray-400 opacity-70" : "bg-green-600"}
        ${className}
      `}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" size="small" />
      ) : (
        <View
          className={`flex-row items-center font-semibold ${isDisabled ? "text-gray-700" : "text-white"}`}
        >
          {children}
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * WarningButton - Solid yellow/orange button with black text
 */
export const WarningButton: React.FC<ButtonProps> = ({
  children,
  onPress,
  disabled = false,
  loading = false,
  className = "",
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={`
        flex-row items-center justify-center space-x-2 px-6 py-3
        ${isDisabled ? "bg-gray-400 opacity-70" : "bg-yellow-500"}
        ${className}
      `}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color="#000000" size="small" />
      ) : (
        <View
          className={`flex-row items-center font-semibold ${isDisabled ? "text-gray-700" : "text-black"}`}
        >
          {children}
        </View>
      )}
    </TouchableOpacity>
  );
};

/**
 * GhostButton - Transparent button with text only
 */
export const GhostButton: React.FC<ButtonProps> = ({
  children,
  onPress,
  disabled = false,
  loading = false,
  className = "",
  style,
  textStyle,
}) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      className={`
        flex-row items-center justify-center space-x-2 px-6 py-3
        ${isDisabled ? "opacity-50" : ""}
        ${className}
      `}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color="#10B981" size="small" />
      ) : (
        <View
          className={`flex-row items-center font-semibold ${isDisabled ? "text-gray-500" : "text-green-400"}`}
        >
          {children}
        </View>
      )}
    </TouchableOpacity>
  );
};
