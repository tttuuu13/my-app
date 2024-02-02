import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
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
import Word from './components/word.js';
import { SafeAreaView } from 'react-native-safe-area-context';

function Card({word, translation}) {
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

  const fling = Gesture.Fling()
    .direction()
  
  const move = useAnimatedStyle(() => ({transform: [{translateX: offsetX.value }, {translateY: offsetY.value}, {scale: scale.value}]}))  

  return (
    <View style={{flex:1}}>
        <GestureDetector gesture={pan}>
          <Animated.View style={[move]}>
          <View style={[styles.card]}>
            <Animated.View style={[styles.cardFront, flipFront]}>
              <Text style={[styles.text, {fontSize: 90}]}>{word}</Text>
            </Animated.View>
            <Animated.View style={[styles.cardBack, flipBack]}>
              <Text style={[styles.text, {fontSize: 70}]}>{translation}</Text>
            </Animated.View>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  )
}


export default function App() {
  const words = [
    new Word("Hello", "Привет", 1),
    new Word("Hand", "Рука", 2),
    new Word("Tree", "Дерево", 3),
    new Word("School", "Школа", 4),
    new Word("Apple", "Яблоко", 5),
  ];

  const [index, indexChange] = useState(0);

  
  return (
    <GestureHandlerRootView>
      <SafeAreaView style={{}}>
        <View style={[styles.deck]}>
          {words.slice(index, index+2).map((word) => {
            return(
              <Card word={word.word} translation={word.translation} key={word.id}/>
            )
          })}
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  deck: {
    top: '50%',
  },
  text: {
  },
  card: {
    width: '80%',
    aspectRatio: 1,
    position: "absolute",
    left: '10%',
    shadowOpacity: 0.1,
    shadowRadius: 30,
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
