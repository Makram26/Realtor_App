import React, { memo } from 'react';
import {StyleSheet, View} from 'react-native';

const RailSelected = () => {
  return (
    <View style={styles.root}/>
  );
};

export default RailSelected;

const styles = StyleSheet.create({
  root: {
    height: 4,
    backgroundColor: '#6246EA',
    borderRadius: 2,
  },
});
