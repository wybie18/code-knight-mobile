import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TooltipProps = {
  visible: boolean;
  content: React.ReactNode;
  onClose: () => void;
  style?: object;
};

export const Tooltip: React.FC<TooltipProps> = ({
  visible,
  content,
  onClose,
  style,
}) => (
  <Modal
    transparent
    visible={visible}
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableOpacity
      style={styles.modalOverlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={[styles.tooltip, style]}>
        {typeof content === "string" ? (
          <Text style={styles.tooltipText}>{content}</Text>
        ) : (
          content
        )}
      </View>
    </TouchableOpacity>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  tooltip: {
    backgroundColor: "#18181b",
    borderRadius: 6,
    padding: 4,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 14,
  },
});
