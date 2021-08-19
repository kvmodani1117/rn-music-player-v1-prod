import { StatusBar } from 'expo-status-bar';
import React, {useRef, useState, useEffect} from 'react';
import { AppState } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppNavigator from './app/navigation/AppNavigator';
import AudioProvider from './app/context/AudioProvider';
import Colors from './app/misc/Colors';
import {Audio} from 'expo-av';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.APP_BG
  }
}

export default function App() {

  // const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);

  // useEffect(() => {
  //   AppState.addEventListener("change", _handleAppStateChange);
  //   return () => {
  //     AppState.removeEventListener("change", _handleAppStateChange);
  //   }
  // }, []);

  // const _handleAppStateChange = (nextAppState) => {
  //   if(appState.current.match(/inactive|background/) && nextAppState === 'active'){
  //     console.log("App has come to the foreground!");
  //   }
  //   appState.current = nextAppState;
  //   setAppStateVisible(appState.current);

  //   console.log("AppState: ", appState.current);
  // }


  useEffect(() => {
    audioConfig()
  });
  const audioConfig = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DUCK_OTHERS,
      // interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      // interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false
    });
  }

  return (
    <AudioProvider>
      <NavigationContainer theme={MyTheme}>
        <AppNavigator />
      </NavigationContainer>
    </AudioProvider>
  );
}

