import { StyleSheet } from "react-native";

/**
 * Custom Markdown styles for react-native-markdown-display
 * Optimized for dark theme with green accents
 */
export const markdownStyles = StyleSheet.create({
  body: {
    color: '#D1D5DB', // gray-300
    fontSize: 15,
    lineHeight: 24,
  },
  heading1: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  heading2: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 10,
  },
  heading3: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  paragraph: {
    color: '#D1D5DB', // gray-300
    marginBottom: 12,
    lineHeight: 24,
  },
  listItem: {
    color: '#D1D5DB',
    marginBottom: 6,
  },
  bullet_list: {
    marginBottom: 12,
  },
  ordered_list: {
    marginBottom: 12,
  },
  code_inline: {
    backgroundColor: '#1F2937', // gray-800
    color: '#10B981', // green-500
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: 'monospace',
  },
  code_block: {
    backgroundColor: '#1F2937',
    color: '#D1D5DB',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontSize: 14,
    fontFamily: 'monospace',
  },
  fence: {
    backgroundColor: '#1F2937',
    color: '#D1D5DB',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    fontSize: 14,
    fontFamily: 'monospace',
  },
  strong: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  em: {
    color: '#D1D5DB',
    fontStyle: 'italic',
  },
  link: {
    color: '#10B981', // green-500
    textDecorationLine: 'underline',
  },
  blockquote: {
    backgroundColor: '#1F2937',
    borderLeftColor: '#10B981',
    borderLeftWidth: 4,
    paddingLeft: 12,
    paddingVertical: 8,
    marginVertical: 8,
  },
  hr: {
    backgroundColor: '#374151', // gray-700
    height: 1,
    marginVertical: 16,
  },
  table: {
    borderColor: '#374151',
  },
  thead: {
    backgroundColor: '#1F2937',
  },
  th: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    padding: 8,
    borderColor: '#374151',
  },
  tr: {
    borderColor: '#374151',
  },
  td: {
    color: '#D1D5DB',
    padding: 8,
    borderColor: '#374151',
  },
});
