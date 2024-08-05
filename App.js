import { StatusBar } from 'expo-status-bar';
import React, {useRef, useState, useEffect, useContext} from 'react';
import { AppState } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';
import AudioProvider from './app/context/AudioProvider';
import Colors from './app/misc/Colors';
import {Audio} from 'expo-av';
import { AudioContext } from './app/context/AudioProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MusicControl from 'react-native-music-control';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.APP_BG
  }
}

export default function App() {

  const context = useContext(AudioContext);
  useEffect(async() => {
    audioConfig();
  });
  const audioConfig = () => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      playThroughEarpieceAndroid: false
    });
    // console.log("context---->: ",context);
  }

  return (
    <AudioProvider>
      <NavigationContainer theme={MyTheme}>
        <AppNavigator />
      </NavigationContainer>
    </AudioProvider>
  );
}

