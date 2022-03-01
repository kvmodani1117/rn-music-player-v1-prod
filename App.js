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

  const context = useContext(AudioContext);
  useEffect(async() => {
    audioConfig();
   
    // Showing Controls on notification Bar, from music present in AsyncStorage, as soon as App launches.
    // let previousAudio = JSON.parse(await AsyncStorage.getItem('previousAudio'));
    // console.log("asynstorage->previousAudio.audio : ", (previousAudio).audio.filename);
    // MusicControl.setNowPlaying({
    //   title: previousAudio.audio.filename,
    //   duration: previousAudio.audio.duration, // (Seconds)
    //   description: 'You have a great music taste!',
    //   color: 0xff00001,
    //   // color: 0xffffff, // Android Only - Notification Color
    //   colorized: true, // Android 8+ Only - Notification Color extracted from the artwork. Set to false to use the color property instead
    //   });
    // MusicControl.enableControl('play', true)
    // MusicControl.enableControl('pause', true)
    // MusicControl.enableControl('stop', false)
    // MusicControl.enableControl('nextTrack', true)
    // MusicControl.enableControl('previousTrack', false)
    // MusicControl.enableControl('closeNotification', true, { when: 'paused' })
    
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

