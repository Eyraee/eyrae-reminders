import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false }),
  });
} catch (e) {
  console.warn("Notifications bypass active.");
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  subtitle?: string;
  priority: 'normal' | 'urgent';
  completed: boolean;
  dueDate?: string; 
  notificationId?: string; 
  tag?: string; 
  subTasks?: SubTask[];
  isEvent?: boolean; // NEW: Flags a task as a pinned countdown
}

interface TaskStore {
  tasks: Task[];
  availableTags: string[];
  addTask: (task: Omit<Task, 'id' | 'completed' | 'notificationId'>) => Promise<void>;
  updateTask: (id: string, updatedFields: Partial<Task>) => Promise<void>;
  removeTask: (id: string) => Promise<void>;
  toggleTask: (id: string) => void;
  toggleSubTask: (taskId: string, subTaskId: string) => void;
  checkUrgencies: () => void;
  clearTasks: () => Promise<void>; 
  createTag: (tag: string) => void; 
}

const scheduleTaskNotification = async (title: string, dueDateIso: string) => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return undefined;
    const dueTime = new Date(dueDateIso).getTime();
    const triggerTime = dueTime - (60 * 60 * 1000); 
    if (triggerTime > Date.now()) {
      return await Notifications.scheduleNotificationAsync({
        content: { title: 'Task Due Soon 🔥', body: `"${title}" is due in 1 hour.` },
        trigger: new Date(triggerTime),
      });
    }
  } catch (error) { return undefined; }
  return undefined;
};

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [],
      availableTags: ['Development', 'Art', 'Personal'],
      
      createTag: (tag) => set((state) => {
        if (state.availableTags.includes(tag.trim())) return state;
        return { availableTags: [...state.availableTags, tag.trim()] };
      }),

      addTask: async (task) => {
        let notifId = undefined;
        if (task.dueDate) notifId = await scheduleTaskNotification(task.title, task.dueDate);
        set((state) => ({ tasks: [...state.tasks, { ...task, id: Math.random().toString(), completed: false, notificationId: notifId }] }));
      },
      
      updateTask: async (id, updatedFields) => {
        const state = get();
        const existingTask = state.tasks.find(t => t.id === id);
        let newNotifId = existingTask?.notificationId;

        if (updatedFields.dueDate && updatedFields.dueDate !== existingTask?.dueDate) {
          try { if (newNotifId) await Notifications.cancelScheduledNotificationAsync(newNotifId); } catch (e) {}
          newNotifId = await scheduleTaskNotification(updatedFields.title || existingTask!.title, updatedFields.dueDate);
        }

        set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, ...updatedFields, notificationId: newNotifId } : t) }));
      },
      
      removeTask: async (id) => {
        const task = get().tasks.find(t => t.id === id);
        if (task?.notificationId) {
          try { await Notifications.cancelScheduledNotificationAsync(task.notificationId); } catch (e) {}
        }
        set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) }));
      },
      
      toggleTask: (id) => set((state) => ({ tasks: state.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t) })),
      
      toggleSubTask: (taskId, subTaskId) => set((state) => ({
        tasks: state.tasks.map(task => {
          if (task.id !== taskId || !task.subTasks) return task;
          return {
            ...task,
            subTasks: task.subTasks.map(st => st.id === subTaskId ? { ...st, completed: !st.completed } : st)
          };
        })
      })),

      checkUrgencies: () => {
        const now = new Date().getTime();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.dueDate && task.priority !== 'urgent' && !task.completed) {
              const dueTime = new Date(task.dueDate).getTime();
              if (dueTime - now < twentyFourHours && dueTime - now > 0) return { ...task, priority: 'urgent' };
            }
            return task;
          })
        }));
      },

      clearTasks: async () => {
        const state = get();
        for (const task of state.tasks) {
          if (task.notificationId) {
            try { await Notifications.cancelScheduledNotificationAsync(task.notificationId); } catch (e) {}
          }
        }
        set({ tasks: [] });
      }
    }),
    { name: 'eyrae-task-storage', storage: createJSONStorage(() => AsyncStorage) }
  )
);