import FontAwesome from "@expo/vector-icons/FontAwesome";import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
export const unstable_settings = {
  initialRouteName: "/(tabs)/index",
};
SplashScreen.preventAutoHideAsync();
export default function RootLayout() {
  const [loaded, error] = useFonts({ ...FontAwesome.font });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen name="(MenuInferior)" options={{headerShown:false}} />
        </Stack>
        <StatusBar style="auto" animated />
      </SafeAreaProvider>
    </>
  );
}
