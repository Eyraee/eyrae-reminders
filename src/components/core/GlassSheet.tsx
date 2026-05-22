import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { SubTask, Task, useTaskStore } from "../../store/useTaskStore";
import { useThemeStore } from "../../store/useThemeStore";
import { metrics } from "../../theme/metrics";
import { DynamicText } from "./DynamicText";
import { GlassSwitch } from "./GlassSwitch";

interface GlassSheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, "id" | "completed">) => void;
  initialData?: Task | null;
}

export const GlassSheet = ({
  visible,
  onClose,
  onSave,
  initialData,
}: GlassSheetProps) => {
  const theme = useThemeStore((state) => state.theme);
  const availableTags = useTaskStore((state) => state.availableTags);
  const createTag = useTaskStore((state) => state.createTag);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [priority, setPriority] = useState<"normal" | "urgent">("normal");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(undefined);
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [isEvent, setIsEvent] = useState(false);

  const [showPicker, setShowPicker] = useState(false);
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [newTagText, setNewTagText] = useState("");
  const [newSubTaskText, setNewSubTaskText] = useState("");

  const translateY = useSharedValue(1000);
  const backdropOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, {
        damping: 28,
        stiffness: 250,
        mass: 1,
      });
      backdropOpacity.value = withTiming(1, {
        duration: 250,
        easing: Easing.out(Easing.ease),
      });

      if (initialData) {
        setTitle(initialData.title);
        setSubtitle(initialData.subtitle || "");
        setPriority(initialData.priority);
        setDueDate(
          initialData.dueDate ? new Date(initialData.dueDate) : undefined,
        );
        setSelectedTag(initialData.tag);
        setSubTasks(initialData.subTasks || []);
        setIsEvent(initialData.isEvent || false);
      } else {
        setTitle("");
        setSubtitle("");
        setPriority("normal");
        setDueDate(undefined);
        setSelectedTag(undefined);
        setSubTasks([]);
        setIsEvent(false);
      }
      setIsAddingTag(false);
      setNewTagText("");
      setNewSubTaskText("");
    } else {
      translateY.value = withTiming(1000, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, initialData]);

  const triggerClose = () => {
    translateY.value = withTiming(1000, {
      duration: 300,
      easing: Easing.in(Easing.ease),
    });
    backdropOpacity.value = withTiming(0, { duration: 200 }, () =>
      runOnJS(onClose)(),
    );
  };

  const handleSave = () => {
    if (!title.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave({
      title,
      subtitle,
      priority,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
      tag: selectedTag,
      subTasks,
      isEvent,
    });
    triggerClose();
  };

  const handleCreateTag = () => {
    if (newTagText.trim()) {
      createTag(newTagText);
      setSelectedTag(newTagText.trim());
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setIsAddingTag(false);
    setNewTagText("");
  };

  const handleAddSubTask = () => {
    if (newSubTaskText.trim()) {
      setSubTasks([
        ...subTasks,
        {
          id: Math.random().toString(),
          title: newSubTaskText.trim(),
          completed: false,
        },
      ]);
      setNewSubTaskText("");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleRemoveSubTask = (id: string) => {
    setSubTasks(subTasks.filter((st) => st.id !== id));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const animatedSheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const animatedBackdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  return (
    <Modal visible={visible} transparent animationType="none">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Animated.View style={[StyleSheet.absoluteFill, animatedBackdropStyle]}>
          <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill}>
            <Pressable style={styles.backdropCloser} onPress={triggerClose} />
          </BlurView>
        </Animated.View>

        <Animated.View style={[styles.sheet, animatedSheetStyle]}>
          <View style={styles.dragHandle} />
          <DynamicText variant="h2" style={styles.headerText}>
            {initialData ? "Edit Task" : "New Task"}
          </DynamicText>

          <ScrollView
            style={{ maxHeight: 500 }}
            showsVerticalScrollIndicator={false}
          >
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="What needs to be done?"
              placeholderTextColor={theme.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            {/* UPGRADED MARKDOWN EDITOR UI */}
            <TextInput
              style={[styles.input, styles.textArea, { color: theme.text }]}
              placeholder="Markdown supported! (# Headers, - Lists, ``` Code)"
              placeholderTextColor={theme.textMuted}
              value={subtitle}
              onChangeText={setSubtitle}
              multiline
            />

            <View style={styles.subTaskWrapper}>
              {subTasks.map((st) => (
                <View key={st.id} style={styles.subTaskItem}>
                  <DynamicText
                    variant="body"
                    style={{ flex: 1, color: theme.text }}
                  >
                    {st.title}
                  </DynamicText>
                  <TouchableOpacity
                    onPress={() => handleRemoveSubTask(st.id)}
                    style={{ padding: 4 }}
                  >
                    <Feather name="minus-circle" size={18} color="#FF4500" />
                  </TouchableOpacity>
                </View>
              ))}
              <TextInput
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    marginTop: 8,
                    paddingVertical: 12,
                    marginBottom: 0,
                  },
                ]}
                placeholder="Add sub-task... (Press Enter to save)"
                placeholderTextColor={theme.textMuted}
                value={newSubTaskText}
                onChangeText={setNewSubTaskText}
                onSubmitEditing={handleAddSubTask}
              />
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  priority === "urgent" && {
                    borderColor: theme.primary,
                    backgroundColor: `${theme.primary}15`,
                  },
                  { marginRight: metrics.spacing.sm },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setPriority((p) => (p === "normal" ? "urgent" : "normal"));
                }}
              >
                <DynamicText
                  color={priority === "urgent" ? "primary" : "muted"}
                  variant="caption"
                >
                  {priority === "urgent" ? "🔥 URGENT" : "☕ NORMAL"}
                </DynamicText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  dueDate && {
                    borderColor: theme.primary,
                    backgroundColor: `${theme.primary}15`,
                  },
                  { marginLeft: metrics.spacing.sm },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowPicker(true);
                }}
              >
                <Feather
                  name="calendar"
                  size={14}
                  color={dueDate ? theme.primary : theme.textMuted}
                  style={{ marginRight: 6 }}
                />
                <DynamicText
                  color={dueDate ? "primary" : "muted"}
                  variant="caption"
                >
                  {dueDate
                    ? dueDate.toLocaleDateString([], {
                        month: "short",
                        day: "numeric",
                      })
                    : "SET DATE"}
                </DynamicText>
              </TouchableOpacity>
            </View>

            <View style={styles.tagSection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {!isAddingTag ? (
                  <TouchableOpacity
                    style={styles.addTagBtn}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setIsAddingTag(true);
                    }}
                  >
                    <Feather name="plus" size={14} color={theme.textMuted} />
                    <DynamicText
                      variant="caption"
                      color="muted"
                      style={{ marginLeft: 4 }}
                    >
                      Tag
                    </DynamicText>
                  </TouchableOpacity>
                ) : (
                  <TextInput
                    style={[
                      styles.tagInput,
                      { color: theme.text, borderColor: theme.primary },
                    ]}
                    placeholder="New tag..."
                    placeholderTextColor={theme.textMuted}
                    value={newTagText}
                    onChangeText={setNewTagText}
                    onSubmitEditing={handleCreateTag}
                    autoFocus
                  />
                )}
                {availableTags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagPill,
                      selectedTag === tag && {
                        backgroundColor: theme.primary,
                        borderColor: theme.primary,
                      },
                    ]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedTag(selectedTag === tag ? undefined : tag);
                    }}
                  >
                    <DynamicText
                      variant="caption"
                      style={{
                        color: selectedTag === tag ? "#FFF" : theme.textMuted,
                      }}
                    >
                      {tag}
                    </DynamicText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {dueDate && (
              <View style={styles.eventRow}>
                <View>
                  <DynamicText variant="h2" style={{ fontSize: 16 }}>
                    Pin as Countdown
                  </DynamicText>
                  <DynamicText variant="caption" color="muted">
                    Display a massive timer on home screen
                  </DynamicText>
                </View>
                <GlassSwitch
                  value={isEvent}
                  onValueChange={(v) => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setIsEvent(v);
                  }}
                  activeColor={theme.primary}
                />
              </View>
            )}
          </ScrollView>

          {showPicker && (
            <DateTimePicker
              value={dueDate || new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowPicker(false);
                if (date) {
                  setDueDate(date);
                  Haptics.selectionAsync();
                }
              }}
            />
          )}

          <TouchableOpacity
            style={[
              styles.saveBtn,
              { backgroundColor: theme.primary, marginTop: metrics.spacing.md },
            ]}
            onPress={handleSave}
          >
            <DynamicText variant="h2" style={{ color: "#FFF" }}>
              Save Task
            </DynamicText>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "flex-end" },
  backdropCloser: { flex: 1 },
  sheet: {
    backgroundColor: "rgba(10, 10, 15, 0.95)",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: metrics.spacing.lg,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignSelf: "center",
    marginBottom: metrics.spacing.lg,
  },
  headerText: { marginBottom: metrics.spacing.md },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    fontSize: 16,
    paddingHorizontal: metrics.spacing.md,
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    minHeight: 48,
    borderRadius: metrics.borderRadius.medium,
    marginBottom: metrics.spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    textAlignVertical: "center",
  },
  textArea: { minHeight: 140, textAlignVertical: "top" }, // Made this significantly larger for coding
  subTaskWrapper: { marginBottom: metrics.spacing.md },
  subTaskItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  row: { flexDirection: "row", marginBottom: metrics.spacing.md },
  actionBtn: {
    flex: 1,
    padding: metrics.spacing.md,
    borderRadius: metrics.borderRadius.medium,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
    flexDirection: "row",
  },
  tagSection: {
    marginBottom: metrics.spacing.md,
    flexDirection: "row",
    alignItems: "center",
  },
  addTagBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginRight: 8,
    justifyContent: "center",
  },
  tagInput: {
    minHeight: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 8 : 4,
    marginRight: 8,
    minWidth: 90,
    fontSize: 14,
    textAlignVertical: "center",
  },
  tagPill: {
    paddingHorizontal: 12,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    marginRight: 8,
    justifyContent: "center",
  },
  eventRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.02)",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  saveBtn: {
    padding: metrics.spacing.md,
    borderRadius: metrics.borderRadius.large,
    alignItems: "center",
  },
});
