import React, { useState } from "react";
import { type ComponentProps } from "react";
import { StyleSheet, Text, View } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

type Props = { item: string };

export function Question( {item}: Props ) {

    const [toggleCheckBox, setToggleCheckBox] = useState(false);

    return (
        <>
        <CheckBox
            disabled={false}
            value={toggleCheckBox}
            onValueChange={(newValue) => setToggleCheckBox(newValue)}
        />
        <Text style={styles.item}>{item}</Text></>
    )
}

const styles = StyleSheet.create({
    item: {
        padding: 10,
        fontSize: 18,
        height: 44
    }
})