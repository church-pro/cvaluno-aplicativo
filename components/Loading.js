import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import primary from '../constants/Colors';

const Loading = ({ title, background }) => (
    <View style={[styles.container, { backgroundColor: background }]}>
        <Text style={styles.text}>{title}</Text>
        <ActivityIndicator
            size="large"
            color="#2D84C3"
        />
    </View>
);

export default Loading;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    text: {
        color: "#2D84C3",
        textAlign: 'center',
        fontSize: 22,
        marginBottom: 6
    }
})
