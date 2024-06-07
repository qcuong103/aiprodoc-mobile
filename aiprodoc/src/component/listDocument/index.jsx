import React, {useCallback, useMemo} from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// utilites import
import globalStyle from '../../utilities/globalStyle';

// componets import
import Loading from '../../component/loading';

// child components
const DocumentView = React.memo(({document}) => {
  // hooks
  const navigation = useNavigation();

  // handle functions
  const handleNavigate = useCallback(() => {
    navigation.navigate('Document Detail', {document}); // navigate on section pressed
  }, [navigation]);

  // render
  return (
    <TouchableHighlight
      style={styles.document_sizing}
      activeOpacity={0.85}
      underlayColor={'#7dffa0'}
      onPress={handleNavigate}>
      <View style={[styles.document, globalStyle.shadow_sm]}>
        <Text
          style={[
            styles.document_name,
            globalStyle.sub_text,
            globalStyle.text_lg,
          ]}>
          {document.label}
        </Text>
        <Text style={[globalStyle.content_text, styles.document_type]}>
          Type: {document.document_type.label}
        </Text>
      </View>
    </TouchableHighlight>
  );
});

// main component
const ListDocument = React.memo(props => {
  const {
    data,
    enableRefresh,
    onRefresh,
    onEndReached,
    refresh,
    loading,
    total,
  } = props;

  // render methods
  const keyExtractor = useCallback(document => document.id, []);

  const renderItem = useCallback(
    ({item}) => <DocumentView document={item} />,
    [],
  );

  const renderListLoadingIcon = useCallback(
    () =>
      data.length === total ? null : (
        <Loading style={{marginTop: 2, marginBottom: 8}} />
      ),
    [loading, data, total],
  );

  const renderRefreshControl = useMemo(
    () =>
      enableRefresh ? (
        <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
      ) : null,
    [refresh, onRefresh],
  );

  // render
  return (
    <View style={styles.document_list}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        refreshControl={renderRefreshControl}
        removeClippedSubviews={true}
        maxToRenderPerBatch={15}
        onEndReached={onEndReached}
        onEndReachedThreshold={0}
        ListFooterComponent={renderListLoadingIcon}
        ListFooterComponentStyle={styles.loading}
      />
    </View>
  );
});

export default ListDocument;

const styles = StyleSheet.create({
  document_sizing: {
    marginVertical: 12,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  document_list: {
    flex: 1,
  },
  document: {
    flex: 1,
    padding: 10,
    minHeight: 70,
    borderRadius: 5,
    backgroundColor: '#f5fff0',
    justifyContent: 'center',
  },
  document_name: {
    marginBottom: 5,
    color: '#003b10',
  },
  document_type: {
    fontSize: 17,
    color: '#999999',
    marginLeft: 5,
  },
  loading: {
    width: '100%',
    alignItems: 'center',
  },
});
