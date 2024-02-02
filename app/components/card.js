import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View, Text, useWindowDimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  withDecay,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

export default function Card({word, translation}) {
  const pressed = useSharedValue(false);
  const flipped = useSharedValue(false);
  const scale = useSharedValue(1);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const color = useSharedValue();

  const flipFront = useAnimatedStyle(() => ({
    transform: [{perspective: 1000}, { rotateY: withTiming(flipped.value ? '180deg' : '0deg', {duration: 500}) }],
  }));

  const flipBack = useAnimatedStyle(() => ({
    transform: [{perspective: 1000}, { rotateY: withTiming(flipped.value ? '360deg' : '180deg', {duration: 500}) }],
  }));

  const moved = useSharedValue(false);
  const tap = Gesture.Tap()
    .onTouchesDown(() => {
      pressed.value = !pressed.value;
      flipped.value = !flipped.value;
    });
  
  const pan = Gesture.Pan()
    .onTouchesMove(() => {
      moved.value = true;
      scale.value = withTiming(1.1);
    })
    .onChange((event) => {
      offsetX.value = event.translationX;
      offsetY.value = event.translationY;
    })
    .onTouchesUp(() => {
      if (!moved.value)
      {
        pressed.value = !pressed.value;
        flipped.value = !flipped.value;
      }
    })
    .onFinalize(() => {
      if (offsetX.value < 50)
      {
        offsetX.value = withSpring(0);
        offsetY.value = withSpring(0);
      }
      else
      {
        offsetX.value = withSpring(1000);
        offsetY.value = withSpring(0);
      }
      moved.value = false;
      scale.value = withTiming(1);
    })
  
  const move = useAnimatedStyle(() => ({transform: [{translateX: offsetX.value }, {translateY: offsetY.value}, {scale: scale.value}]}))  

  return (
    <View style={{flex:1}}>
      <GestureDetector gesture={tap}>
          <View style={[styles.card]}>
            <Animated.View style={[styles.cardFront, flipFront]}>
              <Text style={[styles.text, {fontSize: 90}]}>{word}</Text>
            </Animated.View>
            <Animated.View style={[styles.cardBack, flipBack]}>
              <Text style={[styles.text, {fontSize: 70}]}>{translation}</Text>
            </Animated.View>
          </View>
      </GestureDetector>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
  },
  card: {
    width: '80%',
    aspectRatio: 1,
    position: "absolute",
    left: '10%',
  },
  cardBack: {

    width: '100%',
    height: '100%',
    backgroundColor: "white",
    borderRadius: 50,
    perspective: 500,
    rotateY: '180deg',
    position: "absolute",
    backfaceVisibility: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  cardFront: {
    width: '100%',
    height: '100%',
    backgroundColor: "white",
    borderRadius: 50,
    perspective: 500,
    backfaceVisibility: "hidden",
    alignItems: "center",
    justifyContent: "center",
  }
});