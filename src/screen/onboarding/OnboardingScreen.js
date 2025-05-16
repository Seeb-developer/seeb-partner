import React, { useRef } from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: 'one',
    title: 'Welcome to Seeb Partner',
    text: 'Join our trusted network of home service professionals.',
    image: require('../../assets/worker1.png'),
    step: 'Step 1 of 3',
  },
  {
    key: 'two',
    title: 'Verify Your Details',
    text: 'Mobile and email verification is the first step to get started.',
    image: require('../../assets/verify.png'),
    step: 'Step 2 of 3',
  },
  {
    key: 'three',
    title: 'Ready to Earn',
    text: 'Get jobs, track progress, and grow your business with Seeb.',
    image: require('../../assets/success.png'),
    step: 'Step 3 of 3',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const sliderRef = useRef(null);

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Text style={styles.step}>{item.step}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Image source={item.image} style={styles.image} resizeMode="contain" />
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  const renderNextButton = () => (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        if (sliderRef.current) {
          sliderRef.current.goToSlide(sliderRef.current.state.activeIndex + 1, true);
        }
      }}
    >
      <Text style={styles.buttonText}>Next</Text>
    </TouchableOpacity>
  );


  const renderDoneButton = () => (
    <TouchableOpacity style={styles.button} onPress={async () => {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      navigation.replace('Login');
    }}>
      <Text style={styles.buttonText}>Let’s Go</Text>
    </TouchableOpacity>
  );
  const renderSkipButton = () => (
    <TouchableOpacity style={styles.button} onPress={async () => {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      navigation.replace('Login');
    }}>
      <Text style={styles.buttonText}>Skip</Text>
    </TouchableOpacity>
  );

  return (
    <AppIntroSlider
      ref={sliderRef}
      renderItem={renderItem}
      data={slides}
      onDone={() => navigation.replace('Login')}
      showSkipButton
      renderSkipButton={renderSkipButton}
      renderNextButton={renderNextButton}
      renderDoneButton={renderDoneButton}
      activeDotStyle={{ backgroundColor: '#EFBF04' }}
      dotStyle={{ backgroundColor: '#ccc' }}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: '#FFFDF4',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 24,
  },
  step: {
    fontSize: 14,
    color: '#999',
    margin: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#222',
    textAlign: 'center',
    marginBottom: 40,
  },
  text: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  image: {
    width: '100%',
    height: '60%',
  },
  button: {
    backgroundColor: '#EFBF04',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default OnboardingScreen;
