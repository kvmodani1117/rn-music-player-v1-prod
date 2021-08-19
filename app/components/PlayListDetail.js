// import React from 'react';
// import { Modal, StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
// import Colors from '../misc/Colors';
// import AudioListItem from '../components/AudioListItem';
// import { selectAudio } from '../misc/AudioController';

// const PlayListDetail = ({ visible, playList, onClose }) => {
//     //To know what is inside the playlist obj, go to createPlayList() in PlayList.js
//     const playAudio = (audio) => {
//         selectAudio(audio, context);
//     }
    
//     return (
//         <Modal
//             visible={visible}
//             animationType='slide'
//             transparent
//             onRequestClose={onClose}
//         >
//             <View style={styles.container} >
//                 <Text style={styles.title} >{playList.title}</Text>
//                 <FlatList
//                     contentContainerStyle={styles.listContainer}
//                     data={playList.audios}
//                     keyExtractor={item => item.id.toString()}
//                     renderItem={({ item }) => (
//                         <View style={{marginBottom: 10}}>
//                             <AudioListItem
//                                 title={item.filename}
//                                 duration={item.duration}
//                                 onAudioPress={() => playAudio(item)}
//                             />
//                         </View>
//                     )}
//                 />
//             </View>
//             <View style={[StyleSheet.absoluteFillObject, styles.modalBG]}>

//             </View>
//         </Modal>
//     )
// }

// const WIDTH = Dimensions.get('window').width;
// const HEIGHT = Dimensions.get('window').height;

// const styles = StyleSheet.create({
//     container: {
//         position: 'absolute',
//         bottom: 0,
//         alignSelf: 'center',
//         height: HEIGHT - 150,
//         width: WIDTH - 15,
//         backgroundColor: 'white',
//         borderTopRightRadius: 25,
//         borderTopLeftRadius: 25,
//     },
//     modalBG: {
//         backgroundColor: Colors.MODAL_BG,
//         zIndex: -1,
//     },
//     listContainer: {
//         padding: 20,
//     },
//     title: {
//         textAlign: 'center',
//         fontSize: 20,
//         paddingVertical: 5,
//         fontWeight: 'bold',
//         color: Colors.ACTIVE_BG,
//     }
// });

// export default PlayListDetail;
