/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
 import 'react-native-gesture-handler';
 import React from 'react';
 import {SafeAreaView, StyleSheet} from 'react-native';
 import Layout from './_layout/commonLayout';

 import {Provider} from 'react-redux';
 import {PersistGate} from 'redux-persist/integration/react';
 import store, {persistor} from './redux';
 import LoadingScreen from './screens/loadingScreen';

 const App = () => {
   return (
     <Provider store={store}>
       <PersistGate loading={<LoadingScreen />} persistor={persistor}>
         <SafeAreaView style={[styles.body]}>
           <Layout />
         </SafeAreaView>
       </PersistGate>
     </Provider>
   );
 };

 const styles = StyleSheet.create({
   body: {
     flex: 1,
   },
 });

 export default App;
