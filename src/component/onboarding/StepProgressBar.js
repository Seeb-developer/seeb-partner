import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StepProgressBar = ({ steps, currentStep }) => {
  return (
    <View style={styles.wrapper}>
      {steps.map((label, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        return (
          <View key={index} style={styles.stepContainer}>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {label}
            </Text>
            <View style={styles.dotWrapper}>
              <View
                style={[
                  styles.dot,
                  isCompleted && styles.completedDot,
                  isActive && styles.activeDot,
                ]}
              />
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  (isCompleted || isActive) && styles.progressActive,
                ]}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1c1333',
    padding: 10,
    borderRadius: 12,
    margin: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    // marginHorizontal: 20,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  activeLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dotWrapper: {
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#888',
  },
  completedDot: {
    backgroundColor: '#4CAF50',
  },
  activeDot: {
    backgroundColor: '#00ff00',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#ccc',
    borderRadius: 3,
    width: '90%',
  },
  progressFill: {
    height: 6,
    width: '100%',
    borderRadius: 3,
    backgroundColor: '#ccc',
  },
  progressActive: {
    backgroundColor: '#4CAF50',
  },
});

export default StepProgressBar;
