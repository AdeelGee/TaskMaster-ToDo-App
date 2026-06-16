import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  visible: boolean;
  taskTitle: string;
  pointsEarned: number;
  onOk: () => void;
}

/**
 * Shown immediately after the user ticks a task as complete.
 * Pressing "OK" closes this AND opens the Add Task modal so the
 * user can immediately add their next task.
 */
export default function CongratsModal({ visible, taskTitle, pointsEarned, onOk }: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.emoji}>🏆</Text>
          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.message}>
            You successfully complete your task!
          </Text>
          <Text style={styles.taskName}>"{taskTitle}"</Text>

          <View style={styles.pointsBox}>
            <Text style={styles.pointsValue}>+{pointsEarned} pts</Text>
            <Text style={styles.pointsLabel}>added to your score</Text>
          </View>

          <TouchableOpacity style={styles.okBtn} onPress={onOk}>
            <Text style={styles.okBtnText}>OK — Add Next Task</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
  },
  emoji: {
    fontSize: 52,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  taskName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  pointsBox: {
    backgroundColor: '#4CAF5022',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  pointsValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.success,
  },
  pointsLabel: {
    fontSize: 12,
    color: Colors.success,
  },
  okBtn: {
    width: '100%',
    backgroundColor: Colors.text,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  okBtnText: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
});
