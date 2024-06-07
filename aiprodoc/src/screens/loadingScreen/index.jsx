import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import Loading from '../../component/loading';

// fullscreen loading
const LoadingScreen = memo(() => {
  return (
    <View style={styles.body}>
      <Loading style={{width: 150, height: 60}} />
    </View>
  );
});

export default LoadingScreen;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
