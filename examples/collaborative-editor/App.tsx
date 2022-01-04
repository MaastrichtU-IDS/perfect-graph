import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { MyGraphEditor } from './components/GraphEditor'
import {  useLayout } from 'colay-ui'

export default function App() {
  const {
    width,
    height,
    onLayout,
  } = useLayout()
  return (
    <View
      style={styles.container}
      onLayout={onLayout}
    >
      <MyGraphEditor
        {...{
          width,
          height,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
