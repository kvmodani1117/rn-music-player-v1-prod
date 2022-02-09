import React, { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { Dimensions, StyleSheet, Text, View, Animated, Image, FlatList } from 'react-native';
import Screen from '../components/Screen';
import Colors from '../misc/Colors';
import { MaterialCommunityIcons, Ionicons, Fontisto } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import PlayerButton from '../components/PlayerButton';
import { AudioContext } from '../context/AudioProvider';
import { changeAudio, moveAudio, pause, play, playNext, resume, selectAudio } from '../misc/AudioController';
import { convertTime, storeAudioForNextOpening } from '../misc/Helper';
import TabBarAnimation from '../components/TabBarAnimation';
import * as Animatable from 'react-native-animatable';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import BannerImage from '../misc/BannerImage';
import AudioList from '../screens/AudioList';
import AudioListItem from '../components/AudioListItem';
import OptionModal from '../components/OptionModal';

const WIDTH = Dimensions.get('window').width;

const Player = (props) => {
    const context = useContext(AudioContext);
    console.log("context=========>",context.audioFiles.slice(0,3));
    const { playbackPosition, playbackDuration, currentAudio } = context;

    const [currentPosition, setCurrentPosition] = useState(0);
    const sampleAudio = [
        {key: "audio1", audio: "audio1"},
        {key: "audio2", audio: "audio2"},
        {key: "audio3", audio: "audio3"},
        {key: "audio4", audio: "audio4"},
    ];

    const [randomInt, setRandomInt] = useState(1);
    let actualImgPath = `../../assets/img3.png`;
    useEffect(() => {
        context.loadPreviousAudio();
        console.log(context.currentAudio);
        // console.log("1");
        setRandomInt(Math.floor(Math.random() * 20) + 1);
        // console.log("BannerImage[1]---> ", BannerImage[randomInt].imgPath);

        return () => {
            context.loadPreviousAudio();
        }
    }, [context.loadPreviousAudio]);

    // const viewElement = useRef(null);
    // useEffect(() => {
    //     viewElement.current.animate("bounceInRight", 2000);
    // }, []);

    // const viewElement = useRef(null);
    // useFocusEffect(useCallback( () => {
    //     // if (props.navigation.isFocused()) {
    //     //     viewElement.current.animate("bounceInRight", 2000);
    //     //     console.log("props.isFocused : ", props.navigation.isFocused());
    //     // }
    //     // if ( prevFocusResult !== props.navigation.isFocused()) {
    //         viewElement.current.animate("bounceInRight", 2000);
    //         console.log("props.isFocused : ", props.navigation.isFocused());
    //     // }

    // },[props.navigation.isFocused]));





    //1. GADBAD
    // const isFocused = useIsFocused();
    // const viewElement = useRef(null);
    // useEffect( useCallback(() => {   
    //     if (isFocused) {
    //         console.log("2");
    //         viewElement.current.animate("bounceInRight", 2000);
    //         console.log("props.isFocused : ", props.navigation.isFocused());
    //     }
    //     else{
    //         viewElement.current.animate("bounceOut", 0);
    //     }
    // },  [isFocused]) );



    // 2. Animation only works when audio is still playing....
    //but problem while playing music from playlist..Maybe..(happened once..may be due to metro bundler glitch)
    //worked properly later...
    const prevFocusRef = useRef();
    useEffect(() => {
        prevFocusRef.current = props.navigation.isFocused();
        return () => {

        }
    }, []);
    const prevFocusResult = prevFocusRef.current;

    const viewElement = useRef(null);
    useEffect(() => {
        if (prevFocusResult && prevFocusResult !== props.navigation.isFocused()) {

            // console.log("2");
            viewElement.current.animate("bounceInRight", 2000);
            // console.log("props.isFocused : ", props.navigation.isFocused());
        }
        return () => {

        }
    });



    // 3. This works well... but fluctuates at the start for approx 1 sec...
    // const viewElement = useRef(null);
    // useFocusEffect(useCallback( () => {

    //         console.log("2");
    //         viewElement.current.animate("bounceInRight", 2000);
    //         console.log("props.isFocused : ", props.navigation.isFocused());

    // },[props.navigation.isFocused()]));



    const calculateSeekBar = () => {
        // console.log("inside calculateSeekBar()");
        if (playbackPosition !== null && playbackDuration !== null) {
            return playbackPosition / playbackDuration;
        }
        if (currentAudio.lastPosition) {
            return currentAudio.lastPosition / (currentAudio.duration * 1000)
        }

        return 0;
    }



    const handlePlayPause = async () => {
        await selectAudio(context.currentAudio, context);
    };

    const handleNext = async () => {
        setRandomInt(Math.floor(Math.random() * 20) + 1);
        // console.log("randomInt-->",randomInt);
        await changeAudio(context, 'next');

    }

    const handlePrevious = async () => {
        setRandomInt(Math.floor(Math.random() * 20) + 1);
        // console.log("randomInt-->",randomInt);
        await changeAudio(context, 'previous');

    }


    const renderCurrentTime = () => {
        if (!context.soundObj && currentAudio.lastPosition) {
            return convertTime(currentAudio.lastPosition / 1000);
        }
        return convertTime(context.playbackPosition / 1000);
    }


    if (!context.currentAudio) {
        return null;
    }

    const handleAudioPress = async (audio) => {
        // console.log("audio############:",audio);
        await selectAudio(audio, context);

    }

    const rowRenderer = (item, index) => {

        return (
            <Animatable.View
                animation='fadeInUp'
                duration={1000}
                delay={index * 100}
                // ref={this.viewElement}
                useNativeDriver={true}
            >
                {/* <Text style={{backgroundColor: 'red'}}>{context.audioFiles[0].filename}</Text> */}
                {/* <Text style={{backgroundColor: 'red'}}>{item.filename}</Text> */}
                <AudioListItem
                    title={item.filename}
                    // isPlaying={extendedState.isPlaying}  //context is like a state itself!
                    // activeListItem={context.currentAudioIndex === index}
                    duration={item.duration}
                    onAudioPress={() => handleAudioPress(item)}
                    // onOptionPress={() => {
                    //     this.currentItem = item;
                    //     this.setState({ ...this.state, optionModalVisible: true });
                    // }}
                />
            </Animatable.View>
        )
    }


    return (
        <Screen>
            {/* <Animatable.View
                animation='bounceIn'
                delay={400 * 2 + 100}

            > */}

            <Animatable.View
                // animation='bounceInRight'
                // duration={3000}
                // delay={100}
                ref={viewElement}
                useNativeDriver={true}
                style={styles.container}
            >

                <View style={styles.audioCountContainer}>
                    <View style={{ flexDirection: 'row' }} >
                        {context.isPlayListRunning && (
                            <>
                                <Text style={{ fontWeight: 'bold', color: Colors.FONT_LIGHT }}>From Playlist :  </Text>
                                <Text style={{ color: Colors.FONT_LIGHT }}>{context.activePlayList.title}</Text>
                            </>
                        )}
                    </View>
                    <Text style={styles.audioCount}>
                        {`${context.currentAudioIndex + 1} / ${context.totalAudioCount}`}
                    </Text>
                </View>
                <Animatable.View
                    animation='bounceInRight'
                    duration={2000}
                    delay={100}
                    useNativeDriver={true}
                    style={styles.midBannerContainer}>
                    {/* <MaterialCommunityIcons
                        name="music-circle"
                        size={300}
                        color={context.isPlaying ? Colors.ACTIVE_BG : Colors.FONT_MEDIUM}
                    /> */}
                    {/* <Ionicons 
                        name="musical-notes" 
                        size={220} 
                        color={context.isPlaying ? Colors.ACTIVE_BG : Colors.FONT_MEDIUM}
                    />  */}
                    {/* <Fontisto 
                        name="applemusic" 
                        size={250} 
                        color={context.isPlaying ? Colors.ACTIVE_BG : Colors.FONT_MEDIUM}
                    />  */}
                    <Image
                        style={{ width: 240, height: 240, borderRadius: 30, margin: 20 }}
                        // style={{ width: 260, height: 260, borderRadius: 30, margin: 20 }}
                        // source={require("../../assets/img3.png")}
                        source={BannerImage[randomInt].imgPath}
                    // source={require(imgPath)}
                    />
                </Animatable.View>
                <Animatable.View
                    animation='bounceInRight'
                    duration={3000}
                    delay={200}
                    useNativeDriver={true}
                    style={styles.audioPlayerContainer}>
                    <Text numberOfLines={1} style={styles.audioTitle}>
                        {context.currentAudio.filename}
                    </Text>
                    <View style={{ alignSelf: 'center', width: '100%'}}>
                        <Slider
                            style={{ 
                                // width: WIDTH, 
                                height: 20
                            }}
                            minimumValue={0}
                            maximumValue={1}
                            value={calculateSeekBar()}
                            minimumTrackTintColor={Colors.ACTIVE_BG}
                            maximumTrackTintColor="purple"
                            thumbTintColor={Colors.FONT_LIGHT}
                            onValueChange={(value) => {
                                setCurrentPosition(convertTime(value * context.currentAudio.duration));
                            }}
                            onSlidingStart={async () => {
                                if (!context.isPlaying) { return };
                                try {
                                    await pause(context.playbackObj);
                                } catch (error) {
                                    console.log("error inside onSlidingStart callback : ", error);
                                }
                            }}
                            onSlidingComplete={async value => {
                                await moveAudio(context, value)
                                setCurrentPosition(0);
                            }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15 }}>
                        <Text style={{ color: Colors.FONT_MEDIUM }} >{currentPosition ? currentPosition : renderCurrentTime()}</Text>
                        <Text style={{ color: Colors.FONT_MEDIUM }} >{convertTime(context.currentAudio.duration)}</Text>
                    </View>
                    <View style={styles.audioContollers}>
                        <PlayerButton iconType='PREV' onPress={handlePrevious} iconColor={Colors.ACTIVE_FONT} />
                        <PlayerButton
                            onPress={handlePlayPause}
                            style={{ marginHorizontal: 25 }}
                            iconType={context.isPlaying ? 'PLAY' : 'PAUSE'}
                            iconColor={context.isPlaying ? Colors.ACTIVE_BG : Colors.ACTIVE_BG}
                            size={70}
                        />
                        <PlayerButton iconType='NEXT' onPress={handleNext} iconColor={Colors.ACTIVE_FONT} />
                    </View>
                    {/* <View style={{height: 240}}>
                        <FlatList
                            data={context.audioFiles.slice(context.currentAudioIndex + 1, context.currentAudioIndex + 1+3)}
                            renderItem={(data) => rowRenderer(data.item, 1)}
                            contentContainerStyle={{ paddingBottom: 90 }}
                        />
                    </View> */}
                </Animatable.View>
                <View style={{height: 240}}>
                        <FlatList
                            data={context.audioFiles.slice(context.currentAudioIndex + 1, context.currentAudioIndex + 1+3)}
                            renderItem={(data) => rowRenderer(data.item, 1)}
                            contentContainerStyle={{ paddingBottom: 90 }}
                        />
                    </View>
            </Animatable.View>

            {/* <TabBarAnimation runOnPressAnimation={runOnPressAnimation} /> */}
            {/* </Animatable.View> */}
        </Screen>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    audioCount: {
        textAlign: 'right',
        color: Colors.FONT_LIGHT,
        fontSize: 14
    },
    audioCountContainer: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        justifyContent: 'space-between',
    },
    midBannerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    audioTitle: {
        fontSize: 22,   //commented now... initially fontSize: 25
        fontWeight: 'bold',
        color: Colors.FONT_LIGHT,
        padding: 10,  //commented now... initially padding: 15
        alignSelf: 'center',
    },
    audioContollers: {
        width: WIDTH,
        flexDirection: 'row',
        justifyContent: 'center',
        paddingBottom: 20,
        alignItems: 'center',
        alignSelf: 'center',
        elevation: 20
        // marginBottom: 90,
    },
    audioPlayerContainer: {
        backgroundColor: '#ffffff',
        width: WIDTH - 40,
        alignSelf: 'center',
        borderRadius: 30,
        elevation: 10,
        marginBottom: 10
    },
})

export default Player;
