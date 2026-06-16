import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CATEGORY_COLORS, Colors, PRIORITY_COLORS } from '../constants/colors';
import { Category, Priority, Task } from '../utils/types';

const PRIORITIES: Priority[] = ['High', 'Medium', 'Low'];
const CATEGORIES: Category[] = ['Study', 'Personal', 'University', 'Work', 'Health'];

export interface TaskFormResult {
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  deadline: string | null;
}

interface Props {
  visible: boolean;
  editingTask: Task | null;
  onSave: (form: TaskFormResult) => void;
  onCancel: () => void;
}

export default function AddTaskModal({ visible, editingTask, onSave, onCancel }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [category, setCategory] = useState<Category>('Study');
  const [deadline, setDeadline] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Sync form fields whenever the modal opens (new task or edit task)
  function resetForm(task: Task | null) {
    setTitle(task?.title ?? '');
    setDescription(task?.description ?? '');
    setPriority(task?.priority ?? 'Medium');
    setCategory(task?.category ?? 'Study');
    setDeadline(task?.deadline ? new Date(task.deadline) : null);
    setShowDatePicker(false);
    setShowTimePicker(false);
  }

  function handleShow() {
    resetForm(editingTask);
  }

  function handleSave() {
    const trimmed = title.trim();
    if (!trimmed) return;
    onSave({
      title: trimmed,
      description: description.trim(),
      priority,
      category,
      deadline: deadline ? deadline.toISOString() : null,
    });
  }

  function onChangeDate(event: any, selected?: Date) {
    setShowDatePicker(Platform.OS === 'ios');
    if (event.type === 'dismissed' || !selected) {
      setShowDatePicker(false);
      return;
    }
    const base = deadline ?? new Date();
    const updated = new Date(selected);
    updated.setHours(base.getHours(), base.getMinutes(), 0, 0);
    setDeadline(updated);
    if (Platform.OS === 'android') setShowDatePicker(false);
  }

  function onChangeTime(event: any, selected?: Date) {
    setShowTimePicker(Platform.OS === 'ios');
    if (event.type === 'dismissed' || !selected) {
      setShowTimePicker(false);
      return;
    }
    const base = deadline ?? new Date();
    const updated = new Date(base);
    updated.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
    setDeadline(updated);
    if (Platform.OS === 'android') setShowTimePicker(false);
  }

  function formatDate(d: Date) {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function formatTime(d: Date) {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onShow={handleShow}
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.headerCancel}>← Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{editingTask ? 'Edit Task' : 'New Task'}</Text>
        </View>

        <ScrollView style={styles.body} contentContainerStyle={{ paddingBottom: 30 }}>
          <Text style={styles.label}>TASK TITLE *</Text>
          <TextInput
            style={styles.input}
            placeholder="What do you need to do?"
            placeholderTextColor={Colors.textFaint}
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>DESCRIPTION</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add details (optional)..."
            placeholderTextColor={Colors.textFaint}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>PRIORITY</Text>
          <View style={styles.optionsRow}>
            {PRIORITIES.map((p) => {
              const selected = priority === p;
              const color = PRIORITY_COLORS[p];
              return (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.optionPill,
                    { borderColor: selected ? color : Colors.border },
                    selected && { backgroundColor: color + '22' },
                  ]}
                  onPress={() => setPriority(p)}
                >
                  <Text style={[styles.optionText, selected && { color }]}>{p}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>CATEGORY</Text>
          <View style={[styles.optionsRow, { flexWrap: 'wrap' }]}>
            {CATEGORIES.map((c) => {
              const selected = category === c;
              const color = CATEGORY_COLORS[c];
              return (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.optionPill,
                    { borderColor: selected ? color : Colors.border },
                    selected && { backgroundColor: color + '22' },
                  ]}
                  onPress={() => setCategory(c)}
                >
                  <Text style={[styles.optionText, selected && { color }]}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>DEADLINE</Text>
          <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowDatePicker(true)}>
            <Text style={deadline ? styles.pickerValue : styles.pickerPlaceholder}>
              📅 {deadline ? formatDate(deadline) : 'Pick a date...'}
            </Text>
          </TouchableOpacity>

          {deadline && (
            <TouchableOpacity style={styles.pickerBtn} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.pickerValue}>🕐 {formatTime(deadline)}</Text>
            </TouchableOpacity>
          )}

          {deadline && (
            <TouchableOpacity onPress={() => setDeadline(null)} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Remove deadline</Text>
            </TouchableOpacity>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={deadline ?? new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              onChange={onChangeDate}
              minimumDate={new Date()}
            />
          )}

          {showTimePicker && (
            <DateTimePicker
              value={deadline ?? new Date()}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onChangeTime}
            />
          )}

          {deadline && (
            <View style={styles.hintBox}>
              <Text style={styles.hintText}>
                ⏰ You'll get a notification 15 minutes before this deadline —
                even in silent or airplane mode!
              </Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveBtn, !title.trim() && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={!title.trim()}
          >
            <Text style={styles.saveBtnText}>
              {editingTask ? 'Save Changes' : 'Add Task ✓'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerCancel: {
    color: Colors.textMuted,
    fontSize: 14,
    marginBottom: 8,
  },
  headerTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  label: {
    color: Colors.textFaint,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 14,
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    fontSize: 15,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionPill: {
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  optionText: {
    color: Colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  pickerBtn: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
  },
  pickerValue: {
    color: Colors.text,
    fontSize: 14,
  },
  pickerPlaceholder: {
    color: Colors.textFaint,
    fontSize: 14,
  },
  clearBtn: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  clearBtnText: {
    color: Colors.danger,
    fontSize: 12,
  },
  hintBox: {
    backgroundColor: '#EF9F2722',
    borderColor: '#EF9F27',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  hintText: {
    color: '#EF9F27',
    fontSize: 12,
    lineHeight: 18,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  saveBtn: {
    backgroundColor: Colors.text,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: Colors.surfaceLight,
  },
  saveBtnText: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
});
