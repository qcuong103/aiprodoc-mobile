import React, {useCallback, useMemo, useState, useLayoutEffect} from 'react';
import {
  BackHandler,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

// component import
import ImageCtn from '../../component/imageCtn';
import Loading from '../../component/loading';

// utilities import
import axios from 'axios';
import {BASE_URL} from '../../utilities/constant';
import axios_auth from '../../request/authRequest';
import globalStyle from '../../utilities/globalStyle';
import {startLoading, stopLoading} from '../../redux/slices/loading';

// global intenal function
const trymUrl = url => url.replace(BASE_URL, '');

// screen body
const DocumentDetail = props => {
  // data passing
  const {route} = props;
  const document = route.params.document;

  // abort token
  let abortGetFirstPageData;
  let abortGetNextPageData;

  // state
  const token = useSelector(state => state.user.token);
  const loading = useSelector(state => state.loading.loading);
  const [refresh, setRefresh] = useState(false);
  const [documentState, setDocumentState] = useState('');
  const [pageData, setPageData] = useState({
    next: '',
    total: 0,
    listImage: [],
    prev: '',
  });

  // other hooks
  const dispatch = useDispatch();

  const getDocumentState = async () => {
    try {
      const res = await axios_auth.get({url: `/documents/${document.id}`});
      setDocumentState(res.data.current_state);
    } catch (error) {
      // on response errors
      if (error.ressponse) {
        console.log(error.ressponse);
        return;
      }

      // on request errors
      if (error.request) {
        if (error.request.responseText.match('Failed to connect'))
          ToastAndroid.show(
            "Can't connect to server, server are on maintain or you are offline",
            ToastAndroid.SHORT,
          );
        return;
      }

      // other errors
      console.log(error);
    }
  };

  // utility function
  const getFirstPageData = async url => {
    try {
      // loading
      dispatch(startLoading());

      // abort prev request
      if (typeof abortGetFirstPageData != typeof undefined) {
        abortGetFirstPageData.cancel('User refresh sequence');
      }
      // assign current cancel token
      abortGetFirstPageData = axios.CancelToken.source();

      // fetch data
      await getDocumentState();

      const res = await axios_auth.get({
        url: trymUrl(url),
        userConfig: {
          cancelToken: abortGetFirstPageData.token,
        },
      });
      if (res)
        setPageData({
          next: res.data.next,
          total: res.data.count,
          listImage: res.data.results,
          prev: res.data.previous,
        });
      dispatch(stopLoading());
    } catch (error) {
      // on abort
      if (axios.isCancel(error)) {
        return;
      }

      // on response errors
      if (error.ressponse) {
        console.log(error.ressponse);
        dispatch(stopLoading());
        return;
      }

      // on request errors
      if (error.request) {
        if (error.request.responseText.match('Failed to connect'))
          ToastAndroid.show(
            "Can't connect to server, server are on maintain or you are offline",
            ToastAndroid.SHORT,
          );
        dispatch(stopLoading());
        return;
      }

      // other errors
      console.log(error);
      dispatch(stopLoading());
    }
  };

  const getNextPageData = async url => {
    try {
      dispatch(startLoading());
      // abort prev request
      if (typeof abortGetNextPageData != typeof undefined) {
        abortGetNextPageData.cancel('User reload more sequence');
      }
      // assign current cancel token
      abortGetNextPageData = axios.CancelToken.source();
      // fetch data
      const res = await axios_auth.get({
        url: trymUrl(url),
        userConfig: {
          cancelToken: abortGetNextPageData.token,
        },
      });
      setPageData({
        next: res.data.next,
        total: res.data.count,
        listImage: [...pageData.listImage, ...res.data.results],
        prev: res.data.previous,
      });
      dispatch(stopLoading());
    } catch (error) {
      // on abort
      if (axios.isCancel(error)) {
        console.log(error);
        return;
      }

      // on response errors
      if (error.ressponse) {
        console.log(error.ressponse);
        dispatch(stopLoading());
        return;
      }

      // on request errors
      if (error.request) {
        if (error.request.responseText.match('Failed to connect'))
          ToastAndroid.show(
            "Can't connect to server, server are on maintain or you are offline",
            ToastAndroid.SHORT,
          );
        dispatch(stopLoading());
        return;
      }

      // other errors
      console.log(error);
      dispatch(stopLoading());
    }
  };

  // handle functions
  const handleOnReFresh = useCallback(async () => {
    if (loading) return;
    setRefresh(true);
    try {
      await getFirstPageData(document.latest_version.pages_url);
      setImageLoadingCount(0);
    } catch (error) {
      console.log(error.ressponse);
    }
    setRefresh(false);
  }, [loading, document]);

  const handleOnScrollEnd = useCallback(async () => {
    if (loading) return;
    if (
      pageData.total === pageData.listImage?.length &&
      pageData.next?.length !== 0
    )
      return;
    getNextPageData(trymUrl(pageData.next));
  }, [pageData, loading]);

  // render props
  const keyExtractor = useCallback(image => image.page_number, []);

  const renderRefreshControl = useMemo(
    () => <RefreshControl refreshing={refresh} onRefresh={handleOnReFresh} />,
    [refresh, handleOnReFresh],
  );

  const renderListLoadingIcon = useCallback(
    () => (pageData.listImage?.length === pageData.total ? null : <Loading />),
    [loading, pageData],
  );

  const renderItem = useCallback(
    props => {
      const {item, index} = props;
      const source = {
        uri: item.image_url,
        headers: {
          Authorization: `Token ${token}`,
        },
      };

      return (
        <View
          style={[
            styles.page_ctn,
            {marginBottom: index + 1 === pageData.total ? 0 : 10},
          ]}>
          {documentState && index === 0 ? (
            <View style={styles.document_state}>
              <Text
                style={[
                  styles.document_state_text,
                  globalStyle.content_text,
                  globalStyle.text_sm,
                ]}>
                {documentState}
              </Text>
            </View>
          ) : null}
          <ImageCtn source={source} />
          <Text
            style={[
              styles.page_count,
              globalStyle.content_text,
              globalStyle.text_sm,
            ]}>
            Page {index + 1}
          </Text>
        </View>
      );
    },
    [pageData.total, documentState],
  );

  // effect
  useLayoutEffect(() => {
    getFirstPageData(document.latest_version.pages_url);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (typeof abortGetFirstPageData != typeof undefined) {
          abortGetFirstPageData.cancel(
            'User abort fetch first page data request',
          );
        }
        if (typeof abortGetNextPageData != typeof undefined) {
          abortGetNextPageData.cancel('User abort fetch next page data ');
        }
        return false;
      };
      BackHandler.addEventListener('handwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [abortGetNextPageData, abortGetFirstPageData]),
  );

  // render
  return (
    <View style={[globalStyle.body, styles.body]}>
      <View style={{flex: 1}}>
        <FlatList
          data={pageData.listImage}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          onEndReached={handleOnScrollEnd}
          onEndReachedThreshold={0.1}
          initialNumToRender={10}
          refreshControl={renderRefreshControl}
          removeClippedSubviews={true}
          maxToRenderPerBatch={15}
          ListFooterComponent={renderListLoadingIcon}
          ListFooterComponentStyle={styles.loading}
        />
      </View>
    </View>
  );
};

export default DocumentDetail;

const styles = StyleSheet.create({
  body: {
    position: 'relative',
  },
  loading: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  page_ctn: {
    position: 'relative',
  },
  page_count: {
    position: 'absolute',
    fontSize: 10,
    bottom: 20,
    alignSelf: 'center',
  },
  document_state: {
    position: 'absolute',
    zIndex: 10,
    top: 10,
    left: 10,
    padding: 3,
    alignSelf: 'flex-start',
    borderWidth: 2,
    borderColor: '#f5003d',
  },
  document_state_text: {fontSize: 12, color: '#f5003d'},
});
