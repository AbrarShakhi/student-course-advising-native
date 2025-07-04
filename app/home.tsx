import { Tabs } from "expo-router";

export default function HomeTabs() {
  return (
    <Tabs>
      <Tabs.Screen
        name="tab1"
        options={{ title: "Tab 1" }}
      />
      <Tabs.Screen
        name="tab2"
        options={{ title: "Tab 2" }}
      />
      <Tabs.Screen
        name="tab3"
        options={{ title: "Tab 3" }}
      />
    </Tabs>
  );
} 