import { useEffect, useState } from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import AddTaskModal, { TaskFormResult } from "../components/AddTaskModal";
import CongratsModal from "../components/CongratsModal";
import LoadingScreen from "../components/LoadingScreen";
import NameEntryScreen from "../components/NameEntryScreen";
import TaskCard from "../components/TaskCard";
import { Colors } from "../constants/colors";
import {
  cancelTaskReminder,
  registerForNotificationsAsync,
  scheduleTaskReminder,
} from "../utils/notifications";
import { defaultData, loadData, saveData } from "../utils/storage";
import { AppData, Task } from "../utils/types";

type Screen = "loading" | "name" | "home";
type Filter = "All" | "Active" | "Done";

export default function Index() {
  const [screen, setScreen] = useState<Screen>("loading");
  const [data, setData] = useState<AppData>(defaultData);
  const [filter, setFilter] = useState<Filter>("All");

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [congrats, setCongrats] = useState<{
    title: string;
    points: number;
  } | null>(null);

  const [minTimeDone, setMinTimeDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // ── Initial load ──────────────────────────────────────────
  useEffect(() => {
    registerForNotificationsAsync();
    loadData().then((d) => {
      setData(d);
      setDataLoaded(true);
    });
  }, []);

  // Once the loading animation has shown for a minimum time AND
  // the saved data has finished loading, decide which screen to show.
  useEffect(() => {
    if (minTimeDone && dataLoaded && screen === "loading") {
      setScreen(data.userName ? "home" : "name");
    }
  }, [minTimeDone, dataLoaded]);

  function handleLoadingDone() {
    setMinTimeDone(true);
  }

  async function handleSaveName(name: string) {
    const updated = { ...data, userName: name };
    setData(updated);
    await saveData(updated);
    setScreen("home");
  }

  // ── Task CRUD ─────────────────────────────────────────────
  function openAddTask() {
    setEditingTask(null);
    setModalVisible(true);
  }

  function openEditTask(task: Task) {
    setEditingTask(task);
    setModalVisible(true);
  }

  async function handleSaveTask(form: TaskFormResult) {
    let updatedTasks: Task[];

    if (editingTask) {
      // Cancel old reminder before scheduling a new one
      await cancelTaskReminder(editingTask.notificationId);

      let notificationId: string | null = null;
      if (form.deadline) {
        notificationId = await scheduleTaskReminder(form.title, form.deadline);
      }

      updatedTasks = data.tasks.map((t) =>
        t.id === editingTask.id ? { ...t, ...form, notificationId } : t,
      );
    } else {
      let notificationId: string | null = null;
      if (form.deadline) {
        notificationId = await scheduleTaskReminder(form.title, form.deadline);
      }

      const newTask: Task = {
        id: Date.now().toString(),
        title: form.title,
        description: form.description,
        priority: form.priority,
        category: form.category,
        deadline: form.deadline,
        completed: false,
        createdAt: new Date().toISOString(),
        notificationId,
      };
      updatedTasks = [...data.tasks, newTask];
    }

    const updated = { ...data, tasks: updatedTasks };
    setData(updated);
    await saveData(updated);
    setModalVisible(false);
    setEditingTask(null);
  }

  async function handleDeleteTask(id: string) {
    const task = data.tasks.find((t) => t.id === id);
    if (task) await cancelTaskReminder(task.notificationId);

    const updated = { ...data, tasks: data.tasks.filter((t) => t.id !== id) };
    setData(updated);
    await saveData(updated);
  }

  // ── Completing a task: points + streak + congrats ──────────
  async function handleCompleteTask(id: string) {
    const task = data.tasks.find((t) => t.id === id);
    if (!task || task.completed) return;

    await cancelTaskReminder(task.notificationId);

    const now = new Date();
    let pointsEarned = 10; // default if no deadline was set

    if (task.deadline) {
      const deadline = new Date(task.deadline);
      const diffMs = deadline.getTime() - now.getTime();

      if (diffMs > 15 * 60 * 1000) {
        pointsEarned = 15; // completed well before deadline
      } else if (diffMs >= 0) {
        pointsEarned = 10; // completed right on time
      } else {
        pointsEarned = 5; // completed late
      }
    }

    // Streak logic — counts consecutive days with at least 1 completion
    const today = now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = data.streak;
    if (data.lastCompletedDate !== today) {
      newStreak =
        data.lastCompletedDate === yesterday.toDateString()
          ? data.streak + 1
          : 1;
    }

    const updatedTasks = data.tasks.map((t) =>
      t.id === id
        ? { ...t, completed: true, completedAt: now.toISOString() }
        : t,
    );

    const updated: AppData = {
      ...data,
      tasks: updatedTasks,
      points: data.points + pointsEarned,
      streak: newStreak,
      lastCompletedDate: today,
    };

    setData(updated);
    await saveData(updated);
    setCongrats({ title: task.title, points: pointsEarned });
  }

  function handleCongratsOk() {
    setCongrats(null);
    openAddTask();
  }

  // ── Derived data ─────────────────────────────────────────
  const filteredTasks = data.tasks.filter((t) => {
    if (filter === "Active") return !t.completed;
    if (filter === "Done") return t.completed;
    return true;
  });

  const completedCount = data.tasks.filter((t) => t.completed).length;

  // ── Render ────────────────────────────────────────────────
  if (screen === "loading") {
    return <LoadingScreen onDone={handleLoadingDone} />;
  }

  if (screen === "name") {
    return <NameEntryScreen onSave={handleSaveName} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{data.userName} 👋</Text>
        </View>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>⭐</Text>
          <Text style={styles.statValue}>{data.points}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statValue}>{data.streak}d</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statIcon}>✅</Text>
          <Text style={styles.statValue}>{completedCount}</Text>
          <Text style={styles.statLabel}>Done</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {(["All", "Active", "Done"] as Filter[]).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterPill, filter === f && styles.filterPillActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f && styles.filterTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task list */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
            onEdit={openEditTask}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyText}>
              {filter === "Done"
                ? "No completed tasks yet"
                : "No tasks yet — add one!"}
            </Text>
          </View>
        }
      />

      {/* Add task button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton} onPress={openAddTask}>
          <Text style={styles.addButtonText}>+ Add New Task</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <AddTaskModal
        visible={modalVisible}
        editingTask={editingTask}
        onSave={handleSaveTask}
        onCancel={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
      />

      <CongratsModal
        visible={!!congrats}
        taskTitle={congrats?.title ?? ""}
        pointsEarned={congrats?.points ?? 0}
        onOk={handleCongratsOk}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  greeting: {
    color: Colors.textFaint,
    fontSize: 13,
  },
  userName: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: "700",
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  statIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  statValue: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  statLabel: {
    color: Colors.textFaint,
    fontSize: 11,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 10,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surfaceLight,
  },
  filterPillActive: {
    backgroundColor: Colors.text,
  },
  filterText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  filterTextActive: {
    color: Colors.background,
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 10,
    flexGrow: 1,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
  },
  emptyEmoji: {
    fontSize: 36,
    marginBottom: 10,
  },
  emptyText: {
    color: Colors.textFaint,
    fontSize: 14,
  },
  footer: {
    padding: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  addButton: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addButtonText: {
    color: Colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
});
