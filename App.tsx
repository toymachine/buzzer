/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useEffect } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Button,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Sound from 'react-native-sound';

const buzzer = new Sound('buzzer.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
      console.log('failed to load the sound', error);
      return;
  }
});


type RoundedButtonProps = {
  title: string;
  onPress: () => void;
};

function RoundedButton({title, onPress}: RoundedButtonProps): JSX.Element {
  return (
    <TouchableOpacity 
          style={styles.roundedButton} 
          onPress={onPress}
        >
          <Text>{title}</Text>
    </TouchableOpacity>
  )
}

function App(): JSX.Element {

  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const second = 1000; //ms

  useEffect(() => {
    let intervalId: number = 0;
    if (isRunning) {
      intervalId = setTimeout(() => {
        setTime((time) => time + 1);
      }, second);
    } else if (!isRunning) {
      clearTimeout(intervalId);
    }
    return () => clearTimeout(intervalId);
  }, [isRunning, time]);

  useEffect(() => {

    if(isRunning && (time % 90 == 0)) {
      buzzer.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
      });
    }

  }, [isRunning, time]);

  const handleStart = () => {
    setIsRunning(true);

  
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
  };

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const shiftTime = 90 - (time % 90);
  const shiftMinutes = Math.floor(shiftTime / 60);
  const shiftSeconds = shiftTime % 60;

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          
          <Text style={styles.shiftTimeDisplay}>
            {shiftMinutes}:{shiftSeconds < 10 ? `0${shiftSeconds}` : shiftSeconds} 
          </Text> 

          <Text style={styles.timeDisplay}>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </Text> 

        <RoundedButton
          title="Start"
          onPress={handleStart}/>

        <RoundedButton
          title="Stop"
          onPress={handleStop}/>

        <RoundedButton
          title="Reset"
          onPress={handleReset}/>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  timeDisplay: {
    fontSize: 24,
    fontWeight: '700',
    textAlign:'center',
    fontFamily: 'Courier'
  },
  shiftTimeDisplay: {
    fontSize: 150,
    fontWeight: '700',
    textAlign:'center',
    fontFamily: 'Courier'
  },
  roundedButton: {
    backgroundColor: '#1E90FF',
    borderRadius: 12, // this will make the button rounded
    alignItems: 'center',
    padding: 20,
    margin: 15,
  },
});

export default App;
