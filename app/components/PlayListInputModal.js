import React, { useState } from 'react';
import { Dimensions, Modal, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../misc/Colors';

const PlayListInputModal = ({ visible, onClose, onSubmit }) => {

    const [playListName, setPlayListName] = useState('');

    const handleOnSubmit = () => {
        if (!playListName.trim()) {
            onClose();
        }
        else {
            onSubmit(playListName);
            setPlayListName('');
            onClose();
        }
    }

    return (
        <Modal visible={visible} animationType='fade' transparent >
            <View style={styles.modalContainer} >
                <View style={styles.inputContainer} >
                    <Text style={{ color: Colors.ACTIVE_BG, fontSize: 14, marginBottom: 20 }}>Create New Playlist</Text>
                    <TextInput
                        value={playListName}
                        onChangeText={(text) => { setPlayListName(text) }}
                        style={styles.input}
                    />
                    <AntDesign
                        name="check"
                        size={24}
                        color={Colors.ACTIVE_FONT}
                        style={styles.submitIcon}
                        onPress={handleOnSubmit}
                    />
                </View>
            </View>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={[StyleSheet.absoluteFillObject, styles.modalBG]}></View>
            </TouchableWithoutFeedback>
        </Modal>
    )
};

const WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputContainer: {
        width: WIDTH - 20,
        height: 200,
        borderRadius: 20,
        backgroundColor: Colors.FONT_DARK,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        width: WIDTH - 40,
        borderBottomWidth: 1,
        borderBottomColor: Colors.ACTIVE_BG,
        fontSize: 18,
        paddingVertical: 5,
        color: Colors.FONT_LIGHT,
        margin: 10
    },
    submitIcon: {
        padding: 10,
        backgroundColor: Colors.ACTIVE_BG,
        borderRadius: 50,
        marginTop: 30,
    },
    modalBG: {
        // backgroundColor: Colors.MODAL_BG,
        backgroundColor: "rgba(0,0,0,0.6)",
        zIndex: -1
    }
});

export default PlayListInputModal;
