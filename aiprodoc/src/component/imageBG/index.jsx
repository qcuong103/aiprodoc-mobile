import React from 'react';
import {StyleSheet, ImageBackground} from 'react-native';

const ImageBG = props => {
  const {style, source, children} = props;
  return (
    <ImageBackground style={[style]} source={source}>
      {children}
    </ImageBackground>
  );
};

export default ImageBG;

const styles = StyleSheet.create({});
