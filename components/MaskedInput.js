import React, { useRef, useState, useEffect } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Input } from 'react-native-elements'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function MaskedInput(
    {
        onChangeText = (text = '') => { },
        mask = '9-9-9-9',
        contentContainerStyle = StyleSheet.create({}),
        containerStyle = StyleSheet.create({}),
        inputContainerStyle = StyleSheet.create({}),
        activeInputStyle = StyleSheet.create({}),
        inputStyle = StyleSheet.create({}),
        activeTextStyle = StyleSheet.create({}),
        textStyle = StyleSheet.create({}),
        seperatorTextStyle = StyleSheet.create({})
    }) {

    const inputRef = useRef([])
    const [focus, setFocus] = useState(0)
    const [mobileNumber, setMobileNumber] = useState([])
    const [counter, setCounter] = useState(0)
    const seperators = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/

    const focusNext = (focus) => {
        if (inputRef.current[focus + 1]) {
            inputRef.current[focus + 1].focus()
        }
        else {
            focusNext(focus + 1)
        }
    }

    const focusPrev = (focus) => {
        if (inputRef.current[focus - 1]) {
            inputRef.current[focus - 1].focus()
        }
        else {
            focusPrev(focus - 1)
        }
    }

    const clearPrev = (focus) => {
        if (inputRef.current[focus - 1]) {
            inputRef.current[focus - 1].clear()
        }
        else {
            clearPrev(focus - 1)
        }
    }

    const changeText = (text) => {
        if (isNaN(text)) {
            inputRef.current[focus].setNativeProps({ text: "" })
        }
        else {
            let mobileNum = mobileNumber
            mobileNum[focus] = text
            Promise.resolve()
                .then(() => { setMobileNumber(mobileNum) })
                .then(() => {
                    if (focus < mask.length - 1)
                        focusNext(focus)
                    setCounter(counter + 1)
                })
        }
    }

    const backspacePress = (key) => {
        if (focus != 0) {
            if (key == 'Backspace') {
                let mobileNum = mobileNumber
                mobileNum[focus] = ''
                mobileNum[focus - 1] = ''
                setMobileNumber(mobileNum)
                focusPrev(focus)
                clearPrev(focus)
                setCounter(counter - 1)
            }
        }
    }

    useEffect(() => {
        let mobNum = mobileNumber.join('')
        if (onChangeText)
            onChangeText(mobNum)
    }, [counter])

    return (
        <View style={[{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }, contentContainerStyle]}>
            {[...Array(mask.length)].map((value, idx) => (
                <View
                    style={styles.main}
                    key={idx + ''}
                >
                    {seperators.test(mask[idx]) ?
                        <Text style={[styles.highlightedText, { top: -hp(.5) }, seperatorTextStyle]}>
                            {mask[idx]}
                        </Text>
                        :
                        <Input
                            ref={(ref) => inputRef.current[idx] = ref}
                            onChangeText={(text) => changeText(text)}
                            onKeyPress={({ nativeEvent }) => backspacePress(nativeEvent.key)}
                            returnKeyType='next'
                            keyboardType='phone-pad'
                            maxLength={1}
                            containerStyle={{ ...styles.container, ...containerStyle }}
                            inputContainerStyle={[
                                styles.textInputContainer,
                                inputContainerStyle
                                , focus == idx ? activeInputStyle : {}]}
                            inputStyle={[styles.textInput,
                                inputStyle]}
                            style={[styles.text,
                                textStyle
                                , focus == idx ? activeTextStyle : {}]}
                            blurOnSubmit={false}
                            onFocus={() => {
                                setFocus(idx)
                            }}
                        />
                    }
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    container: {
        width: wp(5),
        marginRight: wp(0.5),
        alignItems: 'center'
    },
    textInputContainer: {
        width: wp(5),
        borderBottomWidth: 2
    },
    textInput: {
        width: wp(5),
        textAlign: 'center'
    },
    text: {
        fontSize: wp(5)
    },
    highlightedText: {
        height: hp(5),
        fontSize: wp(5),
        color: '#B3B3B3',
    }
})