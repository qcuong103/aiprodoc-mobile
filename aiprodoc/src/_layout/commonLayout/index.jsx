import React from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

// components import
import StackCreate from '../../navigation/stack';

// custom hooks import
import useAuth from '../../hooks/useAuth';

// ultilities import
import loginStack from '../../navigation/route/unauthorized/loginStack';
import hiddenStack from '../../navigation/route/authorized/hiddenStack';

const Layout = props => {
    const isAuth = useAuth();

    return (
        <>
            <StatusBar backgroundColor="#f1f1f1" barStyle="dark-content" />
            <View style={styles.body}>
                <NavigationContainer>
                {isAuth ? (
                    <StackCreate
                    routeList={hiddenStack}
                    options={{header: () => null}}
                    />
                ) : (
                    <StackCreate
                    routeList={loginStack}
                    options={{
                        header: () => null,
                    }}
                    />
                )}
                </NavigationContainer>
            </View>
        </>
    )
}

export default Layout;

const styles = StyleSheet.create({body: {flex: 1, backgroundColor: '#fff'}});
