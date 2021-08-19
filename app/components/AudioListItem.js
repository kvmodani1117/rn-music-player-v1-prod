import React from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import Colors from '../misc/Colors';
import { Ionicons } from '@expo/vector-icons';

const WIDTH = Dimensions.get('window').width;

getThumbnailText = (filename) => (filename[0]);

const convertTime = (minutes) => {
    if (minutes) {
        const hrs = minutes / 60;
        const minute = hrs.toString().split('.')[0];
        const percent = parseInt(hrs.toString().split('.')[1].slice(0, 2));
        const sec = Math.ceil((60 * percent) / 100);

        if (parseInt(minute) < 10 && sec < 10) {
            return `0${minute}:0${sec}`;
        }
        if (parseInt(minute) < 10) {
            return `0${minute}:${sec}`;
        }
        if (sec < 10) {
            return `${minute}:0${sec}`;
        }
        return `${minute}:${sec}`;
    }
}

const renderPlayPauseIcon = (isPlaying) => {
    if (isPlaying) {
        return <Entypo name="controller-paus" size={24} color={Colors.ACTIVE_FONT} />
    }
    return <Entypo name="controller-play" size={24} color={Colors.ACTIVE_FONT} />
}

const AudioListItem = ({
    title,
    duration,
    onOptionPress,
    onAudioPress,
    isPlaying,
    activeListItem
}) => {
    return (
        <>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={onAudioPress}>
                    <View style={styles.leftContainer}>
                        
                        <View style={[styles.thumbnail, {backgroundColor: activeListItem ? Colors.ACTIVE_BG : Colors.FONT_DARK}]}>    
                            <Text style={styles.thumbnailText}>
                                {/* {activeListItem ? renderPlayPauseIcon(isPlaying) : getThumbnailText(title) } */}
                                {activeListItem ? 
                                    renderPlayPauseIcon(isPlaying) : 
                                    <Ionicons name="musical-notes" size={22} color={Colors.FONT_LIGHT} /> 
                                }
                            </Text>
                        </View>

                        <View style={styles.titleContainer}>
                            <Text numberOfLines={1} style={styles.title}>
                                {title}
                            </Text>
                            <Text numberOfLines={1} style={styles.timeText}>
                                {convertTime(duration)}
                            </Text>
                        </View>

                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.rightContainer}>
                    <Entypo
                        name="dots-three-vertical"
                        size={20}
                        color={Colors.FONT_MEDIUM}
                        onPress={onOptionPress}
                        style={{ padding: 10 }}
                    />
                </View>
            </View>
            {/* <View style={styles.separator} /> */}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignSelf: 'center',
        width: WIDTH - 40,
        // backgroundColor: '#270e43', //used
        // backgroundColor: '#352648',
        backgroundColor: '#27153e',  //good one
        padding: 8,
        paddingLeft: 15,
        margin: 5,
        borderRadius: 20
    },
    leftContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    rightContainer: {
        flexBasis: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'pink'
    },
    thumbnail: {
        height: 50,
        flexBasis: 50,
        backgroundColor: Colors.FONT_LIGHT,
        // backgroundColor: '#270e43',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25
    },
    thumbnailText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.FONT_LIGHT
    },
    titleContainer: {
        width: WIDTH - 180,
        paddingLeft: 10
    },
    title: {
        fontSize: 16,
        color: Colors.FONT_LIGHT,
        fontWeight: 'bold'
    },
    timeText: {
        fontSize: 14,
        color: Colors.FONT_MEDIUM,
    },
    separator: {
        width: WIDTH - 80,  //same width as a container
        backgroundColor: '#333',
        opacity: 0.3,
        height: 0.5,
        alignSelf: 'center',
        marginTop: 10
    }
});

export default AudioListItem;