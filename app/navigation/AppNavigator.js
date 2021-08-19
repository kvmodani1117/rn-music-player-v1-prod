import React, { useContext, useRef, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import PlayList from '../screens/PlayList';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import PlayListDetail from '../screens/PlayListDetail';
import Colors from '../misc/Colors';
import { View, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { onPressAnimation } from '../components/TabBarAnimation';
import { AudioContext } from '../context/AudioProvider';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();



const PlayListScreen = () => {
    return <Stack.Navigator screenOptions={{ headerShown: false }} >
        <Stack.Screen name='PlayList' component={PlayList} />
        <Stack.Screen name='PlayListDetail' component={PlayListDetail} />
    </Stack.Navigator>
}


// const [bool, setBool] = useState(false);

const AppNavigator = () => {

    // const animatedValue = useRef(new Animated.Value(0)).current;
    // const animation = (toValue) => (
    //     Animated.timing(animatedValue, {
    //         toValue,
    //         duration: 2000,
    //         useNativeDriver: true,
    //     })
    // );
    // const [index, setIndex] = useState(0);
    // const onPressAnimation = () => {
    //     console.log("1");
    //     setIndex(index === 1 ? 0 : 1);
    //     animation(index === 1 ? 0 : 1).start();
    // }
    // const transformStyles = {
    //     transform: [
    //         {
    //             perspective: 400
    //         },
    //         {
    //             rotateY: animatedValue.interpolate({
    //                 inputRange: [0, 0.5, 1],
    //                 outputRange: ['0deg', '-90deg', '-180deg']
    //             })
    //         },
    //         {
    //             scale: animatedValue.interpolate({
    //                 inputRange: [0, 0.5, 1],
    //                 outputRange: [1, 5, 1]
    //             })
    //         },
    //         // {
    //         //     translateX: animatedValue.interpolate({
    //         //         inputRange: [0, 0.5, 1],
    //         //         outputRange: ['0%', '50%', '0%']
    //         //     })
    //         // }
    //     ],
    // };
    const context = useContext(AudioContext);
    return (
        <View style={{ flex: 1 }}>
            {/* <Animated.View style={[{ flex: 1 }, transformStyles]}> */}
                <Tab.Navigator
                    tabBarOptions={{
                        showLabel: false,
                        style: styles.tabBarStyle
                    }}
                >
                    <Tab.Screen
                        name='AudioList'
                        component={AudioList}
                        listeners={() => ({
                            tabPress: e => {
                                // onPressAnimation();
                                // context.runOnPressAnimation =  context.runOnPressAnimation ? false : true;
                                // context.runOnPressAnimation = true;
                                // console.log("Navigator ===> ", context.runOnPressAnimation);
                                // if(bool){
                                //     setBool(false)
                                // }
                                // else{
                                //     setBool(true);
                                // }

                                // styles.tabBarStyle = {...styles.tabBarStyle, height: 90}
                            },
                        })}
                        options={{
                            tabBarIcon: ({ color, size, focused }) => (
                                <Ionicons
                                    name="md-headset"
                                    // size={size} 
                                    // color={color} 
                                    size={focused ? 35 : 23}
                                    color={focused ? Colors.ACTIVE_BG : Colors.ACTIVE_FONT}

                                />
                            )
                        }}
                    />
                    <Tab.Screen
                        name='Player'
                        component={Player}
                        listeners={() => ({
                            tabPress: e => {
                                // onPressAnimation();
                                // context.runOnPressAnimation =  context.runOnPressAnimation ? false : true;
                                // context.runOnPressAnimation = true;
                                // console.log("Navigator===> ", context.runOnPressAnimation);
                                // styles.tabBarStyle = {...styles.tabBarStyle, height: 90}
                            },
                        })}
                        options={{
                            tabBarIcon: ({ color, size, focused }) => (
                                <Ionicons
                                    name="md-play"
                                    size={focused ? 35 : 23}
                                    color={focused ? Colors.ACTIVE_BG : Colors.ACTIVE_FONT}
                                />
                            )
                        }}
                    />
                    <Tab.Screen
                        name='PlayList'
                        component={PlayListScreen}
                        listeners={() => ({
                            tabPress: e => {
                                // onPressAnimation();
                                // context.runOnPressAnimation =  context.runOnPressAnimation ? false : true;
                                // context.runOnPressAnimation = true;
                                // console.log("Navigator===> ", context.runOnPressAnimation);
                                // styles.tabBarStyle = {...styles.tabBarStyle, height: 90}
                            },
                        })}
                        options={{
                            tabBarIcon: ({ color, size, focused }) => (
                                <MaterialIcons
                                    name="library-music"
                                    size={focused ? 35 : 23}
                                    color={focused ? Colors.ACTIVE_BG : Colors.ACTIVE_FONT}
                                />
                            )
                        }}
                    />
                </Tab.Navigator>
            {/* </Animated.View> */}
        </View>
    );
}


const styles = StyleSheet.create({
    tabBarStyle: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        elevation: 5,
        backgroundColor: Colors.FONT_DARK,
        borderRadius: 25,
        height: 60,
        borderTopWidth: 0,
    }
});

export default AppNavigator;
