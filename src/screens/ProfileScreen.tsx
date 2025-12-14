import { Theme, useTheme } from "@/contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import {
  Alert,
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

interface UserProfile {
  name: string;
  lmpDate: string;
  dueDate: string;
}

export default function ProfileScreen() {
  const { theme: selectedTheme, setTheme, colors } = useTheme();
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    lmpDate: "",
    dueDate: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editLmpDate, setEditLmpDate] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  const [logs, setLogs] = useState<Record<string, string[]>>({});

  // Date picker states
  const [showLMPDatePicker, setShowLMPDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [tempLMPDate, setTempLMPDate] = useState(new Date());
  const [tempDueDate, setTempDueDate] = useState(new Date());

  const loadLogs = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("COUNTER_LOGS");
      if (data) {
        setLogs(JSON.parse(data));
      }
    } catch (error) {
      console.error("Failed to load logs:", error);
    }
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem("USER_PROFILE");
      if (data) {
        setProfile(JSON.parse(data));
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    }
  }, []);

  const saveProfile = async () => {
    try {
      const newProfile = {
        name: editName.trim(),
        lmpDate: editLmpDate.trim(),
        dueDate: editDueDate.trim(),
      };
      await AsyncStorage.setItem("USER_PROFILE", JSON.stringify(newProfile));
      setProfile(newProfile);
      setShowEditModal(false);
      setShowLMPDatePicker(false);
      setShowDueDatePicker(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch {
      Alert.alert("Error", "Failed to save profile.");
    }
  };

  const openEditModal = () => {
    setEditName(profile.name);
    setEditLmpDate(profile.lmpDate);
    setEditDueDate(profile.dueDate);

    // Initialize date pickers with existing dates or current date
    if (profile.lmpDate) {
      const [ day,month, year] = profile.lmpDate.split("/");
      setTempLMPDate(
        new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
      );
    } else {
      setTempLMPDate(new Date());
    }

    if (profile.dueDate) {
      const [ day, month,year] = profile.dueDate.split("/");
      setTempDueDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
    } else {
      setTempDueDate(new Date());
    }

    setShowEditModal(true);
  };

  const formatDate = (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleLMPDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowLMPDatePicker(false);
    }
    if (event.type === "set" && selectedDate) {
      setTempLMPDate(selectedDate);
      setEditLmpDate(formatDate(selectedDate));
      if (Platform.OS === "ios") {
        // iOS will handle this with Done button
      }
    } else if (event.type === "dismissed") {
      setShowLMPDatePicker(false);
    }
  };

  const handleDueDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDueDatePicker(false);
    }
    if (event.type === "set" && selectedDate) {
      setTempDueDate(selectedDate);
      setEditDueDate(formatDate(selectedDate));
      if (Platform.OS === "ios") {
        // iOS will handle this with Done button
      }
    } else if (event.type === "dismissed") {
      setShowDueDatePicker(false);
    }
  };

const getPregnancyWeek = (lmpDate: string) => {
  if (!lmpDate) return null;

  const [day, month, year] = lmpDate.split('/').map(Number);
  const start = new Date(year, month - 1, day); // month is 0-based
  const now = new Date();

  const diffDays = Math.floor(
    (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  return Math.floor(diffDays / 7);
};

 useFocusEffect(
    useCallback(() => {
      loadProfile();
      loadLogs();
    }, [loadProfile, loadLogs])
  );

  const changeTheme = async (theme: Theme) => {
    await setTheme(theme);
    Alert.alert("Theme Changed", "Your theme has been updated!");
  };

  const themes = [
    {
      id: "blue" as Theme,
      name: "Light Blue",
      primaryColor: "#6366f1",
      secondaryColor: "#eef2ff",
      emoji: "💙",
    },
    {
      id: "pink" as Theme,
      name: "Light Pink",
      primaryColor: "#ec4899",
      secondaryColor: "#fce7f3",
      emoji: "💗",
    },
    {
      id: "green" as Theme,
      name: "Light Green",
      primaryColor: "#10b981",
      secondaryColor: "#d1fae5",
      emoji: "💚",
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Personalize your experience
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Section */}
        <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
          <View
            style={[
              styles.avatarContainer,
              { backgroundColor: colors.primary },
            ]}
          >
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>
            {profile.name || "Tap to add your name"}
          </Text>

          {/* {profile.lmpDate && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Started: {profile.lmpDate}
              </Text>
            </View>
          )} */}
          {profile.lmpDate && (
  <Text style={styles.infoLabel}>
    🤰 Week {getPregnancyWeek(profile.lmpDate)}
  </Text>
)}
          {profile.dueDate && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
                Birthday: {profile.dueDate}
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: colors.primary }]}
            activeOpacity={0.8}
            onPress={openEditModal}
          >
            <Text style={styles.editButtonText}>
              {profile.name ? "Edit Profile" : "Set Up Profile"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Theme Preference
          </Text>
          <Text
            style={[styles.sectionDescription, { color: colors.textSecondary }]}
          >
            Choose your preferred color theme
          </Text>

          <View style={styles.themesContainer}>
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.id}
                style={[
                  styles.themeCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  selectedTheme === theme.id && {
                    borderColor: theme.primaryColor,
                    borderWidth: 2,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => changeTheme(theme.id)}
              >
                <View
                  style={[
                    styles.themeColorPreview,
                    { backgroundColor: theme.primaryColor },
                  ]}
                />
                <Text style={styles.themeEmoji}>{theme.emoji}</Text>
                <Text style={[styles.themeName, { color: colors.text }]}>
                  {theme.name}
                </Text>
                {selectedTheme === theme.id && (
                  <View
                    style={[
                      styles.selectedBadge,
                      { backgroundColor: theme.primaryColor },
                    ]}
                  >
                    <Text style={styles.selectedBadgeText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

       {/* Stats Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quick Stats
          </Text>
          <View style={[styles.statsCard, { backgroundColor: colors.card }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statEmoji, { color: colors.primary }]}>
                🔥
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Current Streak
              </Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {(() => {
                  const dates = Object.keys(logs).sort((a, b) =>
                    a < b ? 1 : -1
                  );
                  if (dates.length === 0) return "0 days";
                  let streak = 0;
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  for (let i = 0; i < dates.length; i++) {
                    const checkDate = new Date(dates[i]);
                    const expectedDate = new Date(today);
                    expectedDate.setDate(today.getDate() - i);
                    expectedDate.setHours(0, 0, 0, 0);
                    if (checkDate.getTime() === expectedDate.getTime()) {
                      streak++;
                    } else {
                      break;
                    }
                  }
                  return `${streak} day${streak !== 1 ? "s" : ""}`;
                })()}
              </Text>
            </View>
            <View
              style={[styles.statDivider, { backgroundColor: colors.border }]}
            />
            <View style={styles.statItem}>
              <Text style={[styles.statEmoji, { color: colors.primary }]}>
                🎯
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Total Sessions
              </Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {Object.values(logs).reduce(
                  (sum, dayLogs) => sum + dayLogs.length,
                  0
                )}
              </Text>
            </View>
            <View
              style={[styles.statDivider, { backgroundColor: colors.border }]}
            />
            <View style={styles.statItem}>
              <Text style={[styles.statEmoji, { color: colors.primary }]}>
                ⏱️
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Active Days
              </Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {Object.keys(logs).length}
              </Text>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>
          <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.infoText, { color: colors.text }]}>
              Daily Counter App
            </Text>
            <Text style={[styles.infoSubtext, { color: colors.textSecondary }]}>
              Version 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setShowEditModal(false);
          setShowLMPDatePicker(false);
          setShowDueDatePicker(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {!showLMPDatePicker && !showDueDatePicker ? (
              <>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Edit Profile
                </Text>
                <Text
                  style={[
                    styles.modalSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Tell us about yourself
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    Name
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.secondary,
                        color: colors.text,
                        borderColor: colors.border,
                      },
                    ]}
                    placeholder="Enter your name"
                    placeholderTextColor={colors.textSecondary}
                    value={editName}
                    onChangeText={setEditName}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    LMP Date
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.dateInput,
                      {
                        backgroundColor: colors.secondary,
                        borderColor: colors.border,
                      },
                    ]}
                    activeOpacity={0.7}
                    onPress={() => setShowLMPDatePicker(true)}
                  >
                    <Text
                      style={[
                        styles.dateInputText,
                        {
                          color: editLmpDate
                            ? colors.text
                            : colors.textSecondary,
                        },
                      ]}
                    >
                      {editLmpDate || "MM/DD/YYYY"}
                    </Text>
                    <Text style={styles.calendarIcon}>📅</Text>
                  </TouchableOpacity>
                  <Text
                    style={[styles.inputHint, { color: colors.textSecondary }]}
                  >
First day of last period (LMP)
                  </Text>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
Expected Due Date
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.dateInput,
                      {
                        backgroundColor: colors.secondary,
                        borderColor: colors.border,
                      },
                    ]}
                    activeOpacity={0.7}
                    onPress={() => setShowDueDatePicker(true)}
                  >
                    <Text
                      style={[
                        styles.dateInputText,
                        { color: editDueDate ? colors.text : colors.textSecondary },
                      ]}
                    >
                      {editDueDate || "MM/DD/YYYY"}
                    </Text>
                    <Text style={styles.calendarIcon}>📅</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : showLMPDatePicker ? (
              <>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Select LMP Date
                </Text>
                <Text
                  style={[
                    styles.modalSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
First day of last period (LMP)
                </Text>
                <View style={styles.datePickerWrapper}>
                  <DateTimePicker
                    value={tempLMPDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleLMPDateChange}
                    minimumDate={new Date(new Date().getFullYear() - 30, 0, 1)}
                    maximumDate={new Date()}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.primary, marginTop: 16 },
                  ]}
                  onPress={() => setShowLMPDatePicker(false)}
                >
                  <Text style={styles.saveButtonText}>Done</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  Select Expected Due Date
                </Text>
                <Text
                  style={[
                    styles.modalSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Your birthday
                </Text>
                <View style={styles.datePickerWrapper}>
                  <DateTimePicker
                    value={tempDueDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={handleDueDateChange}
                    minimumDate={new Date(new Date().getFullYear() - 100, 0, 1)}
                    maximumDate={new Date()}
                  />
                </View>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.primary, marginTop: 16 },
                  ]}
                  onPress={() => setShowDueDatePicker(false)}
                >
                  <Text style={styles.saveButtonText}>Done</Text>
                </TouchableOpacity>
              </>
            )}

            {!showLMPDatePicker && !showDueDatePicker && (
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.saveButton,
                    { backgroundColor: colors.primary },
                  ]}
                  activeOpacity={0.8}
                  onPress={saveProfile}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    styles.cancelButton,
                    { borderColor: colors.border },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => {
                    setShowEditModal(false);
                    setShowLMPDatePicker(false);
                    setShowDueDatePicker(false);
                  }}
                >
                  <Text
                    style={[styles.cancelButtonText, { color: colors.text }]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Android Date Pickers (native dialogs) */}
      {showLMPDatePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={tempLMPDate}
          mode="date"
          display="default"
          onChange={handleLMPDateChange}
          minimumDate={new Date(new Date().getFullYear() - 30, 0, 1)}
          maximumDate={new Date()}
        />
      )}

      {showDueDatePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={tempDueDate}
          mode="date"
          display="default"
          onChange={handleDueDateChange}
          minimumDate={new Date(new Date().getFullYear() - 100, 0, 1)}
          maximumDate={new Date()}
        />
      )}
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
    gap: 24,
  },
  profileCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  infoRow: {
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "400",
  },
  editButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  editButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  sectionDescription: {
    fontSize: 14,
    fontWeight: "400",
    marginBottom: 4,
  },
  themesContainer: {
    gap: 12,
  },
  themeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
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
  themeColorPreview: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  themeEmoji: {
    fontSize: 24,
  },
  themeName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  selectedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedBadgeText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
  statsCard: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  statDivider: {
    width: 1,
    marginHorizontal: 8,
  },
  infoCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
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
  infoText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    minHeight: 400,
  },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  datePickerContainer: {
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
  },
  dateInput: {
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateInputText: {
    fontSize: 16,
    flex: 1,
  },
  calendarIcon: {
    fontSize: 20,
    marginLeft: 8,
  },
  inputHint: {
    fontSize: 12,
    marginTop: 4,
  },
  datePickerWrapper: {
    marginVertical: 20,
    alignItems: "center",
  },
  iosDoneButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  iosDoneButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalButtons: {
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  saveButton: {
    // backgroundColor set dynamically
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
