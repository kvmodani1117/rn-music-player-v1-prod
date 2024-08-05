import React, { Component, createRef } from 'react';
import { 
    Text, 
    View, 
    StyleSheet, 
    ScrollView, 
    Dimensions, 
    Animated, 
    TextInput, 
    Keyboard, 
    TouchableWithoutFeedback,
    StatusBar,
} from 'react-native';
import { AudioContext } from '../context/AudioProvider'
import { LayoutProvider, RecyclerListView } from 'recyclerlistview'
import AudioListItem from '../components/AudioListItem';
import Screen from '../components/Screen';
import OptionModal from '../components/OptionModal';
import { Audio } from 'expo-av';
import { play, pause, resume, playNext, selectAudio } from '../misc/AudioController';
import { storeAudioForNextOpening } from '../misc/Helper';
import Colors from '../misc/Colors';
import TabBarAnimation from '../components/TabBarAnimation';
import * as Animatable from 'react-native-animatable';
import { DataProvider } from 'recyclerlistview';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { AntDesign } from '@expo/vector-icons';


const ITEM_SIZE = 50;
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export class AudioList extends Component {
    static contextType = AudioContext;


    constructor(props) {
        super(props);
        this.state = {
            optionModalVisible: false,
            search: '',
            displaySongs: [],
        }
        this.currentItem = {}
    }

    layoutProvider = new LayoutProvider((i) => 'audio', (type, dim) => {
        dim.width = Dimensions.get('window').width;
        dim.height = 70;
    });

    handleAudioPress = async (audio) => {
        await selectAudio(audio, this.context);

    }

    componentDidMount() {
        this.context.loadPreviousAudio();
        this.setState({ ...this.state, displaySongs: this.context.audioFiles });
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.search !== prevState.search) {
            this.filterSearch();
        }
    }

    rowRenderer = (type, item, index, extendedState) => {

        return (
            <Animatable.View
                animation='fadeInUp'
                duration={1000}
                delay={index * 100}
                useNativeDriver={true}
            >

                <AudioListItem
                    title={item.filename}
                    isPlaying={extendedState.isPlaying}  //context is like a state itself!
                    activeListItem={this.context.currentAudioIndex === index}
                    duration={item.duration}
                    onAudioPress={() => this.handleAudioPress(item)}
                    onOptionPress={() => {
                        this.currentItem = item;
                        this.setState({ ...this.state, optionModalVisible: true });
                    }}
                />
                {/* </Animated.View> */}
            </Animatable.View>
        )
    }



    navigateToPlaylist = () => {
        this.context.updateState(this.context, {
            addToPlayList: this.currentItem
        });
        this.props.navigation.navigate('PlayList');
        this.setState({ ...this.state, optionModalVisible: false });  //added by me
    }



    updateSearchHandler = (text) => {
        this.setState({ ...this.state, search: text });
    };

    clearSearchHandler = () => {
        this.setState({ ...this.state, search: '' });
        Keyboard.dismiss();
    };

    filterSearch = async () => {
        var regex = new RegExp(this.state.search, "i");
        let displayItems = await this.context.audioFiles.filter(song => {
            return regex.test(song.filename);
        });
        this.setState({ ...this.state, displaySongs: displayItems });
    }



    openShareDialogAsync = async (currentItem) => {
        if (!(await Sharing.isAvailableAsync())) {
            alert(`Uh oh, sharing isn't available on your platform`);
            return;
        }

        const url = currentItem.uri;
        await Sharing.shareAsync(url);
    };

    // deleteAudioFromDevice = async (currentItem) => {
    //     try {
    //         const url = currentItem.uri;
    //         Alert.alert(
    //             "Delete",
    //             "Are you sure you want to delete this file from device?",
    //             [
    //                 {
    //                     text: 'Delete',
    //                     onPress: async () => {
    //                         console.log("FileSystem.documentDirectory: ", FileSystem.documentDirectory);
    //                         await FileSystem.deleteAsync( FileSystem.documentDirectory + url);
    //                         console.log("deleted file on url: ", url);
    //                     }
    //                 }
    //             ],
    //             { cancelable: true }
    //         );
    //     } catch (error) {
    //         console.log(error);
    //     }

    // }


    render() {


        return (
            <AudioContext.Consumer>
                {({ dataProvider, isPlaying, runOnPressAnimation }) => {
                    if (!dataProvider._data.length) {
                        return null;
                    }
                    return (
                        <Screen style={styles.container}>
                            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                            <View style={styles.searchBar}>
                                <TextInput
                                    placeholder="SEARCH"
                                    placeholderTextColor={Colors.FONT_LIGHT}
                                    style={{ color: Colors.FONT_LIGHT, paddingHorizontal: 5, fontWeight:'bold', fontSize: 18, letterSpacing: 1, width: '90%' }}
                                    onChangeText={this.updateSearchHandler}
                                    value={this.state.search}
                                    
                                />
                                <View style={{justifyContent: 'center', alignItems: 'center', width: '10%'}}>
                                    <AntDesign 
                                        name="closecircle" 
                                        size={24} 
                                        color={Colors.FONT_LIGHT} 
                                        onPress={this.clearSearchHandler}    
                                    />
                                </View>
                            </View>
                            </TouchableWithoutFeedback>
                            {/* [ (bottomTab Height(80) + (SearchBar(40) + searchBar Bottom padding(10) ) = 130 ] */}
                            <View style={{height: HEIGHT - 140 - StatusBar.currentHeight}}>  
                            <RecyclerListView
                                dataProvider={
                                    this.state.search ?
                                        new DataProvider((row1, row2) => row1 !== row2).cloneWithRows(this.state.displaySongs)
                                        : dataProvider}
                                layoutProvider={this.layoutProvider}
                                rowRenderer={this.rowRenderer}
                                extendedState={{ isPlaying }}
                            />
                            </View>
                            <OptionModal
                                options={[
                                    {
                                        title: 'Add to playlist',
                                        onPress: this.navigateToPlaylist
                                    },
                                    {
                                        title: 'Share this audio',
                                        onPress: () => this.openShareDialogAsync(this.currentItem)
                                    },
                                    // {
                                    //     title: 'Delete this audio',
                                    //     onPress: () => this.deleteAudioFromDevice(this.currentItem)
                                    // },
                                ]}
                                currentItem={this.currentItem}
                                onClose={() => {
                                    this.setState({ ...this.state, optionModalVisible: false });
                                }}
                                visible={this.state.optionModalVisible}
                            />
                        </Screen>
                    )
                }}
            </AudioContext.Consumer>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBarStyle: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        elevation: 5,
        backgroundColor: Colors.FONT_DARK,
        borderRadius: 25,
        height: 70,
        borderTopWidth: 0,
    },
    searchBar: {
        backgroundColor: Colors.FONT_DARK,
        height: 40,
        width: WIDTH - 30,
        marginHorizontal: 10,
        marginBottom: 10,
        padding: 5,
        borderRadius: 15,
        alignSelf: 'center',
        elevation: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default AudioList;
