import { View } from 'react-native';
import React from 'react';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { GestureHandlerRootViewProps } from 'react-native-gesture-handler/lib/typescript/components/GestureHandlerRootView';

type DoublePressableProps = {
  onDoublePress?: () => void;
  disabled?: boolean; // Add disabled flag
} & GestureHandlerRootViewProps;

const DoublePressable = ({ onDoublePress, disabled, children, ...rest }: DoublePressableProps) => {
  const singleTap = Gesture.Tap().onEnd(() => {});

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .enabled(!disabled) // FIX: Blocks interaction during animation frames
    .onEnd(() => {
      if (onDoublePress) {
        runOnJS(onDoublePress)();
      }
    });

  const exclusiveGestures = Gesture.Exclusive(doubleTap, singleTap);

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={exclusiveGestures}>
        <View {...rest}>
          {children}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

export default DoublePressable;