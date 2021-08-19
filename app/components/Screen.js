import React from 'react'
import { StatusBar, StyleSheet, Text, View } from 'react-native'
import Colors from '../misc/Colors';

const Screen = ({children}) => {
    return (
        <View style={styles.container}>
            {children}
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.APP_BG,
        paddingTop: StatusBar.currentHeight
    }
});

export default Screen;
