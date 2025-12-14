import { useTheme } from "@/contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TabTwoScreen() {
  const [logs, setLogs] = useState<Record<string, string[]>>({});
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const { colors } = useTheme();

  const loadLogs = useCallback(async () => {
    const data = await AsyncStorage.getItem("COUNTER_LOGS");
    if (data) setLogs(JSON.parse(data));
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useFocusEffect(
    useCallback(() => {
      loadLogs();
    }, [loadLogs])
  );

  const dates = Object.keys(logs).sort((a, b) => (a < b ? 1 : -1));

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Logs</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            View all your records
          </Text>
        </View>
      </View>
      <FlatList
        data={dates}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isExpanded = expandedDate === item;
          const totalSessions = logs[item].length;

          // Calculate total counts for the day
          let totalCounts = 0;
          logs[item].forEach((log) => {
            const match = log.match(/\((\d+) count/);
            if (match) {
              totalCounts += parseInt(match[1], 10);
            }
          });

          const date = new Date(item);
          const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "long",
            day: "numeric",
            year: "numeric",
          });

          return (
            <View
              style={[
                styles.card,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <TouchableOpacity
                onPress={() => {
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut
                  );
                  setExpandedDate(isExpanded ? null : item);
                }}
                style={styles.cardHeader}
                activeOpacity={0.7}
              >
                <View style={styles.dateContainer}>
                  <Text style={[styles.dateText, { color: colors.text }]}>
                    {formattedDate}
                  </Text>
                  <View style={styles.countBadgesContainer}>
                    <View
                      style={[
                        styles.countBadge,
                        { backgroundColor: colors.secondary },
                      ]}
                    >
                      <Text
                        style={[styles.countText, { color: colors.primary }]}
                      >
                        {totalCounts}
                      </Text>
                      <Text
                        style={[
                          styles.countLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        counts
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.countBadge,
                        styles.sessionBadge,
                        { backgroundColor: colors.secondary },
                      ]}
                    >
                      <Text
                        style={[styles.countText, { color: colors.primary }]}
                      >
                        {totalSessions}
                      </Text>
                      <Text
                        style={[
                          styles.countLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        sessions
                      </Text>
                    </View>
                  </View>
                </View>
                <Text
                  style={[styles.expandIcon, { color: colors.textSecondary }]}
                >
                  {isExpanded ? "▼" : "▶"}
                </Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.expandedContent}>
                  <View
                    style={[styles.divider, { backgroundColor: colors.border }]}
                  />
                  <Text style={[styles.timesLabel, { color: colors.text }]}>
                    Session Details:
                  </Text>
                  <View style={styles.timesList}>
                    {logs[item].map((logEntry, index) => {
                      // Parse the log entry
                      const parts = logEntry.split(" | ");
                      const timeAndType = parts[0] || "";
                      const [timeRange, ...typeParts] =
                        timeAndType.split(" | ");
                      const activityType =
                        typeParts.join(" | ") ||
                        timeAndType.split(" | ")[1] ||
                        "";

                      // Extract counts
                      const countMatch = logEntry.match(/\((\d+) count/);
                      const counts = countMatch ? countMatch[1] : "0";

                      // Extract other details
                      const intensityMatch =
                        logEntry.match(/Intensity (\d)\/5/);
                      const noteMatch = logEntry.match(/Note: ([^|]+)/);
                      const moodMatch = logEntry.match(/Mood: ([^|]+)/);
                      const contextMatch = logEntry.match(/Context: ([^|]+)/);

                      return (
                        <View
                          key={index}
                          style={[
                            styles.sessionCard,
                            {
                              backgroundColor: colors.secondary,
                              borderColor: colors.border,
                            },
                          ]}
                        >
                          <View style={styles.sessionHeader}>
                            <View style={styles.sessionHeaderLeft}>
                              <Text
                                style={[
                                  styles.sessionNumber,
                                  { color: colors.primary },
                                ]}
                              >
                                #{index + 1}
                              </Text>
                              <Text
                                style={[
                                  styles.sessionTime,
                                  { color: colors.text },
                                ]}
                              >
                                {timeRange}
                              </Text>
                            </View>
                            <View
                              style={[
                                styles.countBadgeSmall,
                                { backgroundColor: colors.primary },
                              ]}
                            >
                              <Text style={styles.countBadgeText}>
                                {counts}
                              </Text>
                            </View>
                          </View>

                          {activityType && (
                            <Text
                              style={[
                                styles.sessionActivity,
                                { color: colors.text },
                              ]}
                            >
                              {activityType}
                            </Text>
                          )}

                          {intensityMatch && (
                            <View style={styles.sessionDetailRow}>
                              <Text
                                style={[
                                  styles.sessionDetailLabel,
                                  { color: colors.textSecondary },
                                ]}
                              >
                                Intensity:
                              </Text>
                              <View style={styles.intensityDots}>
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <View
                                    key={level}
                                    style={[
                                      styles.intensityDot,
                                      {
                                        backgroundColor:
                                          level <= parseInt(intensityMatch[1])
                                            ? colors.primary
                                            : colors.border,
                                      },
                                    ]}
                                  />
                                ))}
                              </View>
                            </View>
                          )}

                          {moodMatch && (
                            <View style={styles.sessionDetailRow}>
                              <Text
                                style={[
                                  styles.sessionDetailLabel,
                                  { color: colors.textSecondary },
                                ]}
                              >
                                Mood:
                              </Text>
                              <Text
                                style={[
                                  styles.sessionDetailValue,
                                  { color: colors.text },
                                ]}
                              >
                                {moodMatch[1].trim()}
                              </Text>
                            </View>
                          )}

                          {contextMatch && (
                            <View style={styles.sessionDetailRow}>
                              <Text
                                style={[
                                  styles.sessionDetailLabel,
                                  { color: colors.textSecondary },
                                ]}
                              >
                                Context:
                              </Text>
                              <Text
                                style={[
                                  styles.sessionDetailValue,
                                  { color: colors.text },
                                ]}
                              >
                                {contextMatch[1].trim()}
                              </Text>
                            </View>
                          )}

                          {noteMatch && (
                            <View
                              style={[
                                styles.noteContainer,
                                { backgroundColor: colors.background },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.noteLabel,
                                  { color: colors.textSecondary },
                                ]}
                              >
                                Note:
                              </Text>
                              <Text
                                style={[
                                  styles.noteText,
                                  { color: colors.text },
                                ]}
                              >
                                {noteMatch[1].trim()}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "400",
  },
  dummyButton: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#6366f1",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  dummyButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  listContent: {
    padding: 20,
    paddingTop: 8,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardHeader: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    flex: 1,
  },
  countBadgesContainer: {
    flexDirection: "row",
    gap: 8,
  },
  countBadge: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    minWidth: 50,
    alignItems: "center",
  },
  sessionBadge: {
    backgroundColor: "#8b5cf6",
  },
  countText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  countLabel: {
    color: "#ffffff",
    fontSize: 9,
    fontWeight: "600",
    marginTop: 2,
    textTransform: "uppercase",
  },
  expandIcon: {
    fontSize: 12,
    color: "#94a3b8",
    marginLeft: 8,
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginBottom: 12,
  },
  timesLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  timesList: {
    gap: 12,
  },
  sessionCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sessionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  sessionNumber: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6366f1",
  },
  sessionTime: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    flex: 1,
  },
  countBadgeSmall: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 36,
    alignItems: "center",
  },
  countBadgeText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  sessionActivity: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  sessionDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },
  sessionDetailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    minWidth: 70,
  },
  sessionDetailValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#334155",
    flex: 1,
  },
  intensityDots: {
    flexDirection: "row",
    gap: 4,
  },
  intensityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#e2e8f0",
  },
  noteContainer: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  noteLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 13,
    color: "#334155",
    lineHeight: 18,
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  timeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#6366f1",
    marginRight: 10,
  },
  timeText: {
    fontSize: 15,
    color: "#475569",
    fontWeight: "500",
  },
});
