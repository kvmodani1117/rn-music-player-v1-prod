import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, FlatList, Alert, Animated } from 'react-native';
import PlayListInputModal from '../components/PlayListInputModal';
import Colors from '../misc/Colors';
import { AudioContext } from '../context/AudioProvider';
import TabBarAnimation from '../components/TabBarAnimation';
import { Ionicons } from '@expo/vector-icons';
// import PlayListDetail from '../components/PlayListDetail';

let selectedPlayList = {};
const PlayList = ({ navigation }) => {

    const [modalVisible, setModalVisible] = useState(false);
    const [showPlayList, setShowPlayList] = useState(false);

    const context = useContext(AudioContext);
    const { playList, addToPlayList, updateState } = context;


    const createPlayList = async playListName => {
        const result = await AsyncStorage.getItem('playlist');
        if (result !== null) {
            const audios = [];
            if (addToPlayList) {
                audios.push(addToPlayList);
            }
            const newList = {
                id: Date.now(),
                title: playListName,
                audios: audios
            }
            const updatedList = [...playList, newList];
            updateState(context, { addToPlayList: null, playList: updatedList });
            await AsyncStorage.setItem('playlist', JSON.stringify(updatedList));
        }

        setModalVisible(false);
    }


    const renderPlayList = async () => {
        const result = await AsyncStorage.getItem('playlist');
        //If app running for the 1st time...
        if (result === null) {
            const defaultPlayList = {
                id: Date.now(),
                title: 'My Favourite',
                audios: []
            }

            const newPlayList = [...playList, defaultPlayList];
            updateState(context, { playList: [...newPlayList] });
            return await AsyncStorage.setItem('playlist', JSON.stringify([...newPlayList]));
        }
        updateState(context, { playList: JSON.parse(result) });
    }

    useEffect(() => {
        if (!playList.length) {
            renderPlayList();
        }
    }, []);



    const handleBannerPress = async (playList) => {

        if (addToPlayList) {
            const result = await AsyncStorage.getItem('playlist');

            let oldList = [];
            let updatedList = [];
            let sameAudio = false;

            if (result !== null) {
                oldList = JSON.parse(result);

                updatedList = oldList.filter(list => {
                    if (list.id === playList.id) { // kaunse playlist par click kiya hai...?
                        //check if that same audio is already inside our selected playlist or not
                        for (let audio of list.audios) {
                            if (audio.id === addToPlayList.id) {
                                //alert with some message
                                sameAudio = true;
                                return;
                            }
                        }

                        //otherwise update the playlist.
                        list.audios = [...list.audios, addToPlayList];

                    }
                    return list;
                });
            }

            if (sameAudio) {
                Alert.alert(
                    'Found same audio!',
                    `${addToPlayList.filename} is already inside this Playlist.`,
                );
                sameAudio = false;
                return updateState(context, { addToPlayList: null });
            }

            updateState(context, { addToPlayList: null, playList: [...updatedList] });
            return AsyncStorage.setItem('playlist', JSON.stringify([...updatedList]));

        }

        //if there is no audio selected, then we want to open the list.
        selectedPlayList = playList;
        // setShowPlayList(true);
        navigation.navigate('PlayListDetail', playList);

    }



    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                {playList.length ? playList.map(item => (
                    <TouchableOpacity
                        key={item.id.toString()}
                        style={styles.playListBanner}
                        onPress={() => handleBannerPress(item)}
                    >
                        <Text style={{color: Colors.APP_BG, fontSize: 16, fontWeight: 'bold'}}>{item.title}</Text>
                        <Text style={styles.audioCount}>
                            {item.audios.length > 1
                                ? `${item.audios.length} Songs`
                                : `${item.audios.length} Song`}
                        </Text>
                    </TouchableOpacity>
                ))
                    : null}

                <TouchableOpacity
                    style={{ marginTop: 10, alignItems: 'center' }}
                    onPress={() => {
                        setModalVisible(true);
                    }}
                >
                    {/* <Text style={styles.playListBtn}>+ Add New Playlist</Text> */}
                    <View style={styles.playListBtn} >
                        <Ionicons name="add-circle-outline" size={40} color={Colors.ACTIVE_BG} />
                    </View>
                </TouchableOpacity>
                <PlayListInputModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onSubmit={createPlayList}
                />
            </ScrollView>
            {/* <PlayListDetail
                visible={showPlayList}
                playList={selectedPlayList}
                onClose={() => setShowPlayList(false)}
            /> */}
            {/* <TabBarAnimation runOnPressAnimation={runOnPressAnimation} /> */}
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    playListBanner: {
        padding: 10,
        // backgroundColor: 'rgba(204,204,204, 0.3)',
        backgroundColor: Colors.FONT_LIGHT,
        borderRadius: 10,
        marginBottom: 15
    },
    audioCount: {
        marginTop: 3,
        // opacity: 0.5,
        fontSize: 14,
        color: Colors.FONT_DARK,
        fontWeight: '600'
    },
    playListBtn: {
        color: Colors.ACTIVE_BG,
        letterSpacing: 1,
        fontWeight: 'bold',
        fontSize: 14,
        padding: 5,
        elevation: 5
    }
})

export default PlayList;
