import React, {useState, useRef, useCallback} from 'react';
import {Keyboard, Pressable, StyleSheet, TextInput, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import globalStyle from '../../utilities/globalStyle';
import VoicePannel from './voiceSearch';

// main component
const SearchField = ({style, onSearch}) => {
  // ref
  const inputField = useRef();

  // state
  const [toggleVoice, setToggleVoice] = useState(false);
  const [keyword, setKeyword] = useState('');

  // handle functions
  const handleTextChange = useCallback(value => setKeyword(value), []);
  const handleBlur = useCallback(() => Keyboard.dismiss(), []);

  const handleSearch = useCallback(() => {
    if (keyword.length === 0) return;
    onSearch(keyword);
    inputField.current.blur();
  }, [keyword]);

  const handleToggleVoice = useCallback(() => {
    Keyboard.dismiss();
    setToggleVoice(!toggleVoice);
  }, [toggleVoice]);

  const handleVoiceSearch = useCallback(value => {
    setKeyword(value);
    setToggleVoice(false);
    onSearch(value);
  }, []);

  const handleDissmissVoice = () => {
    setToggleVoice(false);
  };

  // render
  return (
    <View style={[styles.contain, style]}>
      <TextInput
        ref={inputField}
        style={[styles.input, globalStyle.content_text]}
        placeholder="Type something to search"
        placeholderTextColor="#878680"
        value={keyword}
        onChangeText={handleTextChange}
        onSubmitEditing={handleSearch}
        onBlur={handleBlur}
      />
      <Pressable style={styles.search_btn} onPress={handleToggleVoice}>
        {({pressed}) => (
          <FontAwesome
            name={toggleVoice ? 'microphone-slash' : 'microphone'}
            style={[
              {
                color: pressed ? '#4aa2e0' : '#8cc5ed',
              },
              styles.search_btn_icon,
            ]}
          />
        )}
      </Pressable>
      <Pressable style={styles.search_btn} onPress={handleSearch}>
        {({pressed}) => (
          <FontAwesome
            name={'search'}
            style={[
              {
                color: pressed ? '#4aa2e0' : '#8cc5ed',
              },
              styles.search_btn_icon,
            ]}
          />
        )}
      </Pressable>
      <VoicePannel
        enable={toggleVoice}
        onFinish={handleVoiceSearch}
        onDissmiss={handleDissmissVoice}
      />
    </View>
  );
};

export default SearchField;

const styles = StyleSheet.create({
  contain: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#8cc5ed',
    borderRadius: 50,
    paddingLeft: 20,
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
    color: '#000',
  },
  search_btn: {
    borderBottomRightRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: 'transparent',
    height: '100%',
  },
  search_btn_icon: {
    margin: 10,
    fontSize: 20,
  },
});
