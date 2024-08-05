import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import Colors from '../misc/Colors';
import AudioListItem from '../components/AudioListItem';
import { selectAudio } from '../misc/AudioController';
import { AudioContext } from '../context/AudioProvider';
import OptionModal from '../components/OptionModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Screen from '../components/Screen';


const HEIGHT = Dimensions.get('window').height;
const PlayListDetail = (props) => {
    //To know what is inside the playlist obj, go to createPlayList() in PlayList.js
    const context = useContext(AudioContext);
    const playList = props.route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState({});
    const [audios, setAudios] = useState(playList.audios);


    const playAudio = async (audio) => {
        await selectAudio(audio, context, {
            activePlayList: playList,
            isPlayListRunning: true
        });
    }

    const closeModal = () => {
        setSelectedItem({});
        setModalVisible(false);
    }

    const removeAudio = async () => {
        let isPlaying = context.isPlaying;
        let isPlayListRunning = context.isPlayListRunning;
        let soundObj = context.soundObj;
        let playbackPosition = context.playbackPosition;
        let activePlayList = context.activePlayList;

        if (context.isPlayListRunning && context?.currentAudio?.id === selectedItem?.id) {
            //stop the audio first
            await context?.playbackObj?.stopAsync();
            await context?.playbackObj?.unloadAsync();

            isPlaying = false;
            isPlayListRunning = false;
            soundObj = null;
            playbackPosition = 0;
            activePlayList = [];

        }

        const newAudios = audios.filter(audio => audio.id !== selectedItem.id);
        const result = await AsyncStorage.getItem('playlist');
        if (result !== null) {
            const oldPlayLists = JSON.parse(result);
            const updatedPlayLists = oldPlayLists.filter(item => {
                if (item.id === playList.id) {
                    item.audios = newAudios
                }
                return item;
            });

            AsyncStorage.setItem('playlist', JSON.stringify(updatedPlayLists));
            context.updateState(context, {
                playList: updatedPlayLists,
                isPlayListRunning,
                activePlayList,
                playbackPosition,
                isPlaying,
                soundObj
            });

        }
        setAudios(newAudios);
        closeModal();
    }


    const removePlaylist = async () => {

        let isPlaying = context.isPlaying;
        let isPlayListRunning = context.isPlayListRunning;
        let soundObj = context.soundObj;
        let playbackPosition = context.playbackPosition;
        let activePlayList = context.activePlayList;

        if (context.isPlayListRunning && activePlayList.id === playList.id) {
            //stop the audio first
            await context.playbackObj.stopAsync();
            await context.playbackObj.unloadAsync();

            isPlaying = false;
            isPlayListRunning = false;
            soundObj = null;
            playbackPosition = 0;
            activePlayList = [];

        }

        const result = await AsyncStorage.getItem('playlist');
        if (result !== null) {
            const oldPlayLists = JSON.parse(result);
            const updatedPlayLists = oldPlayLists.filter(item => item.id !== playList.id);

            AsyncStorage.setItem('playlist', JSON.stringify(updatedPlayLists));
            context.updateState(context, {
                playList: updatedPlayLists,
                isPlayListRunning,
                activePlayList,
                playbackPosition,
                isPlaying,
                soundObj
            });

        }

        props.navigation.goBack();

    }


    return (
        <>
            <View style={styles.container} >
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginVertical: 10 }}>
                    <Text style={styles.title} >{playList.title}</Text>
                    <TouchableOpacity onPress={removePlaylist} >
                        {/* <Text style={[styles.title, { color: 'red' }]} >Remove</Text> */}
                        <View style={[styles.title, { color: 'red' }]} >
                            <MaterialCommunityIcons name="delete-empty" size={28} color="#b01030" />
                        </View>
                    </TouchableOpacity>
                </View>
                <View>
                {audios.length ? (
                    <FlatList
                        contentContainerStyle={styles.listContainer}
                        data={audios}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={{ marginBottom: -5}}>
                                <AudioListItem
                                    title={item.filename}
                                    duration={item.duration}
                                    isPlaying={context.isPlaying}
                                    activeListItem={item.id === context?.currentAudio?.id}
                                    onAudioPress={() => playAudio(item)}
                                    onOptionPress={() => {
                                        setSelectedItem(item);
                                        setModalVisible(true);
                                    }}
                                />
                            </View>
                        )}
                    />) : <Text style={{
                        fontWeight: 'bold',
                        color: Colors.FONT_LIGHT,
                        fontSize: 23,
                        padding: 50,
                    }}>No Audio</Text>}
                </View>
            </View>
            <OptionModal
                visible={modalVisible}
                onClose={closeModal}
                options={[{
                    title: 'Remove from Playlist',
                    onPress: removeAudio
                }]}
                currentItem={selectedItem}
            />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        height: HEIGHT - 60,
        alignItems: 'center',
    },
    listContainer: {
        paddingBottom: 90,

    },
    title: {
        textAlign: 'center',
        fontSize: 20,
        paddingVertical: 5,
        fontWeight: 'bold',
        color: Colors.ACTIVE_BG,
    }
});

export default PlayListDetail;
