import UserAvatar from "@/components/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { AntDesign, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import { View } from "react-native";

const Layout = () => {
  const {user} = useAuth();
  return (
    <Tabs
    screenOptions={{
        tabBarShowLabel: false,
        headerStyle: { backgroundColor: "rgb(31 41 55 / 0.5)" },
        tabBarStyle: { backgroundColor: "rgb(31 41 55 / 0.5)" }, 
    }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <AntDesign size={24} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "Courses",
          tabBarIcon: ({color}) => <FontAwesome6 name="graduation-cap" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="challenges"
        options={{
          title: "Challenges",
          tabBarIcon: ({color}) => <MaterialCommunityIcons name="sword-cross" size={24} color={color} />
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) =>
            user ? (
              <View className="rounded-full p-0.5 overflow-hidden">
                <LinearGradient
                  colors={['rgba(74, 222, 128, 0.5)', 'rgba(59, 130, 246, 0.5)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ borderRadius: 9999, padding: 2 }}
                >
                  <View className="rounded-full bg-gray-900 p-0.5">
                    <UserAvatar
                      user={user}
                      size="sm"
                      className="ring-2 ring-transparent"
                    />
                    <View className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-gray-900 rounded-full">
                      <View className="w-full h-full bg-green-500 rounded-full" />
                    </View>
                  </View>
                </LinearGradient>
              </View>
            ) : (
              <AntDesign name="user" size={24} color={color} />
            ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
