import { useTheme } from "@/contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

export default function FeedbackScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [feedbackType, setFeedbackType] = useState<string>("suggestion");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const feedbackTypes = [
    { id: "suggestion", label: "Suggestion", icon: "💡" },
    { id: "bug", label: "Bug Report", icon: "🐛" },
    { id: "feature", label: "Feature Request", icon: "✨" },
    { id: "other", label: "Other", icon: "💬" },
  ];

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    // In production, this would send to your backend API
    Alert.alert(
      "Thank You!",
      "Your feedback has been received. We appreciate your input and will review it carefully.",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );

    // Reset form
    setFeedbackType("suggestion");
    setSubject("");
    setMessage("");
    setEmail("");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={[styles.backIcon, { color: colors.primary }]}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Send Feedback
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            Help us improve the app
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Intro Card */}
            <View
              style={[
                styles.introCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <Text style={styles.introIcon}>🙏</Text>
              <Text style={[styles.introText, { color: colors.text }]}>
                Your feedback is valuable! Share your thoughts, report issues,
                or suggest new features to help us make the app better for
                everyone.
              </Text>
            </View>

            {/* Feedback Type Section */}
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.textSecondary }]}
              >
                FEEDBACK TYPE
              </Text>
              <View style={styles.typeGrid}>
                {feedbackTypes.map((type) => (
                  <TouchableOpacity
                    key={type.id}
                    style={[
                      styles.typeCard,
                      {
                        backgroundColor:
                          feedbackType === type.id
                            ? colors.primary
                            : colors.card,
                        borderColor:
                          feedbackType === type.id
                            ? colors.primary
                            : colors.border,
                      },
                    ]}
                    activeOpacity={0.7}
                    onPress={() => setFeedbackType(type.id)}
                  >
                    <Text style={styles.typeIcon}>{type.icon}</Text>
                    <Text
                      style={[
                        styles.typeLabel,
                        {
                          color:
                            feedbackType === type.id ? "#ffffff" : colors.text,
                        },
                      ]}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Form Section */}
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, { color: colors.textSecondary }]}
              >
                YOUR FEEDBACK
              </Text>

              {/* Subject Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Subject <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  placeholder="Brief description of your feedback"
                  placeholderTextColor={colors.textSecondary}
                  value={subject}
                  onChangeText={setSubject}
                />
              </View>

              {/* Message Input */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Message <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  placeholder="Tell us more about your feedback..."
                  placeholderTextColor={colors.textSecondary}
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>

              {/* Email Input (Optional) */}
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  Email{" "}
                  <Text
                    style={[styles.optional, { color: colors.textSecondary }]}
                  >
                    (Optional)
                  </Text>
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  placeholder="your.email@example.com"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Text style={[styles.hint, { color: colors.textSecondary }]}>
                  We&apos;ll only use this to follow up if needed
                </Text>
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              activeOpacity={0.8}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>Send Feedback</Text>
            </TouchableOpacity>

            {/* Bottom Spacing */}
            <View style={{ height: 40 }} />
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  backIcon: {
    fontSize: 36,
    fontWeight: "300",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  introCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  introIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  introText: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  typeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  typeCard: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  typeLabel: {
    fontSize: 13,
    fontWeight: "600",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  required: {
    color: "#ef4444",
  },
  optional: {
    fontSize: 13,
    fontWeight: "400",
  },
  input: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    fontSize: 15,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  textArea: {
    height: 120,
    paddingTop: 16,
  },
  hint: {
    fontSize: 12,
    marginTop: 6,
    paddingHorizontal: 4,
  },
  submitButton: {
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
