import React, {useCallback, useState} from 'react';
import {BackHandler, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

// componets import
import ListDocument from '../../component/listDocument';

// utilites import
import axios from 'axios';
import axios_auth from '../../request/authRequest';
import globalStyle from '../../utilities/globalStyle';

// main component
const DocumentAll = props => {
  // screen data
  const url = '/documents';

  // abort token
  let abortGetFirstList;
  let abortHandleLoadMore;
  let abortHandleRefresh;

  // state
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [listDocument, setListDocument] = useState({
    list: [],
    currentPage: 0,
    total: 0,
  });

  // handle methods
  const getFirstList = useCallback(async () => {
    try {
      setLoading(true);

      // abort prev request
      if (typeof abortGetFirstList != typeof undefined) {
        abortGetFirstList.cancel('User refresh first loading');
      }
      // assign current cancel token
      abortGetFirstList = axios.CancelToken.source();

      // fetch data
      const res = await axios_auth.get({
        url,
        userConfig: {
          cancelToken: abortGetFirstList.token,
        },
      });

      if (res)
        setListDocument({
          list: res.data.results,
          currentPage: 1,
          total: res.data.count,
        });
      setLoading(false);
    } catch (error) {
      // on abort
      if (axios.isCancel(error)) {
        return;
      }
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
      }

      // other errors
      console.log(error);
    }
  }, [loading, abortGetFirstList]);

  const handleRefreshList = useCallback(async () => {
    try {
      setRefresh(true);

      // abort prev request
      if (typeof abortHandleRefresh != typeof undefined) {
        abortHandleRefresh.cancel('User refresh refresh request');
      }
      // assign current cancel token
      abortHandleRefresh = axios.CancelToken.source();

      // fetch data
      const res = await axios_auth.get({
        url,
        userConfig: {
          cancelToken: abortHandleRefresh.token,
        },
      });
      if (res)
        setListDocument({
          list: res.data.results,
          currentPage: 1,
          total: res.data.count,
        });
      setRefresh(false);
    } catch (error) {
      // on abort
      if (axios.isCancel(error)) {
        return;
      }

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
      }

      // other errors
      console.log(error);
    }
  }, [refresh, abortHandleRefresh]);

  const handleLoadMore = useCallback(async () => {
    // precondition
    if (listDocument.list.length === listDocument.total) return;

    // execute
    try {
      setLoading(true);

      // abort prev request
      if (typeof abortHandleLoadMore != typeof undefined) {
        abortHandleLoadMore.cancel('User refresh load more request');
      }
      // assign current cancel token
      abortHandleLoadMore = axios.CancelToken.source();

      const {list, currentPage} = listDocument;

      // fetch data
      const res = await axios_auth.get({
        url,
        userConfig: {
          params: {page: currentPage + 1},
          cancelToken: abortHandleLoadMore.token,
        },
      });
      // set data
      setListDocument({
        list: [...list, ...res.data.results],
        currentPage: currentPage + 1,
        total: res.data.count,
      });
      setLoading(false);
    } catch (error) {
      // on abort
      if (axios.isCancel(error)) {
        return;
      }

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
      }

      // other errors
      console.log(error);
    }
  }, [loading, listDocument, abortHandleLoadMore]);

  // effect
  useFocusEffect(
    useCallback(() => {
      if (listDocument.list.length === 0) {
        getFirstList();
      }
    }, [listDocument.list]),
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (typeof abortGetFirstList != typeof undefined) {
          abortGetFirstList.cancel('User abort fetch first list request');
        }
        if (typeof abortHandleRefresh != typeof undefined) {
          abortHandleRefresh.cancel('User abort refreshing data request');
        }
        if (typeof abortHandleLoadMore != typeof undefined) {
          abortHandleLoadMore.cancel('User abort fetch more data request');
        }
        return false;
      };
      BackHandler.addEventListener('handwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [abortGetFirstList, abortHandleRefresh, abortHandleLoadMore]),
  );

  // render
  return (
    <View style={styles.body}>
      <Text
        style={[
          styles.title,
          globalStyle.main_text,
          globalStyle.text_lg,
          globalStyle.shadow_lg,
        ]}>
        All Documents
      </Text>
      <ListDocument
        data={listDocument.list}
        total={listDocument.total}
        enableRefresh
        onRefresh={handleRefreshList}
        onEndReached={handleLoadMore}
        refresh={refresh}
        loading={loading}
      />
    </View>
  );
};

export default DocumentAll;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 5,
    paddingBottom: 50,
  },
  title: {
    width: '100%',
    marginLeft: -10,
    marginBottom: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#99ffb4',
    color: '#fff',
  },
});
