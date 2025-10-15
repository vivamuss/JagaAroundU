import React, { useRef, useEffect } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

export const AnimatedMapMarker = ({ color = "#6C63FF", size = 40, delay = 0 }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Scale in animation
    Animated.sequence([
      Animated.delay(delay),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 40 40">
        <G>
          {/* Pulsing circle */}
          <Animated.View
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: color,
              opacity: 0.3,
              transform: [{ scale: pulseAnim }],
            }}
          />
          {/* Main marker */}
          <Circle cx="20" cy="20" r="12" fill={color} />
          <Ionicons 
            name="location" 
            size={16} 
            color="white" 
            style={{ position: 'absolute', left: 12, top: 12 }}
          />
        </G>
      </Svg>
    </Animated.View>
  );
};