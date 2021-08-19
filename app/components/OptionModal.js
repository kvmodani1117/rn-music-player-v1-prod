import React from 'react';
import { StyleSheet, Text, View, Modal, StatusBar, TouchableWithoutFeedback, Dimensions } from 'react-native';
import Colors from '../misc/Colors';

const WIDTH = Dimensions.get('window').width;

const OptionModal = ({
    visible,
    currentItem,
    onClose,
    options,
    onPlayPress,
    onPlayListPress
}) => {
    const { filename } = currentItem;
    return (
        <>
            <StatusBar hidden />
            <Modal animationType='slide' transparent visible={visible} >
                <View style={styles.modal}>
                    <Text style={styles.title} numberOfLines={2} >
                        {filename}
                    </Text>
                    <View style={styles.separator} />
                    <View style={styles.optionContainer}>
                        {options.map(option => {
                            return (
                                <TouchableWithoutFeedback key={option.title} onPress={option.onPress}>
                                    <Text style={styles.option}>{option.title}</Text>
                                </TouchableWithoutFeedback>
                            );
                        })}
                        {/* <TouchableWithoutFeedback onPress={onPlayPress}>
                            <Text style={styles.option}>Play</Text>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={onPlayListPress}>
                            <Text style={styles.option}>Add to Playlist</Text>
                        </TouchableWithoutFeedback> */}
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.modalBg}></View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.FONT_LIGHT,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        zIndex: 1000
    },
    optionContainer: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 20,
        paddingBottom: 0,
        color: Colors.APP_BG
    },
    option: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.FONT_DARK,
        paddingVertical: 10,
        letterSpacing: 1
    },
    modalBg: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: Colors.MODAL_BG
    },
    separator: {
        width: WIDTH,  //same width as a container
        backgroundColor: '#333',
        opacity: 0.3,
        height: 0.5,
        alignSelf: 'center',
        marginTop: 10
    }
});

export default OptionModal;