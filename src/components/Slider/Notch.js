import React, { memo } from 'react';
import { View, StyleSheet } from 'react-native';

const Notch = props => {
  return (
    <View style={styles.root} {...props}/>
  );
};

export default Notch;

const styles = StyleSheet.create({
  root: {
    width: 8,
    height: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#6246EA',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 8,
  },
});
