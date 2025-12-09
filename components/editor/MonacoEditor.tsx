import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";

interface MonacoEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?:
    | "python"
    | "javascript"
    | "typescript"
    | "java"
    | "cpp"
    | "c"
    | "csharp";
  readOnly?: boolean;
}

export const MonacoEditor: React.FC<MonacoEditorProps> = ({
  value,
  onChange,
  language = "python",
  readOnly = false,
}) => {
  const webViewRef = useRef<WebView>(null);
  const [isReady, setIsReady] = useState(false);
  const initialValueRef = useRef(value);
  const lastChangeRef = useRef(value);

  useEffect(() => {
    if (isReady && webViewRef.current && value !== lastChangeRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({ type: "setValue", value })
      );
      lastChangeRef.current = value;
    }
  }, [value, isReady]);

  useEffect(() => {
    if (isReady && webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({ type: "setReadOnly", readOnly })
      );
    }
  }, [readOnly, isReady]);

  useEffect(() => {
    if (isReady && webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({ type: "setLanguage", language })
      );
    }
  }, [language, isReady]);

  const handleMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === "change") {
        lastChangeRef.current = message.value;
        onChange(message.value);
      } else if (message.type === "ready") {
        setIsReady(true);
        if (webViewRef.current) {
          webViewRef.current.postMessage(JSON.stringify({ type: "focus" }));
        }
      }
    } catch (error) {
      console.error("Error parsing message from Monaco:", error);
    }
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <style>
        * {
          -webkit-user-select: text;
          -webkit-touch-callout: default;
          -webkit-tap-highlight-color: transparent;
        }
        body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          background-color: #1e1e1e;
          -webkit-user-select: text;
          user-select: text;
          touch-action: none;
          overscroll-behavior: none;
        }
        #container {
          width: 100vw;
          height: 100vh;
        }
        .monaco-editor .inputarea.ime-input {
          z-index: 1000 !important;
        }
      </style>
    </head>
    <body>
      <div id="container"></div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs/loader.min.js"></script>
      <script>
        require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
        
        let editor;
        let isChangingFromReactNative = false;
        let changeTimeout = null;
        let lastSentValue = ${JSON.stringify(initialValueRef.current)};
        let pendingValue = null;
        
        require(['vs/editor/editor.main'], function() {
          editor = monaco.editor.create(document.getElementById('container'), {
            value: lastSentValue,
            language: '${language}',
            theme: 'vs-dark',
            readOnly: ${readOnly},
            automaticLayout: true,
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            wordWrap: 'off',
            wrappingIndent: 'none',
            padding: { top: 10, bottom: 10 },
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            tabSize: 4,
            insertSpaces: true,
            selectOnLineNumbers: true,
            roundedSelection: false,
            cursorStyle: 'line',
            contextmenu: false,
            scrollbar: {
                useShadows: false,
                verticalHasArrows: false,
                horizontalHasArrows: false,
                vertical: 'visible',
                horizontal: 'visible',
                verticalScrollbarSize: 12,
                horizontalScrollbarSize: 12,
            },
          });

          // Focus editor immediately and ensure keyboard shows
          editor.focus();
          
          // Force focus on container click
          document.getElementById('container').addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            editor.focus();
          });

          document.getElementById('container').addEventListener('touchstart', function(e) {
            e.stopPropagation();
            editor.focus();
          });

          // Debounced change handler to prevent missing characters during fast typing/deleting
          editor.onDidChangeModelContent(() => {
            if (isChangingFromReactNative) return;
            
            const currentValue = editor.getValue();
            pendingValue = currentValue;
            
            // Clear previous timeout
            if (changeTimeout) {
              clearTimeout(changeTimeout);
            }
            
            // Debounce: wait for typing to settle before sending to React Native
            changeTimeout = setTimeout(() => {
              if (pendingValue !== null && pendingValue !== lastSentValue) {
                lastSentValue = pendingValue;
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'change',
                  value: pendingValue
                }));
              }
              pendingValue = null;
            }, 100);
          });

          // Notify React Native that editor is ready
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'ready'
          }));

          // Handle messages from React Native
          document.addEventListener('message', (event) => {
            handleMessage(event.data);
          });

          window.addEventListener('message', (event) => {
            handleMessage(event.data);
          });

          function handleMessage(data) {
            try {
              const message = JSON.parse(data);
              
              if (message.type === 'setValue' && editor) {
                // Cancel any pending change to avoid conflicts
                if (changeTimeout) {
                  clearTimeout(changeTimeout);
                  changeTimeout = null;
                }
                pendingValue = null;
                
                // Only update if value actually changed
                const currentValue = editor.getValue();
                if (currentValue !== message.value) {
                  isChangingFromReactNative = true;
                  
                  // Use pushEditOperations for smoother updates
                  const fullRange = editor.getModel().getFullModelRange();
                  editor.executeEdits('setValue', [{
                    range: fullRange,
                    text: message.value,
                    forceMoveMarkers: true
                  }]);
                  
                  lastSentValue = message.value;
                  
                  // Reset flag after a short delay to ensure the change event is ignored
                  setTimeout(() => {
                    isChangingFromReactNative = false;
                  }, 10);
                }
              } else if (message.type === 'setReadOnly' && editor) {
                editor.updateOptions({ readOnly: message.readOnly });
              } else if (message.type === 'setLanguage' && editor) {
                const model = editor.getModel();
                if (model) {
                  monaco.editor.setModelLanguage(model, message.language);
                }
              } else if (message.type === 'focus' && editor) {
                editor.focus();
              }
            } catch (error) {
              console.error('Error handling message:', error);
            }
          }

          // Prevent focus loss
          document.addEventListener('blur', function(e) {
            setTimeout(() => {
              if (document.activeElement !== editor.getDomNode()) {
                editor.focus();
              }
            }, 50);
          }, true);
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View className="flex-1 bg-[#1e1e1e]">
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html }}
        onMessage={handleMessage}
        className="flex-1 bg-[#1e1e1e]"
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState={false}
        keyboardDisplayRequiresUserAction={false}
        allowsInlineMediaPlayback
        mediaPlaybackRequiresUserAction={false}
        scrollEnabled={false}
        bounces={false}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        onLoadEnd={() => {
          if (webViewRef.current) {
            setTimeout(() => {
              webViewRef.current?.postMessage(JSON.stringify({ type: "focus" }));
            }, 50);
          }
        }}
        renderLoading={() => (
          <View className="absolute inset-0 justify-center items-center bg-[#1e1e1e]">
            <ActivityIndicator size="large" color="#0ea5e9" />
          </View>
        )}
      />
    </View>
  );
};

