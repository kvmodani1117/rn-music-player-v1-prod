import React, { useContext, useRef, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import AudioList from '../screens/AudioList';
import Player from '../screens/Player';
import PlayList from '../screens/PlayList';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import PlayListDetail from '../screens/PlayListDetail';
import Colors from '../misc/Colors';
import { View, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { onPressAnimation } from '../components/TabBarAnimation';
import { AudioContext } from '../context/AudioProvider';

// const Tab = createBottomTabNavigator();
const Tab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();



const PlayListScreen = () => {
    return (
    <Stack.Navigator 
        screenOptions={{ 
            headerShown: false,
            gestureEnabled: true,
            gestureDirection: "horizontal",
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }} 
    >
        <Stack.Screen name='PlayList' component={PlayList} />
        <Stack.Screen name='PlayListDetail' component={PlayListDetail} />
    </Stack.Navigator>)
}


// const [bool, setBool] = useState(false);

const AppNavigator = () => {

    const context = useContext(AudioContext);
    return (
        <View style={{ flex: 1 }}>
            {/* <Animated.View style={[{ flex: 1 }, transformStyles]}> */}
                <Tab.Navigator
                    tabBarOptions={{
                        showLabel: false,
                        showIcon: true,
                        style: styles.tabBarStyle,
                        renderIndicator: () => null   //to hide active bottom indicator
                    }}
                    tabBarPosition={'bottom'}
                    lazy={true}
                >
                    <Tab.Screen
                        name='AudioList'
                        component={AudioList}
                        options={{
                            tabBarIcon: ({ color, size, focused }) => (
                                <Ionicons
                                    name="md-headset"
                                    // size={size} 
                                    // color={color} 
                                    size={focused ? 25 : 23}
                                    color={focused ? Colors.ACTIVE_BG : Colors.ACTIVE_FONT}

                                />
                            )
                        }}
                    />
                    <Tab.Screen
                        name='Player'
                        component={Player}
                        options={{
                            tabBarIcon: ({ color, size, focused }) => (
                                <Ionicons
                                    name="md-play"
                                    size={focused ? 25 : 23}
                                    color={focused ? Colors.ACTIVE_BG : Colors.ACTIVE_FONT}
                                />
                            )
                        }}
                    />
                    <Tab.Screen
                        name='PlayList'
                        component={PlayListScreen}
                        options={{
                            tabBarIcon: ({ color, size, focused }) => (
                                <MaterialIcons
                                    name="library-music"
                                    size={focused ? 25 : 23}
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
