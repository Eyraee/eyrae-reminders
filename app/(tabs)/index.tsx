import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DynamicText } from '../../src/components/core/DynamicText';
import { GlassSheet } from '../../src/components/core/GlassSheet';
import { NeoCard } from '../../src/components/core/NeoCard';
import { SwipeableCard } from '../../src/components/core/SwipeableCard';
import { useCurvedScreen } from '../../src/hooks/useCurvedScreen';
import { Task, useTaskStore } from '../../src/store/useTaskStore';
import { useThemeStore } from '../../src/store/useThemeStore';
import { metrics } from '../../src/theme/metrics';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const { safeHorizontalPadding } = useCurvedScreen();
  const router = useRouter();
  
  const theme = useThemeStore((state) => state.theme);
  const tasks = useTaskStore((state) => state.tasks);
  const removeTask = useTaskStore((state) => state.removeTask);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const toggleTask = useTaskStore((state) => state.toggleTask);
  const checkUrgencies = useTaskStore((state) => state.checkUrgencies);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [now, setNow] = useState(new Date().getTime());

  useEffect(() => {
    // Check urgencies and update the real-time countdowns every minute
    const interval = setInterval(() => {
      checkUrgencies();
      setNow(new Date().getTime());
    }, 60000); 
    return () => clearInterval(interval);
  }, [checkUrgencies]);

  const handleLongPress = (id: string, title: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert("Remove Task", `Delete "${title}"?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); removeTask(id); }}
    ]);
  };

  const handleTapCard = (task: Task) => {
    Haptics.selectionAsync(); 
    setEditingTask(task);
    setIsSheetOpen(true);
  };

  const openNewTask = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditingTask(null);
    setIsSheetOpen(true);
  };

  const navigateToFocus = (taskId: string) => {
    Haptics.selectionAsync();
    router.push({ pathname: '/focus', params: { taskId } });
  };

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric' });

  // Math to figure out days/hours left for Countdowns
  const getCountdownString = (iso: string) => {
    const dueTime = new Date(iso).getTime();
    const diffHours = (dueTime - now) / (1000 * 60 * 60);
    
    if (diffHours < 0) return { number: '0', unit: 'OVERDUE' };
    if (diffHours < 24) return { number: Math.floor(diffHours).toString(), unit: 'HOURS LEFT' };
    return { number: Math.floor(diffHours / 24).toString(), unit: 'DAYS LEFT' };
  };

  const activeTasks = tasks.filter(t => !t.completed && (!t.isEvent || !t.dueDate));
  const completedTasks = tasks.filter(t => t.completed);
  const countdownTasks = tasks.filter(t => !t.completed && t.isEvent && t.dueDate);

  const renderTask = (task: Task) => {
    const totalSub = task.subTasks?.length || 0;
    const completedSub = task.subTasks?.filter(st => st.completed).length || 0;
    const progress = totalSub > 0 ? (completedSub / totalSub) * 100 : 0;

    return (
      <SwipeableCard key={task.id} isCompleted={task.completed} onComplete={() => toggleTask(task.id)}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => handleTapCard(task)} onLongPress={() => handleLongPress(task.id, task.title)} delayLongPress={400}>
          <NeoCard intensity={task.priority === 'urgent' ? 60 : 35} glowColor={task.priority === 'urgent' && !task.completed ? theme.primary : undefined} style={{ marginBottom: 0 }}>
            
            <View style={styles.cardHeader}>
              <View style={styles.badgeRow}>
                <DynamicText variant="caption" style={task.completed ? { color: theme.textMuted, marginRight: 8 } : task.priority === 'urgent' ? { color: theme.primary, marginRight: 8 } : { color: theme.textMuted, marginRight: 8 }}>
                  {task.completed ? 'COMPLETED' : task.priority === 'urgent' ? 'URGENT' : 'UPCOMING'}
                </DynamicText>
                
                {task.tag && (
                  <View style={[styles.badge, { backgroundColor: `${theme.primary}20` }]}>
                    <DynamicText variant="caption" style={{ color: theme.primary }}>{task.tag}</DynamicText>
                  </View>
                )}
              </View>
              
              <View style={styles.badgeRow}>
                {task.dueDate && !task.completed && (
                  <View style={[styles.badge, { marginRight: 8 }]}>
                    <Feather name="clock" size={10} color={theme.textMuted} style={{ marginRight: 4 }} />
                    <DynamicText variant="caption" color="muted">{formatDate(task.dueDate)}</DynamicText>
                  </View>
                )}
                
                {!task.completed && (
                  <TouchableOpacity onPress={() => navigateToFocus(task.id)} style={styles.focusBtn}>
                    <Feather name="target" size={14} color={theme.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <DynamicText variant="h2" style={{ marginTop: metrics.spacing.sm, textDecorationLine: task.completed ? 'line-through' : 'none', opacity: task.completed ? 0.5 : 1 }}>{task.title}</DynamicText>
            {task.subtitle && <DynamicText variant="body" color="muted" style={{ marginTop: metrics.spacing.xs, opacity: task.completed ? 0.5 : 1 }}>{task.subtitle}</DynamicText>}

            {totalSub > 0 && !task.completed && (
              <View style={styles.progressContainer}>
                <View style={[styles.progressBarBg, { backgroundColor: 'rgba(255,255,255,0.05)' }]}>
                  <View style={[styles.progressBarFill, { width: `${progress}%`, backgroundColor: theme.primary }]} />
                </View>
                <DynamicText variant="caption" color="muted" style={{ marginLeft: 8 }}>{completedSub}/{totalSub}</DynamicText>
              </View>
            )}
          </NeoCard>
        </TouchableOpacity>
      </SwipeableCard>
    );
  };

  const renderCountdown = (task: Task) => {
    const countdown = task.dueDate ? getCountdownString(task.dueDate) : { number: '?', unit: '' };
    
    return (
      <SwipeableCard key={task.id} isCompleted={false} onComplete={() => toggleTask(task.id)}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => handleTapCard(task)} onLongPress={() => handleLongPress(task.id, task.title)}>
          <NeoCard intensity={50} glowColor={theme.primary} style={{ marginBottom: 0 }}>
            <View style={styles.countdownWrapper}>
              <View style={{ flex: 1 }}>
                <View style={[styles.badge, { backgroundColor: `${theme.primary}20`, alignSelf: 'flex-start', marginBottom: 8 }]}>
                  <Feather name="star" size={12} color={theme.primary} style={{ marginRight: 4 }} />
                  <DynamicText variant="caption" style={{ color: theme.primary }}>PINNED EVENT</DynamicText>
                </View>
                <DynamicText variant="h2" style={{ fontSize: 24, color: theme.text }}>{task.title}</DynamicText>
                {task.subtitle && <DynamicText variant="body" color="muted" style={{ marginTop: 4 }}>{task.subtitle}</DynamicText>}
              </View>
              
              <View style={styles.countdownBox}>
                <DynamicText variant="h1" style={{ fontSize: 32, color: theme.primary, fontFamily: 'monospace' }}>{countdown.number}</DynamicText>
                <DynamicText variant="caption" color="muted" style={{ fontSize: 10, marginTop: -4 }}>{countdown.unit}</DynamicText>
              </View>
            </View>
          </NeoCard>
        </TouchableOpacity>
      </SwipeableCard>
    );
  };

  return (
    <View style={styles.mainWrapper}>
      <ScrollView style={styles.container} contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + metrics.spacing.lg, paddingHorizontal: safeHorizontalPadding }]}>
        <View style={styles.header}>
          <DynamicText variant="h1">Good morning,</DynamicText>
          <DynamicText variant="h1" style={{ color: theme.primary }}>Eyrae.</DynamicText>
        </View>

        {countdownTasks.length > 0 && (
          <View style={{ marginBottom: metrics.spacing.lg }}>
            {countdownTasks.map(renderCountdown)}
          </View>
        )}

        {activeTasks.map(renderTask)}

        {completedTasks.length > 0 && (
          <View style={{ marginTop: metrics.spacing.xl }}>
            <DynamicText variant="caption" color="muted" style={{ marginBottom: metrics.spacing.md, letterSpacing: 1.5 }}>COMPLETED</DynamicText>
            {completedTasks.map(renderTask)}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity style={[styles.fab, { bottom: 110, right: safeHorizontalPadding, backgroundColor: theme.primary, shadowColor: theme.primary }]} activeOpacity={0.8} onPress={openNewTask}>
        <Feather name="plus" size={32} color="#FFFFFF" />
      </TouchableOpacity>

      <GlassSheet visible={isSheetOpen} onClose={() => setIsSheetOpen(false)} onSave={(taskData) => editingTask ? updateTask(editingTask.id, taskData) : addTask(taskData)} initialData={editingTask} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 240 }, 
  header: { marginBottom: metrics.spacing.xl },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badgeRow: { flexDirection: 'row', alignItems: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  focusBtn: { padding: 6, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)' },
  progressContainer: { flexDirection: 'row', alignItems: 'center', marginTop: metrics.spacing.md },
  progressBarBg: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 2 },
  countdownWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  countdownBox: { alignItems: 'center', justifyContent: 'center', paddingLeft: 16, borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.1)' },
  fab: { position: 'absolute', width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.8, shadowRadius: 16, elevation: 10 }
});