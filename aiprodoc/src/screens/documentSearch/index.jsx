import React, {useCallback, useState, useLayoutEffect} from 'react';
import {BackHandler, StyleSheet, ToastAndroid, View} from 'react-native';

// componets import
import ListDocument from '../../component/listDocument';
import SearchField from '../../component/searchField';
import Loading from '../../component/loading';

// utilites import
import axios from 'axios';
import globalStyle from '../../utilities/globalStyle';
import axios_auth from '../../request/authRequest';

// main component
const DocumentSearch = () => {
  // screen data
  const url = '/search/documents.Document';

  // abort token
  let abortPrevSearch;
  let abortHandleLoadMore;

  // state
  const [keyword, setKeyword] = useState('');
  const [searching, setSearching] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [listDocument, setListDocument] = useState({
    list: [],
    currentPage: 0,
    total: 0,
  });

  // handle methods
  const handleSearch = useCallback(
    async value => {
      try {
        // abort prev request
        if (typeof abortPrevSearch != typeof undefined) {
          abortPrevSearch.cancel('User start new search sequence');
        }
        // assign current cancel token
        abortPrevSearch = axios.CancelToken.source();
        if (!refresh) {
          setSearching(true);
          setKeyword(value);
        }
        // fetch data
        const res = await axios_auth.get({
          url,
          userConfig: {
            params: {q: value},
            cancelToken: abortPrevSearch.token,
          },
        });
        setListDocument({
          list: res.data.results,
          currentPage: 1,
          total: res.data.count,
        });
        if (refresh) {
          setRefresh(false);
          return;
        }
        setSearching(false);
      } catch (error) {
        // on abort
        if (axios.isCancel(error)) {
          return;
        }

        // on response errors
        if (error.ressponse) {
          if (refresh) {
            setRefresh(false);
            return;
          }
          setSearching(false);
          return;
        }

        // on request errors
        if (error.request) {
          if (error.request.responseText.match('Failed to connect'))
            ToastAndroid.show(
              "Can't connect to server, server are on maintain or you are offline",
              ToastAndroid.SHORT,
            );
          if (refresh) {
            setRefresh(false);
            return;
          }
          setSearching(false);
          return;
        }

        // orther errors
        console.log(error);
      }
    },
    [refresh, keyword, abortPrevSearch],
  );

  const handleRefresh = useCallback(() => setRefresh(true), []);

  const handleLoadMore = useCallback(async () => {
    // precondition
    if (searching) return;
    if (refresh) return;

    const {list, currentPage, total} = listDocument;
    if (list.length === total) return;

    // execute
    try {
      setLoadingMore(true);
      if (typeof abortHandleLoadMore != typeof undefined) {
        abortHandleLoadMore.cancel('User abort previous load more request');
      }
      abortHandleLoadMore = axios.CancelToken.source();
      // fetch data
      const res = await axios_auth.get({
        url,
        userConfig: {
          params: {q: keyword, page: currentPage + 1},
          cancelToken: abortHandleLoadMore.token,
        },
      });
      setListDocument({
        list: [...list, ...res.data.results],
        currentPage: currentPage + 1,
        total: res.data.count,
      });
      setLoadingMore(false);
    } catch (error) {
      // on abort
      if (axios.isCancel(error)) {
        return;
      }

      // on response errors
      if (error.ressponse) {
        console.log(error.ressponse);
        setLoadingMore(false);
        return;
      }

      // on request errors
      if (error.request) {
        if (error.request.responseText.match('Failed to connect'))
          ToastAndroid.show(
            "Can't connect to server, server are on maintain or you are offline",
            ToastAndroid.SHORT,
          );
        setLoadingMore(false);
        return;
      }

      // orther errors
      console.log(error);
    }
  }, [searching, refresh, loadingMore, listDocument, abortHandleLoadMore]);

  // effect
  useLayoutEffect(
    useCallback(() => {
      if (refresh) handleSearch(keyword);
    }, [refresh]),
  );

  useLayoutEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (typeof abortHandleLoadMore != typeof undefined)
          abortHandleLoadMore.cancel('User abort fetch load more data request');
        if (typeof abortPrevSearch != typeof undefined)
          abortPrevSearch.cancel('User abort search request');
        return false;
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [abortPrevSearch, abortHandleLoadMore]),
  );

  // render
  return (
    <View style={styles.body}>
      <View style={styles.search_field}>
        <SearchField
          style={[globalStyle.shadow_md, {backgroundColor: '#faf8f8'}]}
          onSearch={handleSearch}
          top={20}
        />
      </View>
      <View style={styles.loading}>
        {searching ? <Loading style={{width: 80}} /> : null}
      </View>
      {keyword.length ? (
        <ListDocument
          data={listDocument.list}
          total={listDocument.total}
          enableRefresh
          refresh={refresh}
          onRefresh={handleRefresh}
          onEndReached={handleLoadMore}
          loading={loadingMore}
        />
      ) : null}
    </View>
  );
};

export default DocumentSearch;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    padding: 5,
    paddingBottom: 50,
  },
  search_field: {marginTop: 15, marginBottom: 20, paddingHorizontal: 5},
  loading: {
    width: '100%',
    alignItems: 'center',
  },
});
