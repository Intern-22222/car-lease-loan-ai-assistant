import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { useState,useEffect } from "react";
export default function App() {
  
  const [message, setMessage] = useState("State is now active");
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("State changed → App re-rendered");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Step 3: App.js is under control</Text>
      <Text>{message}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
