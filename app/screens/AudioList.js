import React, { Component, createRef } from 'react';
import { Text, View, StyleSheet, ScrollView, Dimensions, Animated, TextInput } from 'react-native';
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

const ITEM_SIZE = 50;
const WIDTH = Dimensions.get('window').width;

export class AudioList extends Component {
    static contextType = AudioContext;


    constructor(props) {
        super(props);
        this.state = {
            optionModalVisible: false,
            search: '',
            displaySongs: [],
            // scrollY : new Animated.Value(0).current
        }
        this.currentItem = {}
        // this.scrollY = createRef(new Animated.Value(0)).current;
        // this.scrollY = createRef(new Animated.Value(0));
        // console.log("scrollY==> ", this.scrollY);
        // this.viewElement = createRef(null);
    }

    // scrollY  = this.myRef;

    layoutProvider = new LayoutProvider((i) => 'audio', (type, dim) => {
        dim.width = Dimensions.get('window').width;
        dim.height = 70;
    });



    handleAudioPress = async (audio) => {
        // console.log("handleAudioPress");
        await selectAudio(audio, this.context);
        
    }


    componentDidMount() {
        this.context.loadPreviousAudio();
        this.setState({...this.state, displaySongs: this.context.audioFiles});
        // this.viewElement.current.animate("fadeInUp", 2000);
        // console.log("this.viewElement.current",this.viewElement);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.search !== prevState.search) {
            // console.log('search changed');
            this.filterSearch();
        }
        // this.viewElement.current.animate("fadeInUp", 2000);
        // console.log("componentDidUpdate-----this.viewElement.current ===>\n",this.viewElement);
    }



    rowRenderer = (type, item, index, extendedState) => {
        // console.log("item ==> ", item);
        // const inputRange = [
        //     -1,
        //     0,
        //     ITEM_SIZE * index,
        //     ITEM_SIZE * (index + 2),
        // ]
        // const scale = this.scrollY.interpolate({
        //     inputRange,
        //     outputRange: [1, 1, 1, 0]
        // })


        return (
            <Animatable.View
                animation='fadeInUp'
                duration={1000}
                delay={index * 100}
                // ref={this.viewElement}
                useNativeDriver={true}

            // iterationCount='infinite'
            // onAnimationEnd={}
            >
                {/* <Animated.View style={{transform: [{scale}]}> */}

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

    filterSearch = async () => {
        // console.log("filterSearch");
        var regex = new RegExp(this.state.search, "i");
        // let displayItems = await this.context.dataProvider._data.filter(song => {
        let displayItems = await this.context.audioFiles.filter(song => {
            return regex.test(song.filename);
        });
        this.setState({...this.state, displaySongs: displayItems });
    }




    render() {


        return (
            <AudioContext.Consumer>
                {({ dataProvider, isPlaying, runOnPressAnimation }) => {
                    // console.log("dataProvider---> ",dataProvider);
                    // console.log("runOnPressAnimation (AudioList) ---> ",runOnPressAnimation);
                    if (!dataProvider._data.length) {
                        return null;
                    }
                    return (
                        <Screen style={{ flex: 1 }}>
                            <View style={styles.searchBar}>
                                <TextInput
                                    placeholder="Search"
                                    placeholderTextColor={Colors.FONT_LIGHT}
                                    style={{ color: Colors.FONT_LIGHT, paddingHorizontal: 5 }}
                                    onChangeText={this.updateSearchHandler}
                                    value={this.state.search}
                                />
                            </View>
                            <RecyclerListView
                                // onChange={onChange}
                                // onScroll={Animated.event(
                                //     [{ nativeEvent: { contentOffset: { y: this.scrollY } } }],
                                //     { useNativeDriver: true }
                                // )}
                                // ref = {this.viewElement}
                                // dataProvider={dataProvider}
                                dataProvider={
                                    this.state.search ? 
                                    new DataProvider((row1, row2) => row1 !== row2).cloneWithRows(this.state.displaySongs) 
                                    : dataProvider}
                                layoutProvider={this.layoutProvider}
                                rowRenderer={this.rowRenderer}
                                extendedState={{ isPlaying }}
                            />
                            <OptionModal
                                // onPlayPress={() => console.log('Playing audio')}
                                // onPlayListPress={() => {
                                //     this.context.updateState(this.context, {
                                //         addToPlayList: this.currentItem
                                //     });
                                //     this.props.navigation.navigate('PlayList');
                                //     this.setState({ ...this.state, optionModalVisible: false });  //added by me
                                // }}
                                options={[
                                    {
                                        title: 'Add to playlist',
                                        onPress: this.navigateToPlaylist
                                    },
                                ]}
                                currentItem={this.currentItem}
                                onClose={() => {
                                    this.setState({ ...this.state, optionModalVisible: false });
                                }}
                                visible={this.state.optionModalVisible}
                            />
                            {/* <TabBarAnimation runOnPressAnimation={true} /> */}
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
        alignItems: 'center'
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
        width: WIDTH - 40,
        marginHorizontal: 10,
        marginBottom: 10,
        padding: 5,
        borderRadius: 15,
        alignSelf: 'center',
        elevation: 20
    }
});

export default AudioList;
