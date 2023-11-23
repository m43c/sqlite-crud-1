import { Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-xl">Hello World!</Text>
      <StatusBar style="light" backgroundColor="#000000" />
    </View>
  );
}
