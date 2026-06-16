import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CATEGORY_COLORS, Colors, PRIORITY_COLORS } from '../constants/colors';
import { Task } from '../utils/types';

interface Props {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function formatDeadline(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TaskCard({ task, onComplete, onDelete, onEdit }: Props) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (task.completed || !task.deadline) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [task.completed, task.deadline]);

  const deadlineMs = task.deadline ? new Date(task.deadline).getTime() : null;
  const remaining = deadlineMs ? deadlineMs - now : null;
  const isOverdue = remaining !== null && remaining <= 0 && !task.completed;

  const total = deadlineMs ? deadlineMs - new Date(task.createdAt).getTime() : 1;
  const progress =
    deadlineMs && remaining !== null
      ? Math.max(0, Math.min(1, (total - remaining) / total))
      : 0;

  const priorityColor = PRIORITY_COLORS[task.priority] ?? PRIORITY_COLORS.Medium;
  const categoryColor = CATEGORY_COLORS[task.category] ?? Colors.accent;

  return (
    <View
      style={[
        styles.card,
        task.completed && styles.cardCompleted,
        isOverdue && styles.cardOverdue,
      ]}
    >
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.checkbox,
            task.completed && styles.checkboxDone,
          ]}
          onPress={() => !task.completed && onComplete(task.id)}
        >
          {task.completed && <Text style={styles.checkMark}>✓</Text>}
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.title, task.completed && styles.titleDone]}
              numberOfLines={1}
            >
              {task.title}
            </Text>
            <View style={[styles.badge, { borderColor: priorityColor }]}>
              <Text style={[styles.badgeText, { color: priorityColor }]}>
                {task.priority}
              </Text>
            </View>
          </View>

          {task.description ? (
            <Text style={styles.description} numberOfLines={2}>
              {task.description}
            </Text>
          ) : null}

          <View style={styles.metaRow}>
            <View style={[styles.categoryPill, { backgroundColor: categoryColor + '33' }]}>
              <Text style={[styles.categoryText, { color: categoryColor }]}>
                {task.category}
              </Text>
            </View>
            {task.deadline && (
              <Text style={[styles.deadlineText, isOverdue && styles.overdueText]}>
                {isOverdue ? '⚠ Overdue' : `📅 ${formatDeadline(task.deadline)}`}
              </Text>
            )}
          </View>

          {task.deadline && !task.completed && (
            <View style={styles.timerWrap}>
              <View style={styles.timerLabelRow}>
                <Text style={styles.timerLabel}>Time remaining</Text>
                <Text style={[styles.timerValue, isOverdue && styles.overdueText]}>
                  {isOverdue ? 'EXPIRED' : formatCountdown(remaining ?? 0)}
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${progress * 100}%`,
                      backgroundColor: isOverdue ? Colors.danger : Colors.accent,
                    },
                  ]}
                />
              </View>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          {!task.completed && (
            <TouchableOpacity onPress={() => onEdit(task)} style={styles.actionBtn}>
              <Text style={styles.actionIcon}>✎</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => onDelete(task.id)} style={styles.actionBtn}>
            <Text style={[styles.actionIcon, { color: Colors.danger }]}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardCompleted: {
    opacity: 0.6,
  },
  cardOverdue: {
    borderColor: Colors.danger,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.textFaint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  checkboxDone: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  checkMark: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    flex: 1,
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
    marginRight: 6,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: Colors.textFaint,
  },
  badge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  description: {
    color: Colors.textMuted,
    fontSize: 12,
    marginBottom: 6,
    lineHeight: 17,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPill: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deadlineText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  overdueText: {
    color: Colors.danger,
  },
  timerWrap: {
    marginTop: 8,
  },
  timerLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  timerLabel: {
    fontSize: 11,
    color: Colors.textFaint,
  },
  timerValue: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text,
    fontVariant: ['tabular-nums'],
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.surfaceLight,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  actions: {
    marginLeft: 6,
    alignItems: 'center',
  },
  actionBtn: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  actionIcon: {
    fontSize: 16,
    color: Colors.textFaint,
  },
});
