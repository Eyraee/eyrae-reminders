import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import * as Sharing from "expo-sharing";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp, Layout } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DynamicText } from "../../src/components/core/DynamicText";
import { GlassSwitch } from "../../src/components/core/GlassSwitch";
import { NeoCard } from "../../src/components/core/NeoCard";
import { useCurvedScreen } from "../../src/hooks/useCurvedScreen";
import { useTaskStore } from "../../src/store/useTaskStore";
import { useThemeStore, VIBES } from "../../src/store/useThemeStore";
import { metrics } from "../../src/theme/metrics";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { safeHorizontalPadding } = useCurvedScreen();

  const currentTheme = useThemeStore((state) => state.theme);
  const setVibe = useThemeStore((state) => state.setVibe);
  const profileName = useThemeStore((state) => state.profileName);
  const setProfileName = useThemeStore((state) => state.setProfileName);
  const profilePic = useThemeStore((state) => state.profilePic);
  const setProfilePic = useThemeStore((state) => state.setProfilePic);

  const clearTasks = useTaskStore((state) => state.clearTasks);

  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [autoEscalate, setAutoEscalate] = useState(true);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profileName);

  const pickImage = async () => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
      if (hapticsEnabled)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setProfileName(tempName.trim());
      if (hapticsEnabled)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setIsEditingName(false);
  };

  const handleVibeSelect = (id: string) => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setVibe(id);
  };

  const toggleHaptics = (val: boolean) => {
    if (val) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHapticsEnabled(val);
  };

  const toggleEscalation = (val: boolean) => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAutoEscalate(val);
  };

  const handleExportData = async () => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const taskData = await AsyncStorage.getItem("eyrae-task-storage");
      const themeData = await AsyncStorage.getItem("eyrae-theme-storage");

      const backup = {
        version: "1.0",
        date: new Date().toISOString(),
        tasks: taskData ? JSON.parse(taskData) : null,
        theme: themeData ? JSON.parse(themeData) : null,
      };

      const fileUri = `${FileSystem.documentDirectory}Wisp_Backup_${new Date().getTime()}.json`;
      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(backup, null, 2),
      );

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: "Export Wisp Backup",
        });
      } else {
        Alert.alert("Error", "Sharing is not available on this device");
      }
    } catch (e) {
      console.warn("Export Error:", e);
      Alert.alert("Export Failed", "Could not create backup file.");
    }
  };

  const handleImportData = async () => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/json", "*/*"],
      });
      if (result.canceled) return;

      const fileContent = await FileSystem.readAsStringAsync(
        result.assets[0].uri,
      );
      const backup = JSON.parse(fileContent);

      if (!backup.tasks || !backup.theme) {
        Alert.alert(
          "Invalid File",
          "This does not look like a valid Wisp backup file.",
        );
        return;
      }

      Alert.alert(
        "Restore Backup?",
        "This will OVERWRITE your current tasks and settings. This cannot be undone.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Restore",
            style: "destructive",
            onPress: async () => {
              await AsyncStorage.setItem(
                "eyrae-task-storage",
                JSON.stringify(backup.tasks),
              );
              await AsyncStorage.setItem(
                "eyrae-theme-storage",
                JSON.stringify(backup.theme),
              );
              if (hapticsEnabled)
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success,
                );
              Alert.alert(
                "Success",
                "Backup restored! Please restart Wisp to apply changes.",
              );
            },
          },
        ],
      );
    } catch (e) {
      console.warn("Import Error:", e);
      Alert.alert("Import Failed", "Could not read the backup file.");
    }
  };

  const handleClearData = () => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Purge All Data",
      "This will permanently delete all your reminders. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Purge",
          style: "destructive",
          onPress: () => {
            if (hapticsEnabled)
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
            clearTasks();
          },
        },
      ],
    );
  };

  return (
    <View style={styles.mainWrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + metrics.spacing.lg,
            paddingHorizontal: safeHorizontalPadding,
          },
        ]}
      >
        <View style={styles.header}>
          <DynamicText variant="h1">Control Center</DynamicText>
        </View>

        {/* --- PROFILE SECTION --- */}
        <Animated.View
          entering={FadeInUp.springify().damping(24).delay(50)}
          layout={Layout.springify()}
        >
          <View
            style={[
              styles.profileSection,
              { backgroundColor: "rgba(255,255,255,0.03)" },
            ]}
          >
            <View style={styles.profileRow}>
              <TouchableOpacity
                onPress={pickImage}
                style={[
                  styles.bigAvatar,
                  { borderColor: currentTheme.surfaceHighlight },
                ]}
              >
                {profilePic ? (
                  <Image
                    source={{ uri: profilePic }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Feather
                    name="camera"
                    size={32}
                    color={currentTheme.textMuted}
                  />
                )}
                <View
                  style={[
                    styles.editBadge,
                    { backgroundColor: currentTheme.primary },
                  ]}
                >
                  <Feather name="edit-2" size={12} color="#FFF" />
                </View>
              </TouchableOpacity>

              <View style={styles.nameSection}>
                <DynamicText variant="caption" color="muted">
                  DISPLAY NAME
                </DynamicText>
                {isEditingName ? (
                  <TextInput
                    style={[
                      styles.nameInput,
                      {
                        color: currentTheme.text,
                        borderBottomColor: currentTheme.primary,
                      },
                    ]}
                    value={tempName}
                    onChangeText={setTempName}
                    onSubmitEditing={handleSaveName}
                    autoFocus
                    onBlur={handleSaveName}
                  />
                ) : (
                  <TouchableOpacity
                    onPress={() => setIsEditingName(true)}
                    style={styles.nameDisplayRow}
                  >
                    <DynamicText
                      variant="h2"
                      style={{
                        color: currentTheme.text,
                        fontSize: 24,
                        marginRight: 8,
                      }}
                    >
                      {profileName}
                    </DynamicText>
                    <Feather
                      name="edit-2"
                      size={16}
                      color={currentTheme.textMuted}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* --- UPGRADED GRID AESTHETIC VIBE SELECTOR --- */}
        <Animated.View
          entering={FadeInUp.springify().damping(24).delay(100)}
          layout={Layout.springify()}
        >
          <DynamicText
            variant="caption"
            color="muted"
            style={[styles.sectionTitle, { marginTop: metrics.spacing.lg }]}
          >
            AESTHETIC VIBE
          </DynamicText>
          <View style={styles.vibeGrid}>
            {Object.values(VIBES).map((vibe) => (
              <TouchableOpacity
                key={vibe.id}
                activeOpacity={0.8}
                onPress={() => handleVibeSelect(vibe.id)}
                style={[
                  styles.vibeGridItem,
                  currentTheme.id === vibe.id && {
                    borderColor: vibe.primary,
                    backgroundColor: `${vibe.primary}15`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.vibeColorDot,
                    { backgroundColor: vibe.primary },
                  ]}
                />
                <DynamicText
                  variant="body"
                  color={currentTheme.id === vibe.id ? "default" : "muted"}
                  style={{ fontSize: 13 }}
                >
                  {vibe.name}
                </DynamicText>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* --- PREFERENCES --- */}
        <Animated.View
          entering={FadeInUp.springify().damping(24).delay(200)}
          layout={Layout.springify()}
        >
          <DynamicText
            variant="caption"
            color="muted"
            style={styles.sectionTitle}
          >
            PREFERENCES
          </DynamicText>
          <NeoCard intensity={40} style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <View style={styles.settingTextContent}>
                <DynamicText variant="h2" style={{ fontSize: 18 }}>
                  Sensory Haptics
                </DynamicText>
                <DynamicText
                  variant="caption"
                  color="muted"
                  style={{ marginTop: 2 }}
                >
                  Physical feedback on interactions
                </DynamicText>
              </View>
              <GlassSwitch
                value={hapticsEnabled}
                onValueChange={toggleHaptics}
                activeColor={currentTheme.primary}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingTextContent}>
                <DynamicText variant="h2" style={{ fontSize: 18 }}>
                  Auto-Escalation
                </DynamicText>
                <DynamicText
                  variant="caption"
                  color="muted"
                  style={{ marginTop: 2 }}
                >
                  Mark tasks urgent 24h before due
                </DynamicText>
              </View>
              <GlassSwitch
                value={autoEscalate}
                onValueChange={toggleEscalation}
                activeColor={currentTheme.primary}
              />
            </View>
          </NeoCard>
        </Animated.View>

        {/* --- DATA MANAGEMENT --- */}
        <Animated.View
          entering={FadeInUp.springify().damping(24).delay(250)}
          layout={Layout.springify()}
        >
          <DynamicText
            variant="caption"
            color="muted"
            style={[styles.sectionTitle, { marginTop: metrics.spacing.lg }]}
          >
            DATA MANAGEMENT
          </DynamicText>
          <NeoCard intensity={30} style={styles.settingsCard}>
            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleExportData}
            >
              <View style={styles.settingTextContent}>
                <DynamicText
                  variant="h2"
                  style={{ fontSize: 18, color: currentTheme.primary }}
                >
                  Export Backup
                </DynamicText>
                <DynamicText
                  variant="caption"
                  color="muted"
                  style={{ marginTop: 2 }}
                >
                  Save tasks & settings to a .json file
                </DynamicText>
              </View>
              <Feather
                name="download-cloud"
                size={20}
                color={currentTheme.primary}
              />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              style={styles.settingRow}
              onPress={handleImportData}
            >
              <View style={styles.settingTextContent}>
                <DynamicText variant="h2" style={{ fontSize: 18 }}>
                  Restore Backup
                </DynamicText>
                <DynamicText
                  variant="caption"
                  color="muted"
                  style={{ marginTop: 2 }}
                >
                  Load a previous Wisp state
                </DynamicText>
              </View>
              <Feather
                name="upload-cloud"
                size={20}
                color={currentTheme.text}
              />
            </TouchableOpacity>
          </NeoCard>
        </Animated.View>

        {/* --- DANGER ZONE --- */}
        <Animated.View
          entering={FadeInUp.springify().damping(24).delay(300)}
          layout={Layout.springify()}
        >
          <DynamicText
            variant="caption"
            color="muted"
            style={[styles.sectionTitle, { marginTop: metrics.spacing.lg }]}
          >
            DANGER ZONE
          </DynamicText>
          <TouchableOpacity activeOpacity={0.7} onPress={handleClearData}>
            <NeoCard intensity={30} style={styles.dangerCard}>
              <Feather
                name="trash-2"
                size={24}
                color="#FF4500"
                style={{ marginRight: metrics.spacing.md }}
              />
              <View style={styles.settingTextContent}>
                <DynamicText
                  variant="h2"
                  style={{ fontSize: 18, color: "#FF4500" }}
                >
                  Purge Data
                </DynamicText>
                <DynamicText
                  variant="caption"
                  color="muted"
                  style={{ marginTop: 2 }}
                >
                  Wipe all reminders from device
                </DynamicText>
              </View>
            </NeoCard>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 180 },
  header: { marginBottom: metrics.spacing.xl },
  sectionTitle: {
    marginBottom: metrics.spacing.sm,
    letterSpacing: 1.5,
    paddingLeft: metrics.spacing.xs,
  },

  profileSection: {
    padding: metrics.spacing.lg,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  profileRow: { flexDirection: "row", alignItems: "center" },
  bigAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginRight: metrics.spacing.lg,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  avatarImage: { width: "100%", height: "100%", resizeMode: "cover" },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#08080A",
  },
  nameSection: { flex: 1 },
  nameDisplayRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  nameInput: {
    fontSize: 24,
    fontWeight: "bold",
    paddingVertical: 4,
    borderBottomWidth: 2,
    marginTop: 4,
  },

  // NEW: Grid layout for themes
  vibeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: metrics.spacing.xl,
  },
  vibeGridItem: {
    width: "48%", // Forces exactly two items per row
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: metrics.spacing.sm,
    paddingHorizontal: metrics.spacing.md,
    borderRadius: metrics.borderRadius.medium,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    marginBottom: metrics.spacing.md,
  },
  vibeColorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: metrics.spacing.sm,
  },

  settingsCard: { padding: metrics.spacing.md },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: metrics.spacing.sm,
  },
  settingTextContent: { flex: 1, paddingRight: metrics.spacing.md },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    marginVertical: metrics.spacing.sm,
  },
  dangerCard: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "rgba(255, 69, 0, 0.2)",
    backgroundColor: "rgba(255, 69, 0, 0.05)",
    padding: metrics.spacing.md,
  },
});
