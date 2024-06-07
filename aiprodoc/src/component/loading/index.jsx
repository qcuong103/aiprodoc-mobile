import React from 'react';
import {Image, StyleSheet, View} from 'react-native';

// assets import
import loadingGif from '../../assets/image/loading.gif';

// get image uri
const loadingUri = Image.resolveAssetSource(loadingGif).uri;

// main component
const Loading = ({style}) => {
  return (
    <View style={[styles.contain, style]}>
      <Image style={styles.gif} source={{uri: loadingUri}} />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  contain: {
    width: 60,
    height: 25,
  },
  gif: {
    width: '100%',
    height: '100%',
  },
});
