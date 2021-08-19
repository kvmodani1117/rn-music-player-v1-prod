// import React, { useEffect, useRef, useState } from 'react';
// import { StyleSheet, Text, View, Animated, Button } from 'react-native';
// import Colors from '../misc/Colors';


// const TabBarAnimation = (props) => {

//     console.log("TabBarAnimation : ", props.runOnPressAnimation);
    

//     const animatedValue = useRef(new Animated.Value(0)).current;
//     const animation = (toValue) => (
//         Animated.timing(animatedValue, {
//             toValue,
//             duration: 3000,
//             useNativeDriver: false,
//         })
//     );
//     const [index, setIndex] = useState(0);
//     const onPressAnimation = () => {
//         console.log("onPressAnimation() called!");
//         setIndex(index === 1 ? 0 : 1);
//         animation(index === 1 ? 0 : 1).start();
        
//     }
    
//     // useEffect(() => {
//     //     if(props.runOnPressAnimation){
//     //         console.log("5");
//     //         onPressAnimation;
//     //     }
//     // });
//     const transformStyles = {
//         transform: [
//             {
//                 perspective: 400
//             },
//             {
//                 rotateY: animatedValue.interpolate({
//                     inputRange: [0, 0.25, 0.5, 1],
//                     outputRange: ['0deg', '-45deg', '-90deg', '-180deg']
//                 })
//             },
//             {
//                 scale: animatedValue.interpolate({
//                     inputRange: [0, 0.25, 0.5, 0.75, 1],
//                     outputRange: [1, 6, 12, 6, 1]
//                 })
//             },
//             // {
//             //     translateX: animatedValue.interpolate({
//             //         inputRange: [0, 0.5, 1],
//             //         outputRange: [0, 50, 0]
//             //         // outputRange: ['0%', '50%', '0%']
//             //     })
//             // }
//         ],
//     };



//     return (
//         <View>
//             {/* <Button title='Click me' onPress={onPressAnimation} /> */}
//             {/* { props.runOnPressAnimation ? onPressAnimation : null} */}
//             <Animated.View style={[styles.tabBarStyle, transformStyles]}>
                
//             </Animated.View>
//         </View>
//     )
// };


// const styles = StyleSheet.create({
//     // tabBarStyle: {
//     //     position: 'absolute',
//     //     bottom: 20,
//     //     left: 20,
//     //     right: 20,
//     //     elevation: 5,
//     //     backgroundColor: Colors.FONT_DARK,
//     //     // backgroundColor: 'red',
//     //     borderRadius: 25,
//     //     height: 70,
//     //     borderTopWidth: 0
//     // }
//     tabBarStyle: {
//         position: 'absolute',
//         bottom: 20,
//         elevation: 5,
//         backgroundColor: Colors.FONT_DARK,
//         // backgroundColor: 'red',
//         borderRadius: 500,
//         height: 70,
//         width: 70,
//         borderTopWidth: 0,
//         alignSelf: 'center'
//     }
// });

// export default TabBarAnimation;