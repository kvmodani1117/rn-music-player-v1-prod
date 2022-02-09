import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import Colors from '../misc/Colors';

const PlayerButton = (props) => {

    const { iconType, onPress, size = 25, iconColor = Colors.FONT } = props;

    const getIconName = (type) => {
        switch (type) {
            case 'PLAY':
                return  'pausecircle';
            case 'PAUSE':
                return   'play';
                // return   'playcircleo';
            case 'NEXT':
                // return  'forward';
                return  'caretright';
            case 'PREV':
                // return  'banckward';
                return  'caretleft';
        
            default:
                break;
        }
    };

    return (
        <AntDesign {...props} onPress={onPress} name={getIconName(iconType)} size={size} color={iconColor} />
    )
}

export default PlayerButton;
