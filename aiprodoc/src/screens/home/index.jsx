import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import globalStyle from '../../utilities/globalStyle';

const Home = props => {
  const user = useSelector(state => state.user);

  return (
    <View style={styles.body}>
      <Text style={[globalStyle.main_text, styles.title]}>
        Welcome {user.data.username} to AIProDoc
      </Text>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  body: {flex: 1, padding: 10, alignItems: 'center'},
  title: {
    fontSize: 30,
  },
});
