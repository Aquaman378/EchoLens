
import { createStackNavigator } from '@react-navigation/stack';
// Import your screens
import HomeScreen from '../screens/HomeScreen.js';
import LabScreen from '../screens/LabScreen.js';
import ArchiveScreen from '../screens/ArchiveScreen.js';
import BlueprintScreen from '../screens/BlueprintScreen.js'



const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false, // Custom navbars handled inside screens
        cardStyle: { backgroundColor: '#000' }, // Keeps transitions dark
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Lab" component={LabScreen} />
      <Stack.Screen name="Archive" component={ArchiveScreen} />
      <Stack.Screen name="Blueprint" component={BlueprintScreen} />
    </Stack.Navigator>
  );
}