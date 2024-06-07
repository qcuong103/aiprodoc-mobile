import React, {useCallback, useEffect, useState, memo} from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

// utilities import
import globalStyle from '../../utilities/globalStyle';
import axios_auth from '../../request/authRequest';
import useTrymUrl from '../../hooks/useTrimUrl';

// Common function
const convertToMB = value => Math.round((value / 1024 / 1024) * 100) / 100;

// static detail fields
const staticDetail = {
  top: [
    {
      id: 'head_1',
      header: {
        title: 'Date created',
        value: ` ${moment(document.date_added).format('hh:mm')} on ${moment(
          document.date_added,
        ).format('DD/MM/YYYY')}`,
      },
    },
    {
      id: 'head_2',
      header: {
        title: 'Document',
        value: ` ${document.label}`,
      },
      body: [
        {
          id: 'Document_1',
          title: 'Type',
          value: document.document_type.label,
        },
        {
          id: 'Document_2',
          title: 'Lang',
          value: document.language,
        },
      ],
    },
  ],
  bottom: [
    {
      id: 'bottom_1',
      header: {
        title: 'Lastest version',
        value: '',
      },
      body: [
        {
          id: 'Latest_version_1',
          title: 'Date created',
          value: ` ${moment(document.latest_version.timestamp).format(
            'hh:mm',
          )} on ${moment(document.latest_version.timestamp).format(
            'DD/MM/YYYY',
          )}`,
        },
        {
          id: 'Latest_version_2',
          title: 'File type',
          value: document.latest_version.mimetype,
        },
        {
          id: 'Latest_version_3',
          title: 'Size',
          value: ` ${convertToMB(parseInt(document.latest_version.size))} MB`,
        },
      ],
    },
  ],
};

// Child component
const GroupDetail = memo(({data}) => {
  return (
    <View style={styles.group_detail}>
      {/* section header */}
      <View style={styles.group_detail_header}>
        <Text style={[styles.group_detail_header_text, globalStyle.text_md]}>
          {data.header.title}:
          <Text
            style={[
              styles.group_detail_header_dynamic_text,
              globalStyle.content_text,
            ]}>
            {`  ${data.header.value}`}
          </Text>
        </Text>
      </View>

      {/* section sub content */}
      <View style={styles.group_detail_sub}>
        {/* section sub content single line */}
        {data.body
          ? data.body.map(item => (
              <View key={item.id} style={styles.group_detail_sub_line}>
                <Text
                  style={[
                    styles.group_detail_sub_line_text,
                    globalStyle.content_text,
                    globalStyle.text_sm,
                  ]}>
                  {item.title}: {item.value}
                </Text>
              </View>
            ))
          : null}
      </View>
    </View>
  );
});

// Screen header
const Header = ({scene, navigation}) => {
  // data passing
  const document = scene.route.params.document;

  // state
  const [loading, setLoading] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [metadata, setMetadata] = useState({
    total: 0,
    next: '',
    listMetaData: [],
  });

  // utility function
  const isScrollToBottom = useCallback(
    ({layoutMeasurement, contentOffset, contentSize}) => {
      const ReachedThreshold = 0; // begin detech load more range
      return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - ReachedThreshold
      );
    },
    [],
  );

  const dataSanitizing = useCallback(data =>
    data.map(item => ({
      id: `Metadata_${item.id}`,
      title: item.metadata_type.label,
      value: item.value,
    })),
  );

  const onEndReached = ({nativeEvent}) => {
    if (isScrollToBottom(nativeEvent)) {
      handleGetMoreMetadata();
    }
  };

  const onScroll = useCallback(
    e => {
      // enable calculate when end reached
      if (
        metadata.next &&
        metadata.listMetaData.length === metadata.total &&
        !loading
      ) {
        onEndReached(e);
      }
    },
    [metadata, loading],
  );

  // handle functions
  const handleBack = useCallback(() => navigation.goBack(), [navigation]);
  const handleShowInfo = useCallback(() => setShowInfo(true), []);
  const handleDissmissInfo = useCallback(() => setShowInfo(false), []);

  const handleGetMetadata = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios_auth.get({
        url: `/documents/${document.id}/metadata`,
      });
      const listData = dataSanitizing(res.data.results);
      setMetadata({
        total: res.data.count,
        next: useTrymUrl(res.data.next),
        listMetaData: listData,
      });
      setLoading(false);
    } catch (error) {
      // on response errors
      if (error.ressponse) {
        console.log(error.ressponse);
        setLoading(false);
        return;
      }

      // on request errors
      if (error.request) {
        if (error.request.responseText.match('Failed to connect'))
          ToastAndroid.show(
            "Can't connect to server, server are on maintain or you are offline",
            ToastAndroid.SHORT,
          );
        setLoading(false);
        return;
      }

      // other errors
      console.log(error);
      setLoading(false);
      return;
    }
  }, [document]);

  const handleGetMoreMetadata = async () => {
    try {
      setLoading(true);
      const res = await axios_auth.get({url: metadata.next});
      const listData = dataSanitizing(res.data.results);
      setMetadata({
        next: useTrymUrl(res.data.next),
        listMetaData: [...metadata.listMetaData, ...listData],
      });
      setLoading(false);
    } catch (error) {
      // on response errors
      if (error.ressponse) {
        console.log(error.ressponse);
        setLoading(false);
        return;
      }

      // on request errors
      if (error.request) {
        if (error.request.responseText.match('Failed to connect'))
          ToastAndroid.show(
            "Can't connect to server, server are on maintain or you are offline",
            ToastAndroid.SHORT,
          );
        setLoading(false);
        return;
      }

      // other errors
      console.log(error);
      setLoading(false);
      return;
    }
  };

  // effect
  useEffect(() => {
    handleGetMetadata();
  }, []);

  // render
  return (
    <>
      {/* Header */}
      <View
        onLayout={event => {
          const {height} = event.nativeEvent.layout;
          setHeaderHeight(height);
        }}
        style={[
          globalStyle.shadow_sm,
          styles.header,
          globalStyle.text_lg,
          {borderBottomRightRadius: showInfo ? 0 : 20},
        ]}>
        <TouchableOpacity
          style={styles.header_backBtn}
          onPress={handleBack}
          hitSlop={{top: 5, right: 10, bottom: 3, left: 10}}>
          <Ionicons name="chevron-back-outline" size={25} color={'#0ffc2b'} />
        </TouchableOpacity>
        <Text
          style={[styles.header_text, globalStyle.main_text]}
          numberOfLines={2}>
          Inspecting: {document.label}
        </Text>
        <TouchableOpacity
          style={styles.header_infoBtn}
          onPress={handleShowInfo}
          hitSlop={{top: 5, right: 5, bottom: 5, left: 6}}>
          <Ionicons
            name="information-circle-outline"
            size={25}
            color={'#fff'}
          />
        </TouchableOpacity>
      </View>

      {/* Detail PopUp */}
      <Modal
        visible={showInfo}
        transparent
        onRequestClose={handleDissmissInfo}
        animationType={'fade'}
        hardwareAccelerated>
        <TouchableWithoutFeedback onPress={handleDissmissInfo}>
          <View style={styles.showinfo_background}></View>
        </TouchableWithoutFeedback>
        <View
          style={[
            styles.showinfo,
            globalStyle.shadow_sm,
            {marginTop: headerHeight ? headerHeight : 0},
          ]}>
          <ScrollView onScroll={onScroll} scrollEventThrottle={400}>
            <View style={styles.showinfo_title}>
              <Text
                style={[
                  styles.text_showinfo_title,
                  globalStyle.sub_text,
                  globalStyle.text_lg,
                ]}>
                Document details
              </Text>
            </View>
            {/* top content */}
            {staticDetail.top?.map(item => (
              <GroupDetail key={item.id} data={item} />
            ))}

            {/* meta data */}
            <GroupDetail
              data={{
                header: {
                  title: 'Document metadata',
                  value: '',
                },
                body: metadata.listMetaData,
              }}
            />

            {/* bottom content */}
            {staticDetail.bottom?.map(item => (
              <GroupDetail key={item.id} data={item} />
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
};
export default Header;

const styles = StyleSheet.create({
  header: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    backgroundColor: '#ffe291',
    alignItems: 'center',
  },
  header_text: {
    flex: 1,
  },
  header_backBtn: {
    marginTop: 3,
    marginRight: 10,
  },
  header_infoBtn: {
    marginTop: 3,
    marginLeft: 5,
  },
  showinfo_background: {
    flex: 1,
  },
  showinfo: {
    position: 'absolute',
    right: 0,
    width: '60%',
    height: '40%',
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fafafa',
    borderBottomLeftRadius: 15,
  },
  showinfo_title: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  showinfo_content: {
    flex: 1,
  },
  text_showinfo_title: {
    marginHorizontal: 10,
    paddingBottom: 5,
  },
  group_detail: {marginBottom: 10},
  group_detail_header: {marginBottom: 10},
  group_detail_header_text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#525252',
  },
  group_detail_header_dynamic_text: {
    fontSize: 17,
    flexShrink: 1,
    fontWeight: '600',
  },
  group_detail_sub: {marginLeft: 10},
  group_detail_sub_line: {marginBottom: 5},
  group_detail_sub_line_text: {
    color: '#ababab',
  },
});
