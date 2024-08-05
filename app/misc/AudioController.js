import { storeAudioForNextOpening } from "./Helper";

//play audio
export const play = async (playbackObj, uri, lastPosition) => {
    try {
        if (!lastPosition) {
            // const {
            //     soundObj,
            // } = context;
            // console.log("playbackObj-->",playbackObj);
            // console.log("soundObj--------------->",soundObj);
            const status = await playbackObj.loadAsync(
                { uri: uri },
                { shouldPlay: true, progressUpdateIntervalMillis: 1000 }
            );
            return status;
        };

        //If there is some lastPosition, then we will play audio from lastPosition
        await playbackObj.loadAsync(
            { uri: uri },
            { progressUpdateIntervalMillis: 1000 }
        );
        
        return await playbackObj.playFromPositionAsync(lastPosition);

    } catch (error) {
        console.log("error inside play helper mtd --> ", error.message);
    }
}

//pause audio
export const pause = async (playbackObj) => {
    try {
        const status = await playbackObj.setStatusAsync({
            shouldPlay: false
        });
        return status;
    } catch (error) {
        console.log("error inside pause helper mtd -->", error.message);
    }
}

//resume audio
export const resume = async (playbackObj) => {
    try {
        const status = await playbackObj.playAsync();
        return status;
    } catch (error) {
        console.log("error inside resume helper mtd -->", error.message);
    }
}

//select another audio
export const playNext = async (playbackObj, uri) => {
    try {
        await playbackObj.stopAsync();
        await playbackObj.unloadAsync();
        const status = await play(playbackObj, uri);
        return status;
    } catch (error) {
        console.log("error inside playNext helper mtd", error.message);
    }
}


export const selectAudio = async (audio, context, playListInfo = {}) => {
    const {
        soundObj,
        playbackObj,
        currentAudio,
        updateState,
        audioFiles,
        onPlaybackStatusUpdate
    } = context;


    try {
        //playing the audio for the 1st time...
        if (soundObj === null) {
            const status = await play(playbackObj, audio.uri, audio.lastPosition);
            const index = audioFiles.findIndex(({ id }) => id === audio.id);
            updateState(
                context,
                {
                    currentAudio: audio,
                    soundObj: status,
                    isPlaying: true,
                    currentAudioIndex: index,
                    isPlayListRunning: false,
                    activePlayList: [],
                    ...playListInfo
                }
            );
            playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
            return storeAudioForNextOpening(audio, index);
        }


        //pause the audio... if already playing...
        if (soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id) {
            const status = await pause(playbackObj);
            return updateState(context, {
                soundObj: status,
                isPlaying: false,
                playbackPosition: status.positionMillis
            });
        }


        //resume audio...
        if (
            soundObj.isLoaded &&
            !soundObj.isPlaying &&
            currentAudio.id === audio.id
        ) {
            const status = await resume(playbackObj);
            return updateState(context, { soundObj: status, isPlaying: true });
        }


        //select another audio
        if (soundObj.isLoaded && currentAudio.id !== audio.id) {
            const status = await playNext(playbackObj, audio.uri);
            const index = audioFiles.findIndex(({ id }) => id === audio.id);
            // console.log("soundObj====>",soundObj);
            // console.log("currentAudio====>",currentAudio);
            updateState(
                context,
                {
                    currentAudio: audio,
                    soundObj: status,
                    isPlaying: true,
                    currentAudioIndex: index,
                    isPlayListRunning: false,
                    activePlayList: [],
                    ...playListInfo
                }
            );
            return storeAudioForNextOpening(audio, index);
        }


    } catch (error) {
        console.log("error inside selectAudio() method.", error.message);
    }

}


const selectAudioFromPlayList = async (context, selectPrevOrNext) => {
    const { activePlayList, currentAudio, audioFiles, playbackObj, updateState } = context;
    let audio;
    let defaultIndex;
    let nextIndex;

    const indexOnPlayList = activePlayList.audios.findIndex(({ id }) => id === currentAudio.id);

    if (selectPrevOrNext === 'next') {
        nextIndex = indexOnPlayList + 1;
        defaultIndex = 0;
    }
    if (selectPrevOrNext === 'previous') {
        nextIndex = indexOnPlayList - 1;
        defaultIndex = activePlayList.audios.length - 1;
    }
    audio = activePlayList.audios[nextIndex];

    if (!audio) {
        audio = activePlayList.audios[defaultIndex];
    }

    const indexOnAllList = audioFiles.findIndex(({ id }) => id === audio.id);

    const status = await playNext(playbackObj, audio.uri);
    return updateState(context, {
        soundObj: status,
        isPlaying: true,
        currentAudio: audio,
        currentAudioIndex: indexOnAllList
    });
}


export const changeAudio = async (context, selectPrevOrNext) => {

    const {
        playbackObj,
        currentAudioIndex,
        totalAudioCount,
        audioFiles,
        updateState,
        onPlaybackStatusUpdate,
        isPlayListRunning,
    } = context;

    if (isPlayListRunning) {
        return selectAudioFromPlayList(context, selectPrevOrNext);
    }


    try {

        const { isLoaded } = await playbackObj.getStatusAsync();
        const isLastAudio = currentAudioIndex + 1 === totalAudioCount;
        const isFirstAudio = currentAudioIndex <= 0;
        let audio;
        let index;
        let status;

        //for next audio...
        if (selectPrevOrNext === 'next') {
            audio = audioFiles[currentAudioIndex + 1];
            if (!isLoaded && !isLastAudio) {
                index = currentAudioIndex + 1;
                status = await play(playbackObj, audio.uri);
                playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
            }
            if (isLoaded && !isLastAudio) {
                index = currentAudioIndex + 1;
                status = await playNext(playbackObj, audio.uri);
            }
            if (isLastAudio) {
                index = 0;
                audio = audioFiles[index];
                if (isLoaded) {
                    status = await playNext(playbackObj, audio.uri);
                }
                else {
                    status = await play(playbackObj, audio.uri);
                }
            }
        }

        //previous audio...
        if (selectPrevOrNext === 'previous') {
            audio = audioFiles[currentAudioIndex - 1];
            if (!isLoaded && !isFirstAudio) {
                index = currentAudioIndex - 1;
                status = await play(playbackObj, audio.uri);
                playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
            }
            if (isLoaded && !isFirstAudio) {
                index = currentAudioIndex - 1;
                status = await playNext(playbackObj, audio.uri);
            }
            if (isFirstAudio) {
                index = totalAudioCount - 1;
                audio = audioFiles[index];
                if (isLoaded) {
                    status = await playNext(playbackObj, audio.uri);
                }
                else {
                    status = await play(playbackObj, audio.uri);
                }
            }

        }

        updateState(context, {
            currentAudio: audio,
            soundObj: status,
            isPlaying: true,
            currentAudioIndex: index,
            playbackPosition: null,
            playbackDuration: null,
        });
        storeAudioForNextOpening(audio, index);

    } catch (error) {
        console.log("error inside changeAudio() method.", error.message);
    }

}


export const moveAudio = async (context, value) => {
    const { soundObj, isPlaying, playbackObj, updateState } = context;
    if (soundObj === null || !isPlaying) { return; }
    try {
        const status = await playbackObj.setPositionAsync(
            soundObj.durationMillis * value
        );
        updateState(context, { soundObj: status, playbackPosition: status.positionMillis });
        await resume(playbackObj);

    } catch (error) {
        console.log("error inside onSlidingComplete callback : ", error);
    }
}
