import React, {useState, useCallback, useEffect} from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Voice from 'react-native-voice';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';

// componets import
import Loading from '../loading';

// ultilities import
import globalStyle from '../../utilities/globalStyle';

// voice popup component
const VoicePannel = ({enable, onFinish, onDissmiss}) => {
  // state
  const [voiceSearchResults, setVoiceSearchResults] = useState([]);
  const [voiceSearch, setVoiceSearch] = useState(false);

  // handle function
  const handleVoiceStart = useCallback(async () => {
    if (!voiceSearch) {
      // start recording if voiceSearch true
      try {
        setVoiceSearchResults([]);
        Voice.start('vi-Vi');
      } catch (error) {
        console.log(error);
      }
    } else Voice.stop(); // stop if voiceSearch false
    setVoiceSearch(!voiceSearch);
  }, [Voice, voiceSearch]);

  const handleChooseSuggetion = item => {
    if (item.selectable) {
      // if item can select
      onFinish(item.value);
    }
  };

  const handleDissmissVoice = useCallback(() => {
    Voice.stop();
    setVoiceSearch(false);
    onDissmiss();
  }, []);

  // event handler for voice
  const onSpeechEnd = useCallback(e => {
    setVoiceSearch(false);
  }, []);

  const onSpeechError = useCallback(e => {
    const {
      error: {message},
    } = e; // object destructoring
    console.log(message);
    if (message.indexOf('7/') >= 0 || message.indexOf('5/') >= 0)
      // error code 5, 7 return message
      setVoiceSearchResults([{value: 'No match', selectable: false}]);
    // console.log('error', e);
  }, []);

  const onSpeechResults = useCallback(e => {
    const res = e.value.map(item => ({value: item, selectable: true}));
    setVoiceSearchResults(res);
  }, []);

  // Flat list props
  const keyExtractor = useCallback((_, index) => `suggetion_${index}`, []);

  const renderSuggestion = useCallback(
    ({item, index}) => (
      <Pressable
        style={[styles.voice_suggestion, {marginLeft: index === 0 ? 0 : 10}]}
        onPress={() => handleChooseSuggetion(item)}>
        {({pressed}) => (
          <Text
            style={[
              {
                color: pressed ? '#4aa2e0' : '#8cc5ed',
              },
              styles.voice_suggestion_text,
              globalStyle.text_md,
            ]}>
            {item.value}
          </Text>
        )}
      </Pressable>
    ),
    [],
  );

  // effect
  useEffect(() => {
    // Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechError = onSpeechError;
    Voice.onSpeechResults = onSpeechResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    // start voice record on start up
    if (enable) {
      handleVoiceStart();
    }
  }, [enable]);

  // render
  return (
    <Modal visible={enable} transparent>
      <TouchableWithoutFeedback onPress={handleDissmissVoice}>
        <View style={{flex: 1, backgroundColor: '#4a4a4a30'}}></View>
      </TouchableWithoutFeedback>
      <View style={[styles.voice_search_dialog, globalStyle.shadow_lg]}>
        <View style={styles.voice_suggestion_ctn}>
          {voiceSearch ? (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Loading />
            </View>
          ) : null}
          {voiceSearchResults.length ? (
            <FlatList
              data={voiceSearchResults}
              keyExtractor={keyExtractor}
              horizontal
              renderItem={renderSuggestion}
            />
          ) : null}
        </View>
        <View style={styles.voice_convert_ctn}>
          <Pressable
            style={[
              styles.voice_convert_btn,
              {
                backgroundColor: voiceSearch ? '#bfbfbf50' : '#bfbfbf30',
              },
            ]}
            onPress={handleVoiceStart}>
            <FontAwesome
              name={'microphone'}
              style={[
                {
                  color: voiceSearch ? '#4aa2e0' : '#8cc5ed',
                },
                globalStyle.text_3xl,
              ]}
            />
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default VoicePannel;

const styles = StyleSheet.create({
  voice_search_dialog: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    width: '80%',
    height: '36%',
    backgroundColor: '#fafafa',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  voice_suggestion_ctn: {
    width: '100%',
    minHeight: 30,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 5,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    borderBottomWidth: 3,
    borderColor: '#4a4a4a30',
  },
  voice_suggestion: {
    backgroundColor: '#9f9f9f12',
  },
  voice_suggestion_text: {
    marginVertical: 3,
    marginHorizontal: 6,
    borderRadius: 5,
  },
  voice_convert_ctn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  voice_convert_btn: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },
});
