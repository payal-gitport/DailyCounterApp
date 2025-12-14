import { useTheme } from "@/contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle, G } from "react-native-svg";

const getTodayKey = () => new Date().toISOString().split("T")[0];

export default function HomeScreen() {
  const [logs, setLogs] = useState<Record<string, string[]>>({});
  const { colors } = useTheme();
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [sessionCount, setSessionCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("");
  const [intensity, setIntensity] = useState<number>(3);
  const [note, setNote] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [context, setContext] = useState<string>("");
  const [customContexts, setCustomContexts] = useState<string[]>([]);
  const [showCustomContextInput, setShowCustomContextInput] = useState(false);
  const [customContextInput, setCustomContextInput] = useState<string>("");

  // Load logs on mount
  useEffect(() => {
    const loadLogs = async () => {
      const data = await AsyncStorage.getItem("COUNTER_LOGS");
      if (data) setLogs(JSON.parse(data));
    };
    loadLogs();
  }, []);

  // Save logs whenever they change
  useEffect(() => {
    AsyncStorage.setItem("COUNTER_LOGS", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    const loadCustomContexts = async () => {
      const data = await AsyncStorage.getItem("CUSTOM_CONTEXTS");
      if (data) setCustomContexts(JSON.parse(data));
    };
    loadCustomContexts();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("CUSTOM_CONTEXTS", JSON.stringify(customContexts));
  }, [customContexts]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (sessionActive && sessionStartTime) {
      interval = setInterval(() => {
        setElapsedTime(
          Math.floor((Date.now() - sessionStartTime.getTime()) / 1000)
        );
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [sessionActive, sessionStartTime]);

  const startSession = () => {
    setSessionActive(true);
    setSessionStartTime(new Date());
    setSessionCount(0);
    setElapsedTime(0);
  };

  const incrementSession = () => {
    setSessionCount((prev) => prev + 1);
  };

  const openTypeModal = () => {
    if (sessionCount > 0) {
      setSessionActive(false); // Close session modal first
      setShowTypeModal(true); // Then open type modal
    } else {
      // If no counts, just close session
      setSessionActive(false);
      setSessionStartTime(null);
      setSessionCount(0);
      setElapsedTime(0);
    }
  };

  const handleTypeSelection = (type: string) => {
    setSelectedType(type);
  };

  const saveSessionWithType = () => {
    if (sessionStartTime && sessionCount > 0) {
      const today = getTodayKey();
      const endTime = new Date();
      const startTime = sessionStartTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const endTimeStr = endTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      let logEntry = `${startTime} - ${endTimeStr} | ${selectedType}`;

      if (selectedType === "Kicks") {
        logEntry += ` - Intensity ${intensity}/5`;
      }

      logEntry += ` (${sessionCount} count${sessionCount > 1 ? "s" : ""})`;

      if (note) {
        logEntry += ` | Note: ${note}`;
      }

      if (mood) {
        logEntry += ` | Mood: ${mood}`;
      }

      if (context) {
        logEntry += ` | Context: ${context}`;
      }

      setLogs((prev) => ({
        ...prev,
        [today]: [...(prev[today] || []), logEntry],
      }));
    }
    setShowTypeModal(false);
    setSessionActive(false);
    setSessionStartTime(null);
    setSessionCount(0);
    setElapsedTime(0);
    setSelectedType("");
    setIntensity(3);
    setNote("");
    setMood("");
    setContext("");
    setShowCustomContextInput(false);
    setCustomContextInput("");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTotalCountsForDay = (dateKey: string) => {
    const dayLogs = logs[dateKey] || [];
    let totalCount = 0;

    dayLogs.forEach((log) => {
      // Extract count from log format: "2:30 PM (5 counts)"
      const match = log.match(/\((\d+) count/);
      if (match) {
        totalCount += parseInt(match[1], 10);
      }
    });

    return totalCount;
  };

  const todayCount = getTotalCountsForDay(getTodayKey());

  const getYesterdayKey = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split("T")[0];
  };

  const yesterdayCount = getTotalCountsForDay(getYesterdayKey());
  const difference = todayCount - yesterdayCount;
  const percentChange =
    yesterdayCount > 0
      ? Math.round((difference / yesterdayCount) * 100)
      : todayCount > 0
      ? 100
      : 0;

  // Calculate insights
  const getInsight = () => {
    const allDates = Object.keys(logs);
    const totalSessions = allDates.reduce(
      (sum, date) => sum + logs[date].length,
      0
    );
    const totalDays = allDates.length;
    const avgSessionsPerDay =
      totalDays > 0 ? (totalSessions / totalDays).toFixed(1) : 0;

    const todaySessions = logs[getTodayKey()]?.length || 0;

    if (todayCount === 0 && todaySessions === 0) {
      return {
        icon: "🎯",
        title: "Ready to Start?",
        message:
          "Begin your first session today and build your training streak!",
      };
    }

    if (todayCount > yesterdayCount && yesterdayCount > 0) {
      return {
        icon: "🔥",
        title: "You&apos;re On Fire!",
        message: `${difference} more counts than yesterday. Keep pushing!`,
      };
    }

    if (todaySessions >= 2) {
      return {
        icon: "💪",
        title: "Strong Dedication!",
        message: `${todaySessions} sessions today. Your consistency is impressive!`,
      };
    }

    if (totalDays >= 7) {
      return {
        icon: "📈",
        title: "Building Momentum",
        message: `${totalDays} days tracked with ${avgSessionsPerDay} avg sessions/day!`,
      };
    }

    return {
      icon: "⚡",
      title: "Keep It Up!",
      message: "Every session counts. Stay consistent with your training!",
    };
  };

  const insight = getInsight();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Daily Counter
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Track your daily progress
          </Text>
        </View>

        {/* Daily Insight Card */}
        <View
          style={[
            styles.insightCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.insightHeader}>
            <Text style={styles.insightIcon}>{insight.icon}</Text>
            <View style={styles.insightContent}>
              <Text style={[styles.insightTitle, { color: colors.text }]}>
                {insight.title}
              </Text>
              <Text
                style={[styles.insightMessage, { color: colors.textSecondary }]}
              >
                {insight.message}
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.todayCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.todayLabel, { color: colors.textSecondary }]}>
            Today&apos;s Count
          </Text>
          <Text style={[styles.todayCount, { color: colors.primary }]}>
            {todayCount}
          </Text>

          <View style={styles.comparisonContainer}>
            <Text
              style={[styles.comparisonLabel, { color: colors.textSecondary }]}
            >
              vs Yesterday ({yesterdayCount})
            </Text>
            {difference !== 0 && (
              <View
                style={[
                  styles.comparisonBadge,
                  difference > 0
                    ? styles.comparisonPositive
                    : styles.comparisonNegative,
                ]}
              >
                <Text style={styles.comparisonText}>
                  {difference > 0 ? "+" : ""}
                  {difference} ({percentChange > 0 ? "+" : ""}
                  {percentChange}%)
                </Text>
              </View>
            )}
            {difference === 0 && yesterdayCount > 0 && (
              <View style={styles.comparisonBadgeNeutral}>
                <Text style={styles.comparisonTextNeutral}>
                  Same as yesterday
                </Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={startSession}
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>+</Text>
          <Text style={styles.addButtonLabel}>Start Session</Text>
        </TouchableOpacity>
      </View>

    <Modal
        visible={sessionActive}
        animationType="slide"
        transparent={true}
        onRequestClose={openTypeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Active Session
              </Text>
              <Text style={[styles.modalTimer, { color: colors.primary }]}>
                {formatTime(elapsedTime)}
              </Text>
            </View>
            <View style={styles.sessionCountContainer}>
              <Text
                style={[
                  styles.sessionCountLabel,
                  { color: colors.textSecondary },
                ]}
              >
                Session Count
              </Text>
              {/* Circular Progress with 10 segments */}
              <View style={styles.circularProgressContainer}>
                <Svg width="200" height="200" viewBox="0 0 200 200">
                  <G rotation="-90" origin="100, 100">
                    {/* Single circle boundary */}
                    <Circle
                      cx="100"
                      cy="100"
                      r="80"
                      stroke={colors.border}
                      strokeWidth="16"
                      fill="none"
                    />
                    {/* 10 equal segments that fill on each count */}
                    {[...Array(10)].map((_, index) => {
                      const segmentAngle = 36; // 360/10 = 36 degrees per segment
                      const gapAngle = 3; // Gap between segments (in degrees)
                      const arcLength = segmentAngle - gapAngle;
                      const circumference = 2 * Math.PI * 80; // 2πr where r=80
                      const segmentLength = (arcLength / 360) * circumference;
                      const gapLength = (gapAngle / 360) * circumference;
                      const restLength = circumference - segmentLength;
                      const strokeDasharray = `${segmentLength} ${restLength}`;
                      const rotation = index * segmentAngle;
                      const currentSegment = sessionCount % 10;
                      // Determine if this segment should be filled
                      const isFilled = currentSegment > index;
                      return isFilled ? (
                        <G key={index} rotation={rotation} origin="100, 100">
                          <Circle
                            cx="100"
                            cy="100"
                            r="80"
                            stroke={colors.primary}
                            strokeWidth="16"
                            fill="none"
                            strokeDasharray={strokeDasharray}
                            strokeLinecap="round"
                          />
                        </G>
                      ) : null;
                    })}
                  </G>
                </Svg>
                {/* Count in the center */}
                <View style={styles.circularProgressCenter}>
                  <Text
                    style={[
                      styles.sessionCountValue,
                      { color: colors.primary },
                    ]}
                  >
                    {sessionCount}
                  </Text>
                  {sessionCount >= 10 && (
                    <Text
                      style={[
                        styles.cycleIndicator,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Cycle {Math.floor(sessionCount / 10) + 1}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={incrementSession}
              style={[
                styles.sessionAddButton,
                { backgroundColor: colors.primary },
              ]}
              activeOpacity={0.8}
            >
              <Text style={styles.sessionAddButtonText}>+</Text>
              <Text style={styles.sessionAddButtonLabel}>Add Count</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openTypeModal}
              style={[
                styles.endSessionButton,
                {
                  backgroundColor: colors.secondary,
                  borderColor: colors.border,
                },
              ]}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.endSessionButtonText, { color: colors.text }]}
              >
                End Session
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showTypeModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowTypeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.typeModalContent, { backgroundColor: colors.card }]}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={[styles.typeModalTitle, { color: colors.text }]}>
                Session Details
              </Text>
              <Text
                style={[
                  styles.typeModalSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                Tell us about your training session
              </Text>

              <View style={styles.sectionContainer}>
                <Text style={[styles.sectionLabel, { color: colors.text }]}>
                  Activity Type
                </Text>
                <View style={styles.typeOptionsContainer}>
                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      {
                        backgroundColor: colors.secondary,
                        borderColor: colors.border,
                      },
                      selectedType === "Kicks" && {
                        borderColor: colors.primary,
                        backgroundColor: colors.primary + "20",
                      },
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleTypeSelection("Kicks")}
                  >
                    <Text style={styles.typeOptionEmoji}>🦵</Text>
                    <Text
                      style={[styles.typeOptionText, { color: colors.text }]}
                    >
                      Kicks
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      {
                        backgroundColor: colors.secondary,
                        borderColor: colors.border,
                      },
                      selectedType === "Roll" && {
                        borderColor: colors.primary,
                        backgroundColor: colors.primary + "20",
                      },
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleTypeSelection("Roll")}
                  >
                    <Text style={styles.typeOptionEmoji}>🔄</Text>
                    <Text
                      style={[styles.typeOptionText, { color: colors.text }]}
                    >
                      Roll
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.typeOption,
                      {
                        backgroundColor: colors.secondary,
                        borderColor: colors.border,
                      },
                      selectedType === "Movement" && {
                        borderColor: colors.primary,
                        backgroundColor: colors.primary + "20",
                      },
                    ]}
                    activeOpacity={0.8}
                    onPress={() => handleTypeSelection("Movement")}
                  >
                    <Text style={styles.typeOptionEmoji}>🏃</Text>
                    <Text
                      style={[styles.typeOptionText, { color: colors.text }]}
                    >
                      Movement
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {selectedType === "Kicks" && (
                <View style={styles.sectionContainer}>
                  <Text style={[styles.sectionLabel, { color: colors.text }]}>
                    Intensity Level ({intensity}/5)
                  </Text>
                  <Text
                    style={[
                      styles.intensitySubtext,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {intensity === 1 && "Very Light"}
                    {intensity === 2 && "Light"}
                    {intensity === 3 && "Moderate"}
                    {intensity === 4 && "Strong"}
                    {intensity === 5 && "Very Strong"}
                  </Text>
                  <View style={styles.intensityContainer}>
                    {[1, 2, 3, 4, 5].map((level) => (
                      <TouchableOpacity
                        key={level}
                        style={[
                          styles.intensityButton,
                          {
                            backgroundColor: colors.secondary,
                            borderColor: colors.border,
                          },
                          intensity === level && {
                            backgroundColor: colors.primary,
                            borderColor: colors.primary,
                          },
                        ]}
                        activeOpacity={0.8}
                        onPress={() => setIntensity(level)}
                      >
                        <Text
                          style={[
                            styles.intensityButtonText,
                            {
                              color:
                                intensity === level ? "#ffffff" : colors.text,
                            },
                          ]}
                        >
                          {level}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {selectedType && (
                <>
                  <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>
                      Note (Optional) 📝
                    </Text>
                    <TextInput
                      style={[
                        styles.textInput,
                        {
                          backgroundColor: colors.secondary,
                          color: colors.text,
                          borderColor: colors.border,
                        },
                      ]}
                      placeholder="What were you working on?"
                      placeholderTextColor={colors.textSecondary}
                      value={note}
                      onChangeText={setNote}
                      multiline
                      numberOfLines={3}
                    />
                  </View>

                  <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>
                      Mood (Optional) 😊
                    </Text>
                    <View style={styles.moodContainer}>
                      {["😫", "😕", "😐", "🙂", "😄"].map((emoji, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[
                            styles.moodButton,
                            {
                              backgroundColor: colors.secondary,
                              borderColor: colors.border,
                            },
                            mood === emoji && {
                              backgroundColor: colors.primary + "20",
                              borderColor: colors.primary,
                            },
                          ]}
                          activeOpacity={0.8}
                          onPress={() => setMood(emoji)}
                        >
                          <Text style={styles.moodEmoji}>{emoji}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  <View style={styles.sectionContainer}>
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>
                      What were you doing? (Optional) 🏃
                    </Text>
                    <View style={styles.contextContainer}>
                      {[
                        "Walking",
                        "Resting",
                        "After Food",
                        "Listening to Music",
                      ]
                        .concat(customContexts)
                        .map((ctx, index) => (
                          <TouchableOpacity
                            key={index}
                            style={[
                              styles.contextButton,
                              {
                                backgroundColor: colors.secondary,
                                borderColor: colors.border,
                              },
                              context === ctx && {
                                backgroundColor: colors.primary,
                                borderColor: colors.primary,
                              },
                            ]}
                            activeOpacity={0.8}
                            onPress={() => {
                              setContext(ctx);
                              setShowCustomContextInput(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.contextButtonText,
                                {
                                  color:
                                    context === ctx ? "#ffffff" : colors.text,
                                },
                              ]}
                            >
                              {ctx}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      <TouchableOpacity
                        style={[
                          styles.contextButton,
                          {
                            backgroundColor: colors.secondary,
                            borderColor: colors.border,
                          },
                        ]}
                        activeOpacity={0.8}
                        onPress={() => setShowCustomContextInput(true)}
                      >
                        <Text
                          style={[
                            styles.contextButtonText,
                            { color: colors.text },
                          ]}
                        >
                          + Other
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {showCustomContextInput && (
                      <View style={styles.customContextInputContainer}>
                        <TextInput
                          style={[
                            styles.customContextInput,
                            {
                              backgroundColor: colors.secondary,
                              color: colors.text,
                              borderColor: colors.border,
                            },
                          ]}
                          placeholder="Enter custom context"
                          placeholderTextColor={colors.textSecondary}
                          value={customContextInput}
                          onChangeText={setCustomContextInput}
                          autoFocus
                        />
                        <TouchableOpacity
                          style={[
                            styles.addContextButton,
                            { backgroundColor: colors.primary },
                          ]}
                          activeOpacity={0.8}
                          onPress={() => {
                            if (customContextInput.trim()) {
                              setCustomContexts((prev) => [
                                ...prev,
                                customContextInput.trim(),
                              ]);
                              setContext(customContextInput.trim());
                              setCustomContextInput("");
                              setShowCustomContextInput(false);
                            }
                          }}
                        >
                          <Text style={styles.addContextButtonText}>Add</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </>
              )}
            </ScrollView>

            {selectedType && (
              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: colors.primary }]}
                activeOpacity={0.8}
                onPress={saveSessionWithType}
              >
                <Text style={styles.saveButtonText}>Save Session</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.typeCancelButton, { borderColor: colors.border }]}
              activeOpacity={0.8}
              onPress={() => {
                setShowTypeModal(false);
                setSelectedType("");
                setIntensity(3);
                setNote("");
                setMood("");
                setContext("");
                setShowCustomContextInput(false);
                setCustomContextInput("");
              }}
            >
              <Text
                style={[styles.typeCancelButtonText, { color: colors.text }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
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
  insightCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
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
  insightHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  insightIcon: {
    fontSize: 32,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  insightMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  todayCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
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
  todayLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  todayCount: {
    fontSize: 56,
    fontWeight: "700",
    color: "#6366f1",
  },
  comparisonContainer: {
    marginTop: 16,
    alignItems: "center",
    gap: 8,
  },
  comparisonLabel: {
    fontSize: 13,
    color: "#94a3b8",
    fontWeight: "500",
  },
  comparisonBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  comparisonPositive: {
    backgroundColor: "#dcfce7",
  },
  comparisonNegative: {
    backgroundColor: "#fee2e2",
  },
  comparisonBadgeNeutral: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#f1f5f9",
  },
  comparisonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#166534",
  },
  comparisonTextNeutral: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 32,
    width: "85%",
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
  },
  modalTimer: {
    fontSize: 48,
    fontWeight: "300",
    color: "#6366f1",
    fontVariant: ["tabular-nums"],
  },
  sessionCountContainer: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 24,
  },sessionCountLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
  },
  circularProgressContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  circularProgressCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  sessionCountValue: {
    fontSize: 48,
    fontWeight: "700",
    color: "#1E293B",
  },
  cycleIndicator: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sessionAddButton: {
    backgroundColor: "#6366f1",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
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
  sessionAddButtonText: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "300",
    lineHeight: 36,
  },
  sessionAddButtonLabel: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  endSessionButton: {

    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {

        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  endSessionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  typeModalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    maxHeight: "85%",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  typeModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 4,
  },
  typeModalSubtitle: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 16,
  },
  typeOptionsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  typeOption: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 12,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderWidth: 2,
    borderColor: "#e2e8f0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  typeOptionEmoji: {
    fontSize: 24,
  },
  typeOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
  },
  typeCancelButton: {
    backgroundColor: "#f1f5f9",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  typeCancelButtonText: {
    color: "#64748b",
    fontSize: 16,
    fontWeight: "600",
  },
  typeOptionSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#eef2ff",
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  intensitySubtext: {
    fontSize: 14,
    color: "#6366f1",
    marginBottom: 12,
    fontWeight: "500",
  },
  intensityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },
  intensityButton: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  intensityButtonSelected: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
  },
  intensityButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#64748b",
  },
  intensityButtonTextSelected: {
    color: "#ffffff",
  },
  textInput: {
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1e293b",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    minHeight: 80,
    textAlignVertical: "top",
  },
  moodContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  moodButton: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  moodButtonSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#eef2ff",
  },
  moodEmoji: {
    fontSize: 28,
  },
  contextContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  contextButton: {
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: "#e2e8f0",
  },
  contextButtonSelected: {
    borderColor: "#6366f1",
    backgroundColor: "#eef2ff",
  },
  contextButtonOther: {
    borderColor: "#8b5cf6",
    backgroundColor: "#faf5ff",
  },
  contextButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
  },
  contextButtonTextSelected: {
    color: "#6366f1",
  },
  customContextInputContainer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  customContextInput: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#1e293b",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  addContextButton: {
    backgroundColor: "#8b5cf6",
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addContextButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#6366f1",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
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
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  addButton: {
    backgroundColor: "#6366f1",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#6366f1",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 48,
    fontWeight: "300",
    lineHeight: 48,
  },
  addButtonLabel: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },
});
