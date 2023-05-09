import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AppRegistry } from "react-native";
import { View, Text } from "react-native";
import CircularProgress from "react-native-circular-progress-indicator";
import {StyleSheet, ScrollView } from "react-native";

function MonthCalendar() {
    const progressBars = [];
    for (let i = 1; i <= 30; i++) {
      progressBars.push(
        <View key={i} style={styles.progressBarContainer}>
          <CircularProgress
            value={Math.floor(Math.random() * 20)}
            maxValue={20}
            radius={50}
            textColor={"#ecf0f1"}
            activeStrokeColor={"#3CC266"}
            inActiveStrokeColor={"#3CC266"}
            inActiveStrokeOpacity={0.2}
            inActiveStrokeWidth={10}
            activeStrokeWidth={10}
            valueSuffix={'km'}
            title={`Week ${i}`}
            titleColor={"#ecf0f1"}
            titleStyle={{ fontWeight: "bold" }}
          />
        </View>
      );
    }
  
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.progressBarsContainer}>{progressBars}</View>
        </ScrollView>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#2c3e50",
    },
    progressBarsContainer: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    progressBarContainer: {
      margin: 10,
    },
  });
  
  export default MonthCalendar;