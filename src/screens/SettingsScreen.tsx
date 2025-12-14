import { useTheme } from "@/contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation();

  const exportToPDF = async () => {
    try {
      const data = await AsyncStorage.getItem("COUNTER_LOGS");
      if (!data) {
        Alert.alert("No Data", "There are no sessions to export.");
        return;
      }

      // For now, show an alert. In production, integrate a PDF library
      Alert.alert(
        "Export Data",
        "PDF export feature coming soon! Your data is ready to be exported.",
        [{ text: "OK" }]
      );
    } catch {
      Alert.alert("Error", "Failed to export data.");
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Customize your app
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            DATA MANAGEMENT
          </Text>
          <View
            style={[
              styles.settingCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={exportToPDF}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.icon}>📄</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Export to PDF
                </Text>
                <Text
                  style={[
                    styles.settingSubtext,
                    { color: colors.textSecondary },
                  ]}
                >
                  Download all your session data
                </Text>
              </View>
              <Text style={[styles.chevron, { color: colors.textSecondary }]}>
                ›
              </Text>
            </TouchableOpacity>

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Backup feature will be available soon!"
                )
              }
            >
              <View
                style={[styles.iconContainer, { backgroundColor: "#10b981" }]}
              >
                <Text style={styles.icon}>☁️</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Backup Data
                </Text>
                <Text
                  style={[
                    styles.settingSubtext,
                    { color: colors.textSecondary },
                  ]}
                >
                  Secure cloud backup
                </Text>
              </View>
              <View
                style={[styles.badge, { backgroundColor: colors.secondary }]}
              >
                <Text style={[styles.badgeText, { color: colors.primary }]}>
                  Soon
                </Text>
              </View>
              <Text style={[styles.chevron, { color: colors.textSecondary }]}>
                ›
              </Text>
            </TouchableOpacity>

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(
                  "Clear All Data",
                  "Are you sure you want to delete all your session data? This action cannot be undone.",
                  [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Clear",
                      style: "destructive",
                      onPress: () => {
                        AsyncStorage.removeItem("COUNTER_LOGS");
                        Alert.alert("Success", "All data has been cleared.");
                      },
                    },
                  ]
                )
              }
            >
              <View
                style={[styles.iconContainer, { backgroundColor: "#ef4444" }]}
              >
                <Text style={styles.icon}>🗑️</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Clear All Data
                </Text>
                <Text
                  style={[
                    styles.settingSubtext,
                    { color: colors.textSecondary },
                  ]}
                >
                  Delete all sessions permanently
                </Text>
              </View>
              <Text style={[styles.chevron, { color: colors.textSecondary }]}>
                ›
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            NOTIFICATIONS
          </Text>
          <View
            style={[
              styles.settingCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Notification settings will be available soon!"
                )
              }
            >
              <View
                style={[styles.iconContainer, { backgroundColor: "#f59e0b" }]}
              >
                <Text style={styles.icon}>🔔</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Daily Reminders
                </Text>
                <Text
                  style={[
                    styles.settingSubtext,
                    { color: colors.textSecondary },
                  ]}
                >
                  Get reminded to track your sessions
                </Text>
              </View>
              <View
                style={[styles.badge, { backgroundColor: colors.secondary }]}
              >
                <Text style={[styles.badgeText, { color: colors.primary }]}>
                  Soon
                </Text>
              </View>
              <Text style={[styles.chevron, { color: colors.textSecondary }]}>
                ›
              </Text>
            </TouchableOpacity>

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Achievement notifications will be available soon!"
                )
              }
            >
              <View
                style={[styles.iconContainer, { backgroundColor: "#8b5cf6" }]}
              >
                <Text style={styles.icon}>🏆</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Achievements
                </Text>
                <Text
                  style={[
                    styles.settingSubtext,
                    { color: colors.textSecondary },
                  ]}
                >
                  Celebrate your milestones
                </Text>
              </View>
              <View
                style={[styles.badge, { backgroundColor: colors.secondary }]}
              >
                <Text style={[styles.badgeText, { color: colors.primary }]}>
                  Soon
                </Text>
              </View>
              <Text style={[styles.chevron, { color: colors.textSecondary }]}>
                ›
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            SUPPORT
          </Text>
          <View
            style={[
              styles.settingCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Help" as never)}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: "#06b6d4" }]}
              >
                <Text style={styles.icon}>❓</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Help & FAQ
                </Text>
                <Text
                  style={[
                    styles.settingSubtext,
                    { color: colors.textSecondary },
                  ]}
                >
                  Get answers to common questions
                </Text>
              </View>
              <Text style={[styles.chevron, { color: colors.textSecondary }]}>
                ›
              </Text>
            </TouchableOpacity>

            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />

            <TouchableOpacity
              style={styles.settingItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate("Feedback" as never)}
            >
              <View
                style={[styles.iconContainer, { backgroundColor: "#ec4899" }]}
              >
                <Text style={styles.icon}>💬</Text>
              </View>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingText, { color: colors.text }]}>
                  Send Feedback
                </Text>
                <Text
                  style={[
                    styles.settingSubtext,
                    { color: colors.textSecondary },
                  ]}
                >
                  Help us improve the app
                </Text>
              </View>
              <Text style={[styles.chevron, { color: colors.textSecondary }]}>
                ›
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            ABOUT
          </Text>
          <View
            style={[
              styles.infoCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.appIconContainer}>
              <Text style={styles.appIcon}>🥋</Text>
            </View>
            <Text style={[styles.appName, { color: colors.text }]}>
              Daily Counter App
            </Text>
            <Text style={[styles.versionText, { color: colors.textSecondary }]}>
              Version 1.0.0
            </Text>
            <Text
              style={[styles.copyrightText, { color: colors.textSecondary }]}
            >
              © 2025 All rights reserved
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
    padding: 20,
    paddingTop: 30,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 8,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  settingCard: {
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
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 20,
  },
  settingInfo: {
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 3,
  },
  settingSubtext: {
    fontSize: 13,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 24,
    fontWeight: "300",
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginLeft: 68,
  },
  infoCard: {
    borderRadius: 16,
    padding: 28,
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
  appIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  appIcon: {
    fontSize: 48,
  },
  appName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  versionText: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    marginTop: 4,
  },
});
