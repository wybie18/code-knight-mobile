import { useState } from "react";

interface AlertConfig {
  title: string;
  message: string;
  type?: "success" | "error" | "info";
  onConfirm?: () => void;
  cancelText?: string;
  confirmText?: string;
}

export const useCustomAlert = () => {
  const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);

  const showAlert = (config: AlertConfig) => {
    setAlertConfig(config);
  };

  const hideAlert = () => {
    setAlertConfig(null);
  };

  return {
    alertConfig,
    showAlert,
    hideAlert,
  };
};
