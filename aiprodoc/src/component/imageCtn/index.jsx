import React, {useCallback, useState} from 'react';
import {StyleSheet, View, Image} from 'react-native';

// main component
const ImageCtn = ({
  style,
  source,
  aspectRatio,
  onLoad,
  onLayout,
  onLoadStart,
  onLoadEnd,
}) => {
  // state
  const [ctnWidth, setCtnWidth] = useState(0);
  const [imgDisplayHeight, setImgDisplayHeight] = useState(500);
  const [loadingDone, setLoadingDone] = useState(false);

  // utility functions
  const getCtnWidth = useCallback(e => {
    setCtnWidth(e.nativeEvent.layout.width);
  }, []); // get window width

  const calImgDisplayHeight = useCallback(
    ({
      nativeEvent: {
        source: {width, height},
      },
    }) => {
      //  modify as user declare aspect ratio
      if (aspectRatio) {
        const displayHeight = ctnWidth / aspectRatio;
        setImgDisplayHeight(displayHeight);
        setLoadingDone(true);
        return;
      }
      // retaining aspect ratio
      const defaultRatio = ctnWidth / width; // calculate root aspect ratio of image
      const displayHeight = height * defaultRatio; // calculate display height of image
      setImgDisplayHeight(Math.round(displayHeight));
      setLoadingDone(true);
    },
    [ctnWidth],
  );

  // handle functions
  const handleOnLayout = useCallback(
    // handle native event of image tag
    e => {
      if (onLayout) onLayout({e, loadingDone});
    },
    [onLayout],
  );
  const handleOnLoadStart = useCallback(
    // handle native event of image tag
    e => {
      if (onLoadStart) onLoadStart(e);
    },
    [onLoadStart],
  );
  const handleOnLoad = useCallback(
    // handle native event of image tag
    e => {
      if (!loadingDone && ctnWidth) calImgDisplayHeight(e);
      if (onLoad) onLoad(e);
    },
    [onLoad, loadingDone, ctnWidth],
  );
  const handleOnLoadEnd = useCallback(
    // handle native event of image tag
    e => {
      if (onLoadEnd) onLoadEnd(e);
    },
    [onLoadEnd],
  );

  // render
  return (
    <View style={[style, styles.image_ctn]} onLayout={getCtnWidth}>
      {imgDisplayHeight ? (
        <Image
          style={[styles.image, {height: imgDisplayHeight}]}
          source={source}
          resizeMode="cover"
          onLayout={handleOnLayout}
          onLoadStart={handleOnLoadStart}
          onLoad={handleOnLoad}
          onLoadEnd={handleOnLoadEnd}
        />
      ) : null}
    </View>
  );
};

export default ImageCtn;

const styles = StyleSheet.create({
  image_ctn: {},
  image: {width: '100%'},
});
