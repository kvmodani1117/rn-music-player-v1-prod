import React, { Component, createContext, createRef } from 'react';
import { Text, View, Alert, AppState } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { DataProvider } from 'recyclerlistview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { storeAudioForNextOpening } from '../misc/Helper';
import { playNext } from '../misc/AudioController';

export const AudioContext = createContext();

export class AudioProvider extends Component {

    constructor(props) {
        super(props);
        this.state = {
            audioFiles: [],
            playList: [],
            addToPlayList: null,
            permissionError: false,
            dataProvider: new DataProvider((row1, row2) => row1 !== row2),
            playbackObj: null,
            soundObj: null,
            currentAudio: {},
            isPlaying: false,
            isPlayListRunning: false,
            activePlayList: [],
            currentAudioIndex: null,
            playbackPosition: null,   //for seeker..
            playbackDuration: null,   //for seeker..
            // appStateVisible: AppState.currentState
        };
        this.totalAudioCount = 0;
        this.runOnPressAnimation = false;
        // this.appState = createRef(AppState.currentState);
    }


    permissionAlert = () => {
        Alert.alert(
            "Permission required",
            "This app needs to read audio files!",
            [
                {
                    text: 'I am ready',
                    onPress: () => this.getPermission()
                },
                {
                    text: 'cancel',
                    onPress: () => this.permissionAlert()
                }
            ]
        );
    }



    getAudioFiles = async () => {
        const { dataProvider, audioFiles } = this.state;
        let media = await MediaLibrary.getAssetsAsync({  //media.assets = [{},{},{}] => array of objects of songs
            mediaType: 'audio'
        });
        media = await MediaLibrary.getAssetsAsync({
            mediaType: 'audio',
            first: media.totalCount,
        });
        // console.log("audiosssss:",media.assets[0].uri);
        this.totalAudioCount = media.totalCount;
        // console.log("media.assets.length : ", media.assets.length);
        this.setState({
            ...this.state,
            dataProvider: dataProvider.cloneWithRows([...audioFiles, ...media.assets]),
            audioFiles: [...audioFiles, ...media.assets]
        });

    }



    loadPreviousAudio = async () => {
        //Need to load audio from AsyncStorage
        let previousAudio = await AsyncStorage.getItem('previousAudio');
        let currentAudio;
        let currentAudioIndex;

        if (previousAudio === null) {
            currentAudio = this.state.audioFiles[0];
            currentAudioIndex = 0;
        }
        else {
            previousAudio = JSON.parse(previousAudio);
            currentAudio = previousAudio.audio;
            currentAudioIndex = previousAudio.index;
        }

        this.setState({ ...this.state, currentAudio, currentAudioIndex });

    }



    getPermission = async () => {
        const permission = await MediaLibrary.getPermissionsAsync();
        if (permission.granted) {
            //we need to get all the audio files
            this.getAudioFiles();
        }
        if (!permission.canAskAgain && !permission.granted) {
            //we need to display an error to the user 
            this.setState({ ...this.state, permissionError: true });
        }
        if (!permission.granted && permission.canAskAgain) {
            //ask for permission again..
            const { status, canAskAgain } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'denied' && canAskAgain) {
                //we are going to display an alert that user must allow this permission to work this app
                this.permissionAlert();
            }
            if (status === 'granted') {
                //we need to get all the audio files 
                this.getAudioFiles();
            }
            if (status === 'denied' && !canAskAgain) {
                //we need to display an error to the user 
                this.setState({ ...this.state, permissionError: true });
            }

        }
    }



    //For SeekBar....
    onPlaybackStatusUpdate = async playbackStatus => {
        // const { playbackObj } = this.context;
        // console.log("playbackStatus ---> ", playbackStatus);
        // let progressUpdateIntervalMillis = playbackStatus.progressUpdateIntervalMillis;
        if (playbackStatus.isLoaded && playbackStatus.isPlaying) {
            // playbackObj.setStatusAsync({ progressUpdateIntervalMillis: 200 });
            this.updateState(this, {
                playbackPosition: playbackStatus.positionMillis,
                playbackDuration: playbackStatus.durationMillis,
            });
        }

        if (playbackStatus.isLoaded && !playbackStatus.isPlaying) {
            storeAudioForNextOpening(
                this.state.currentAudio,
                this.state.currentAudioIndex,
                playbackStatus.positionMillis
            );
        }

        if (playbackStatus.didJustFinish) {

            if (this.state.isPlayListRunning) {
                let audio;
                const indexOnPlayList = this.state.activePlayList.audios.findIndex(({ id }) => id === this.state.currentAudio.id);
                const nextIndex = indexOnPlayList + 1;
                audio = this.state.activePlayList.audios[nextIndex];

                if (!audio) {
                    audio = this.state.activePlayList.audios[0];
                }

                const indexOnAllList = this.state.audioFiles.findIndex(({ id }) => id === audio.id);

                const status = await playNext(this.state.playbackObj, audio.uri);
                return this.updateState(this, {
                    soundObj: status,
                    isPlaying: true,
                    currentAudio: audio,
                    currentAudioIndex: indexOnAllList
                });

            }

            const nextAudioIndex = this.state.currentAudioIndex + 1;

            if (nextAudioIndex >= this.totalAudioCount) {   //means there's no next audio to play...
                this.state.playbackObj.unloadAsync();
                this.updateState(this, {
                    soundObj: null,
                    currentAudio: this.state.audioFiles[0],
                    isPlaying: false,
                    currentAudioIndex: 0,
                    playbackPosition: null,
                    playbackDuration: null,
                });
                return storeAudioForNextOpening(this.state.audioFiles[0], 0);
            }

            //otherwise we want to select the next audio
            const audio = this.state.audioFiles[nextAudioIndex];
            const status = await playNext(this.state.playbackObj, audio.uri);
            this.updateState(this, {
                soundObj: status,
                currentAudio: audio,
                isPlaying: true,
                currentAudioIndex: nextAudioIndex,
            });
            return storeAudioForNextOpening(audio, nextAudioIndex);
        }
    };





    componentDidMount() {
        this.getPermission();
        if (this.state.playbackObj === null) {
            this.setState({ ...this.state, playbackObj: new Audio.Sound() });
        }
    };


    updateState = (prevState, newState = {}) => {
        this.setState({ ...prevState, ...newState });
    };




    render() {
        const {
            audioFiles,
            playList,
            addToPlayList,
            dataProvider,
            permissionError,
            playbackObj,
            soundObj,
            currentAudio,
            isPlaying,
            currentAudioIndex,
            playbackPosition,
            playbackDuration,
            isPlayListRunning,
            activePlayList,
            runOnPressAnimation,
        } = this.state;

        if (permissionError) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, textAlign: 'center', }}>
                        Looks like you haven't accepted the audio permission.
                    </Text>
                </View>
            );
        }
        return (
            <AudioContext.Provider
                value={{
                    audioFiles,
                    playList,
                    addToPlayList,
                    dataProvider,
                    playbackObj,
                    soundObj,
                    currentAudio,
                    isPlaying,
                    currentAudioIndex,
                    updateState: this.updateState,
                    totalAudioCount: this.totalAudioCount,
                    playbackPosition,
                    playbackDuration,
                    isPlayListRunning,
                    activePlayList,
                    loadPreviousAudio: this.loadPreviousAudio,
                    onPlaybackStatusUpdate: this.onPlaybackStatusUpdate,
                    runOnPressAnimation
                }}
            >
                {this.props.children}
            </AudioContext.Provider>
        )
    }
}

export default AudioProvider;
