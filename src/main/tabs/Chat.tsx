import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Chat = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Chat Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  text: {
    fontSize: 18,
    color: '#303030',
  },
});

export default Chat;
