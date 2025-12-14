import { useTheme } from "@/contexts/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FAQItem {
  question: string;
  answer: string;
}

export default function HelpScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: "How do I start tracking a session?",
      answer:
        "Tap the 'Start Session' button on the Counter tab. During your training, tap the counter button each time you complete a rep. When finished, tap 'End Session' to save your activity details including type, intensity, mood, and notes.",
    },
    {
      question: "What activity types can I track?",
      answer:
        "You can track various martial arts activities including Kicks, Punches, Drills, Sparring, and more. You can also add custom activity types to match your specific training routine.",
    },
    {
      question: "How do I add notes to my sessions?",
      answer:
        "After ending a session, you'll see a modal where you can select the activity type, rate intensity (1-5), choose your mood, add context, and write notes about your training session.",
    },
    {
      question: "What does the intensity rating mean?",
      answer:
        "Intensity is rated from 1 to 5, where 1 is light/easy training and 5 is maximum effort/competition level. This helps you track how hard you pushed yourself during each session.",
    },
    {
      question: "How can I view my training history?",
      answer:
        "Go to the Logs tab to see all your past sessions organized by date. Tap on any date to expand and view detailed information about each session including time, counts, intensity, mood, and notes.",
    },
    {
      question: "What do the analytics show?",
      answer:
        "The Summary tab displays your training analytics including total sessions, total counts, a 7-day activity chart showing daily counts, and a heatmap showing what times of day you train most frequently.",
    },
    {
      question: "How do I change the app theme?",
      answer:
        "Go to your Profile tab and tap 'Edit Profile'. You'll see theme options (Blue, Pink, Green) that you can select to personalize the app's color scheme.",
    },
    {
      question: "Can I edit my profile information?",
      answer:
        "Yes! In the Profile tab, tap the edit icon to update your name, training start date, and date of birth. This information helps track your training journey over time.",
    },
    {
      question: "How do I export my training data?",
      answer:
        "Go to Settings > Data Management > Export to PDF. This feature allows you to download all your session data for backup or sharing purposes.",
    },
    {
      question: "Can I delete all my data?",
      answer:
        "Yes, but be careful! In Settings > Data Management > Clear All Data, you can delete all your sessions. This action cannot be undone, so make sure to export your data first if you want to keep a backup.",
    },
    {
      question: "What are custom contexts?",
      answer:
        "Contexts help you categorize where or how you trained (e.g., 'Gym', 'Home', 'Outdoor', 'Competition'). You can add your own custom contexts to better organize your training sessions.",
    },
    {
      question: "Will my data be saved if I close the app?",
      answer:
        "Yes! All your session data is automatically saved to your device's local storage. Your training history, profile information, and settings will persist even after closing the app.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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
            Help & FAQ
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            Find answers to common questions
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Getting Started Section */}
        <View style={styles.section}>
          <View
            style={[
              styles.welcomeCard,
              { backgroundColor: colors.primary, borderColor: colors.border },
            ]}
          >
            <Text style={styles.welcomeIcon}>👋</Text>
            <Text style={styles.welcomeTitle}>Welcome to Daily Counter!</Text>
            <Text style={styles.welcomeText}>
              Track your martial arts training sessions with ease. Count your
              reps, log your progress, and analyze your performance over time.
            </Text>
          </View>
        </View>

        {/* Quick Tips Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            QUICK TIPS
          </Text>
          <View
            style={[
              styles.tipsCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.tipItem}>
              <View
                style={[
                  styles.tipIconContainer,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Text style={styles.tipIcon}>⚡</Text>
              </View>
              <Text style={[styles.tipText, { color: colors.text }]}>
                Tap the counter quickly during training without unlocking your
                phone
              </Text>
            </View>

            <View style={styles.tipItem}>
              <View
                style={[
                  styles.tipIconContainer,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Text style={styles.tipIcon}>📝</Text>
              </View>
              <Text style={[styles.tipText, { color: colors.text }]}>
                Add detailed notes after each session to track your progress
              </Text>
            </View>

            <View style={styles.tipItem}>
              <View
                style={[
                  styles.tipIconContainer,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <Text style={styles.tipIcon}>📊</Text>
              </View>
              <Text style={[styles.tipText, { color: colors.text }]}>
                Check your analytics regularly to identify training patterns
              </Text>
            </View>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            FREQUENTLY ASKED QUESTIONS
          </Text>
          <View style={styles.faqList}>
            {faqs.map((faq, index) => (
              <View key={index}>
                <TouchableOpacity
                  style={[
                    styles.faqCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => toggleFAQ(index)}
                >
                  <View style={styles.faqHeader}>
                    <View style={styles.faqQuestionContainer}>
                      <View
                        style={[
                          styles.faqNumber,
                          { backgroundColor: colors.secondary },
                        ]}
                      >
                        <Text
                          style={[
                            styles.faqNumberText,
                            { color: colors.primary },
                          ]}
                        >
                          {index + 1}
                        </Text>
                      </View>
                      <Text
                        style={[styles.faqQuestion, { color: colors.text }]}
                      >
                        {faq.question}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.faqIcon,
                        {
                          color: colors.textSecondary,
                          transform: [
                            {
                              rotate:
                                expandedIndex === index ? "180deg" : "0deg",
                            },
                          ],
                        },
                      ]}
                    >
                      ▼
                    </Text>
                  </View>

                  {expandedIndex === index && (
                    <View
                      style={[
                        styles.faqAnswer,
                        { backgroundColor: colors.secondary },
                      ]}
                    >
                      <Text
                        style={[styles.faqAnswerText, { color: colors.text }]}
                      >
                        {faq.answer}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <View
            style={[
              styles.contactCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={styles.contactIcon}>💬</Text>
            <Text style={[styles.contactTitle, { color: colors.text }]}>
              Still Have Questions?
            </Text>
            <Text style={[styles.contactText, { color: colors.textSecondary }]}>
              We&apos;re here to help! Send us your feedback or questions
              through the Settings page.
            </Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 20 }} />
      </ScrollView>
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
  scrollContent: {
    padding: 20,
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
  welcomeCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  welcomeIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 15,
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.95,
  },
  tipsCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    gap: 16,
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
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  tipIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  tipIcon: {
    fontSize: 18,
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  faqList: {
    gap: 12,
  },
  faqCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
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
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    gap: 12,
  },
  faqQuestionContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  faqNumber: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  faqNumberText: {
    fontSize: 13,
    fontWeight: "700",
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
    lineHeight: 21,
  },
  faqIcon: {
    fontSize: 12,
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
    marginTop: -8,
  },
  faqAnswerText: {
    fontSize: 14,
    lineHeight: 21,
  },
  contactCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
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
  contactIcon: {
    fontSize: 40,
    marginBottom: 12,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  contactText: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
