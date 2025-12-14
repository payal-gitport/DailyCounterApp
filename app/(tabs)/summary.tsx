import { useTheme } from "@/contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Dimensions,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function SummaryScreen() {
  const [logs, setLogs] = useState<Record<string, string[]>>({});
  const { colors } = useTheme();

  const loadLogs = useCallback(async () => {
    const data = await AsyncStorage.getItem("COUNTER_LOGS");
    if (data) setLogs(JSON.parse(data));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLogs();
    }, [loadLogs])
  );

  const dates = Object.keys(logs).sort((a, b) => (a < b ? 1 : -1));
  const graphDates = dates.slice(0, 7).reverse();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Summary</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your training insights
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {graphDates.length > 0 ? (
          <>
            <View
              style={[styles.chartContainer, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.chartTitle, { color: colors.text }]}>
                Last 7 Days Overview
              </Text>
              <BarChart
                data={{
                  labels: graphDates.map((d) => {
                    const date = new Date(d);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }),
                  datasets: [
                    {
                      data: graphDates.map((d) => {
                        let totalCounts = 0;
                        logs[d].forEach((log) => {
                          const match = log.match(/\((\d+) count/);
                          if (match) {
                            totalCounts += parseInt(match[1], 10);
                          }
                        });
                        return totalCounts;
                      }),
                    },
                  ],
                }}
                width={screenWidth - 40}
                height={220}
                fromZero
                chartConfig={{
                  backgroundGradientFrom: colors.card,
                  backgroundGradientTo: colors.card,
                  decimalPlaces: 0,
                  color: (opacity = 1) =>
                    `rgba(${parseInt(
                      colors.primary.slice(1, 3),
                      16
                    )}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(
                      colors.primary.slice(5, 7),
                      16
                    )}, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(${parseInt(
                      colors.textSecondary.slice(1, 3),
                      16
                    )}, ${parseInt(
                      colors.textSecondary.slice(3, 5),
                      16
                    )}, ${parseInt(
                      colors.textSecondary.slice(5, 7),
                      16
                    )}, ${opacity})`,
                  barPercentage: 0.5,
                  propsForBackgroundLines: {
                    strokeDasharray: "",
                    stroke: "#e2e8f0",
                    strokeWidth: 1,
                  },
                  propsForLabels: {
                    fontSize: 10,
                  },
                }}
                style={styles.chart}
                withInnerLines={true}
                showBarTops={false}
              />
            </View>

            <View
              style={[
                styles.heatmapContainer,
                { backgroundColor: colors.card },
              ]}
            >
              <Text style={[styles.chartTitle, { color: colors.text }]}>
                Time of Day Activity
              </Text>
              <Text
                style={[
                  styles.heatmapSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                When you train most
              </Text>
              {(() => {
                // Calculate activity by time period
                const timeData = {
                  morning: 0, // 5 AM - 11 AM
                  afternoon: 0, // 11 AM - 5 PM
                  evening: 0, // 5 PM - 9 PM
                  night: 0, // 9 PM - 5 AM
                };

                let totalLogs = 0;
                let matchedLogs = 0;
                Object.values(logs).forEach((dayLogs) => {
                  dayLogs.forEach((log) => {
                    totalLogs++;
                    // Extract time from log format "2:30 PM - 3:45 PM | ..."
                    // Match more flexible patterns including "2:30 PM" or "2:30PM"
                    const timeMatch = log.match(
                      /^(\d{1,2}):(\d{2})\s*(AM|PM)/i
                    );
                    if (timeMatch) {
                      matchedLogs++;
                      let hour = parseInt(timeMatch[1]);
                      const ampm = timeMatch[3].toUpperCase();

                      if (ampm === "PM" && hour !== 12) hour += 12;
                      if (ampm === "AM" && hour === 12) hour = 0;

                      if (hour >= 5 && hour < 11) timeData.morning++;
                      else if (hour >= 11 && hour < 17) timeData.afternoon++;
                      else if (hour >= 17 && hour < 21) timeData.evening++;
                      else timeData.night++;
                    }
                  });
                });

                const maxValue = Math.max(...Object.values(timeData), 1);
                const hasData = matchedLogs > 0;

                return hasData ? (
                  <View style={styles.heatmapGrid}>
                    <View style={styles.heatmapRow}>
                      <View
                        style={[
                          styles.heatmapCell,
                          { backgroundColor: colors.secondary },
                          timeData.morning > 0 && {
                            borderColor: colors.primary,
                            borderWidth: 2,
                          },
                        ]}
                      >
                        <Text
                          style={[styles.heatmapLabel, { color: colors.text }]}
                        >
                          🌅 Morning
                        </Text>
                        <Text
                          style={[
                            styles.heatmapTime,
                            { color: colors.textSecondary },
                          ]}
                        >
                          5-11 AM
                        </Text>
                        <Text
                          style={[
                            styles.heatmapCount,
                            {
                              color:
                                timeData.morning > 0
                                  ? colors.primary
                                  : colors.textSecondary,
                            },
                          ]}
                        >
                          {timeData.morning}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.heatmapCell,
                          { backgroundColor: colors.secondary },
                          timeData.afternoon > 0 && {
                            borderColor: colors.primary,
                            borderWidth: 2,
                          },
                        ]}
                      >
                        <Text
                          style={[styles.heatmapLabel, { color: colors.text }]}
                        >
                          ☀️ Afternoon
                        </Text>
                        <Text
                          style={[
                            styles.heatmapTime,
                            { color: colors.textSecondary },
                          ]}
                        >
                          11 AM-5 PM
                        </Text>
                        <Text
                          style={[
                            styles.heatmapCount,
                            {
                              color:
                                timeData.afternoon > 0
                                  ? colors.primary
                                  : colors.textSecondary,
                            },
                          ]}
                        >
                          {timeData.afternoon}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.heatmapRow}>
                      <View
                        style={[
                          styles.heatmapCell,
                          { backgroundColor: colors.secondary },
                          timeData.evening > 0 && {
                            borderColor: colors.primary,
                            borderWidth: 2,
                          },
                        ]}
                      >
                        <Text
                          style={[styles.heatmapLabel, { color: colors.text }]}
                        >
                          🌆 Evening
                        </Text>
                        <Text
                          style={[
                            styles.heatmapTime,
                            { color: colors.textSecondary },
                          ]}
                        >
                          5-9 PM
                        </Text>
                        <Text
                          style={[
                            styles.heatmapCount,
                            {
                              color:
                                timeData.evening > 0
                                  ? colors.primary
                                  : colors.textSecondary,
                            },
                          ]}
                        >
                          {timeData.evening}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.heatmapCell,
                          { backgroundColor: colors.secondary },
                          timeData.night > 0 && {
                            borderColor: colors.primary,
                            borderWidth: 2,
                          },
                        ]}
                      >
                        <Text
                          style={[styles.heatmapLabel, { color: colors.text }]}
                        >
                          🌙 Night
                        </Text>
                        <Text
                          style={[
                            styles.heatmapTime,
                            { color: colors.textSecondary },
                          ]}
                        >
                          9 PM-5 AM
                        </Text>
                        <Text
                          style={[
                            styles.heatmapCount,
                            {
                              color:
                                timeData.night > 0
                                  ? colors.primary
                                  : colors.textSecondary,
                            },
                          ]}
                        >
                          {timeData.night}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.emptyHeatmap}>
                    <Text
                      style={[
                        styles.emptyHeatmapText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      No sessions yet. Start tracking to see your activity
                      patterns!
                    </Text>
                  </View>
                );
              })()}
            </View>

            <View
              style={[styles.statsContainer, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.chartTitle, { color: colors.text }]}>
                Quick Stats
              </Text>
              {(() => {
                let totalSessions = 0;
                let totalCounts = 0;
                const activityTypes: Record<string, number> = {};

                Object.values(logs).forEach((dayLogs) => {
                  totalSessions += dayLogs.length;
                  dayLogs.forEach((log) => {
                    // Extract count
                    const countMatch = log.match(/\((\d+) count/);
                    if (countMatch) {
                      totalCounts += parseInt(countMatch[1], 10);
                    }

                    // Extract activity type
                    const typeMatch = log.match(/\| ([A-Za-z]+)/);
                    if (typeMatch) {
                      const type = typeMatch[1];
                      activityTypes[type] = (activityTypes[type] || 0) + 1;
                    }
                  });
                });

                const avgPerSession =
                  totalSessions > 0
                    ? (totalCounts / totalSessions).toFixed(1)
                    : "0";

                return (
                  <View style={styles.statsGrid}>
                    <View
                      style={[
                        styles.statCard,
                        { backgroundColor: colors.secondary },
                      ]}
                    >
                      <Text
                        style={[styles.statValue, { color: colors.primary }]}
                      >
                        {totalSessions}
                      </Text>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Total Sessions
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statCard,
                        { backgroundColor: colors.secondary },
                      ]}
                    >
                      <Text
                        style={[styles.statValue, { color: colors.primary }]}
                      >
                        {totalCounts}
                      </Text>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Total Counts
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statCard,
                        { backgroundColor: colors.secondary },
                      ]}
                    >
                      <Text
                        style={[styles.statValue, { color: colors.primary }]}
                      >
                        {avgPerSession}
                      </Text>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Avg per Session
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statCard,
                        { backgroundColor: colors.secondary },
                      ]}
                    >
                      <Text
                        style={[styles.statValue, { color: colors.primary }]}
                      >
                        {Object.keys(activityTypes).length}
                      </Text>
                      <Text
                        style={[
                          styles.statLabel,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Activity Types
                      </Text>
                    </View>
                  </View>
                );
              })()}
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={[styles.emptyText, { color: colors.text }]}>
              No data yet
            </Text>
            <Text
              style={[styles.emptySubtext, { color: colors.textSecondary }]}
            >
              Start tracking sessions to see your insights
            </Text>
          </View>
        )}
      </ScrollView>
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
  scrollContent: {
    padding: 20,
    paddingTop: 8,
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingTop: 20,
    paddingRight: 20,
    paddingBottom: 20,
    overflow: "hidden",
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 16,
    paddingLeft: 10,
  },
  chart: {
    borderRadius: 12,
    marginVertical: 8,
    marginLeft: -10,
  },
  heatmapContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  heatmapSubtitle: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 16,
    paddingLeft: 10,
  },
  heatmapGrid: {
    gap: 12,
  },
  heatmapRow: {
    flexDirection: "row",
    gap: 12,
  },
  heatmapCell: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 120,
    position: "relative",
    overflow: "hidden",
  },
  heatmapBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#6366f1",
  },
  heatmapLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
    zIndex: 10,
    elevation: 10,
  },
  heatmapTime: {
    fontSize: 11,
    color: "#64748b",
    marginBottom: 8,
    zIndex: 10,
    elevation: 10,
  },
  heatmapCount: {
    fontSize: 24,
    fontWeight: "700",
    color: "#94a3b8",
    zIndex: 10,
    elevation: 10,
  },
  heatmapCellActive: {
    borderWidth: 2,
    borderColor: "#6366f1",
  },
  heatmapCountActive: {
    color: "#6366f1",
  },
  statsContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  statValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#6366f1",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: "500",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#64748b",
  },
  emptyHeatmap: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyHeatmapText: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
});
