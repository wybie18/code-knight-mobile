import { AntDesign, FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const Layout = () => {
  return (
    <Tabs
    screenOptions={{
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
          tabBarIcon: ({color}) => <FontAwesome6 name="user" size={24} color={color} />
        }}
      />
    </Tabs>
  );
};

export default Layout;
