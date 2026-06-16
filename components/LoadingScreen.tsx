import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  onDone: () => void;
}

export default function LoadingScreen({ onDone }: Props) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(onDone, 1800);
    return () => clearTimeout(timer);
  }, []);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logoEmoji}>✅</Text>
      </View>
      <Text style={styles.title}>TaskMaster</Text>
      <Text style={styles.subtitle}>Your offline task companion</Text>
      <Animated.View style={[styles.spinner, { transform: [{ rotate }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textFaint,
    marginTop: 6,
    marginBottom: 28,
  },
  spinner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: Colors.surfaceLight,
    borderTopColor: Colors.accent,
  },
});
