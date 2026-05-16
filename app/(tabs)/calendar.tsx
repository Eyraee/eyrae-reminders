import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DynamicText } from '../../src/components/core/DynamicText';
import { NeoCard } from '../../src/components/core/NeoCard';
import { useCurvedScreen } from '../../src/hooks/useCurvedScreen';
import { useTaskStore } from '../../src/store/useTaskStore';
import { midnightTheme } from '../../src/theme/colors';
import { metrics } from '../../src/theme/metrics';

export default function CalendarScreen() {
  const insets = useSafeAreaInsets();
  const { safeHorizontalPadding } = useCurvedScreen();
  const tasks = useTaskStore((state) => state.tasks);

  // Default to today
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Generate a fluid timeline (e.g., 3 days ago to 14 days in the future)
  const timelineDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    for (let i = -3; i <= 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    return dates;
  }, []);

  // Filter tasks based on the selected date
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getFullYear() === selectedDate.getFullYear() &&
        taskDate.getMonth() === selectedDate.getMonth() &&
        taskDate.getDate() === selectedDate.getDate()
      );
    });
  }, [tasks, selectedDate]);

  const handleSelectDate = (date: Date) => {
    Haptics.selectionAsync();
    setSelectedDate(date);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <View style={styles.mainWrapper}>
      <View style={[styles.header, { paddingTop: insets.top + metrics.spacing.lg, paddingHorizontal: safeHorizontalPadding }]}>
        <DynamicText variant="h1">Timeline</DynamicText>
        <DynamicText variant="body" color="muted" style={{ marginTop: metrics.spacing.xs }}>
          {selectedDate.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </DynamicText>
      </View>

      {/* The Horizontal Date Strip */}
      <View style={styles.timelineWrapper}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: safeHorizontalPadding }}
        >
          {timelineDates.map((date, index) => {
            const isSelected = 
              date.getDate() === selectedDate.getDate() && 
              date.getMonth() === selectedDate.getMonth();

            return (
              <TouchableOpacity 
                key={index} 
                activeOpacity={0.7}
                onPress={() => handleSelectDate(date)}
                style={[
                  styles.dateBubble,
                  isSelected && styles.dateBubbleSelected
                ]}
              >
                <DynamicText 
                  variant="caption" 
                  color={isSelected ? 'primary' : 'muted'}
                  style={{ marginBottom: 4 }}
                >
                  {date.toLocaleDateString([], { weekday: 'short' }).toUpperCase()}
                </DynamicText>
                <DynamicText 
                  variant="h2" 
                  color={isSelected ? 'default' : 'muted'}
                >
                  {date.getDate()}
                </DynamicText>
                {/* A tiny dot to indicate "Today" */}
                {isToday(date) && <View style={styles.todayDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* The Vertical Task Agenda */}
      <ScrollView 
        style={styles.agendaContainer}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: safeHorizontalPadding }
        ]}
      >
        {filteredTasks.length === 0 ? (
          <Animated.View entering={FadeInDown.springify().damping(20)} style={styles.emptyState}>
            <Feather name="coffee" size={48} color={midnightTheme.surfaceHighlight} style={{ marginBottom: metrics.spacing.md }} />
            <DynamicText variant="h2" color="muted">Clear skies.</DynamicText>
            <DynamicText variant="body" color="muted" align="center" style={{ marginTop: metrics.spacing.xs }}>
              No tasks scheduled for this day.
            </DynamicText>
          </Animated.View>
        ) : (
          filteredTasks.map((task) => (
            <Animated.View key={task.id} layout={Layout.springify().damping(24).stiffness(220)}>
              <NeoCard 
                intensity={task.priority === 'urgent' ? 60 : 35} 
                glowColor={task.priority === 'urgent' ? midnightTheme.primary : undefined} 
                style={styles.cardSpacing}
              >
                <View style={styles.cardHeader}>
                  <DynamicText variant="caption" color={task.priority === 'urgent' ? 'primary' : 'muted'}>
                    {task.priority === 'urgent' ? 'URGENT' : 'SCHEDULED'}
                  </DynamicText>
                </View>
                
                <DynamicText variant="h2" style={{ marginTop: metrics.spacing.sm }}>
                  {task.title}
                </DynamicText>
                
                {task.subtitle && (
                  <DynamicText variant="body" color="muted" style={{ marginTop: metrics.spacing.xs }}>
                    {task.subtitle}
                  </DynamicText>
                )}
              </NeoCard>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { 
    flex: 1 
  },
  header: { 
    marginBottom: metrics.spacing.md 
  },
  timelineWrapper: {
    height: 100,
    marginBottom: metrics.spacing.md,
  },
  dateBubble: {
    width: 64,
    height: 84,
    borderRadius: metrics.borderRadius.large,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: metrics.spacing.sm,
  },
  dateBubbleSelected: {
    backgroundColor: 'rgba(138, 43, 226, 0.15)',
    borderColor: midnightTheme.primary,
  },
  todayDot: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: midnightTheme.primary,
  },
  agendaContainer: { 
    flex: 1 
  },
  scrollContent: { 
    paddingBottom: 180 
  },
  cardSpacing: { 
    marginBottom: metrics.spacing.md 
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  }
});