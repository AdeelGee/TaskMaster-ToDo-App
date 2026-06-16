import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  onSave: (name: string) => void;
}

/**
 * This screen is shown ONLY ONE TIME — the very first time the
 * app is opened. After the name is saved to AsyncStorage,
 * this screen never appears again.
 */
export default function NameEntryScreen({ onSave }: Props) {
  const [name, setName] = useState('');

  function handleSave() {
    const trimmed = name.trim();
    if (trimmed.length === 0) return;
    onSave(trimmed);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.emoji}>👋</Text>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.subtitle}>
        Let's get started.{'\n'}What should we call you?
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor={Colors.textFaint}
        value={name}
        onChangeText={setName}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={handleSave}
      />

      <TouchableOpacity
        style={[styles.button, !name.trim() && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={!name.trim()}
      >
        <Text style={styles.buttonText}>Get Started →</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  input: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: Colors.text,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: Colors.surfaceLight,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 15,
    fontWeight: '700',
  },
});
