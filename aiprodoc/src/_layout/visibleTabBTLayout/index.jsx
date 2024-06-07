import React, {useCallback, useState, useContext} from 'react';
import {StyleSheet, Text, View} from 'react-native';

// component import
import TabBottomCreate from '../../navigation/tabBottom';

// ultilities import
import visibleTabBottom from '../../navigation/route/authorized/visibleTabBottom'; // routing
import globalStyle from '../../utilities/globalStyle';

const TabBarContext = React.createContext(); // create context for manipulate tabbar

// main component
const VisibleTabBottomLayout = props => {
  //state
  const [tabBarPushUp, setTabBarPushUp] = useState(0);

  // event function
  const onTabBarPushUp = useCallback(val => {
    setTabBarPushUp(val);
  }, []);

  // context value
  const value = {
    onTabBarPushUp,
  };

  // render
  return (
    <TabBarContext.Provider value={value}>
      <View style={styles.body}>
        <TabBottomCreate
          routeList={visibleTabBottom}
          tabBarOptions={{
            activeTintColor: '#0ffc2b',
            inactiveTintColor: '#555',
            showLabel: false,
            style: [
              {
                position: 'absolute',
                left: 6,
                bottom: 8 + tabBarPushUp,
                right: 6,
                backgroundColor: '#fff',
                borderRadius: 15,
              },
              globalStyle.shadow_sm,
            ],
          }}
          sceneContainerStyle={{backgroundColor: '#fdfdfd'}}
        />
      </View>
    </TabBarContext.Provider>
  );
};

export default VisibleTabBottomLayout;

export const useTabBarPushUp = () => useContext(TabBarContext);

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
});
