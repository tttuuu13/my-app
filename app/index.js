import React, {Component} from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { flingGestureHandler, Directions } from "react-native-gesture-handler"
class Card extends Component {
  frontText;
  backText;
  constructor

  render() {
    return (
    <flingGestureHandler direction = {Directions.UP}>
      <View>
        <Animated.View>

        </Animated.View>
      </View>
    </flingGestureHandler>
    );
  }
}

const cardStyles = StyleSheet.create({
  card: {

  },
});

export default function App() {
  return (
    <Card front="Hello" back="Привет"></Card>
  )
}