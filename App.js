import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { StatusBar } from "expo-status-bar";
import Svg, { G, Circle } from 'react-native-svg';
import {

 StyleSheet,
 Text,
 View,
 ImageBackground,
 Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,

} from "react-native";




import { Pedometer } from "expo-sensors";
import CircularProgress from "react-native-circular-progress-indicator";
 
export default function App() {

  const [goal, setGoal] = useState("5");

  const handleGoalChange = (text) => {
    // Replace commas with periods and remove all non-numeric characters
    const cleanedValue = text.replace(/[^0-9.,]/g, '').replace(',', '.');
  
    // Allow empty values
    if (cleanedValue === '' || cleanedValue === '.') {
      setGoal('');
    } else {
      setGoal(cleanedValue.toString());
    }
  };
  
  const handleGoalSubmit = () => {
    if (goal === '') {
      setGoal('0');
    }
  };

 const [PedometerAvailability, setPedometerAvailability] = useState("");
 const [StepCount, setStepCount] = useState(0);
 const [isInitialized, setIsInitialized] = useState(false);
 
 const [stepData, setStepData] = useState([]);

 var WindowHeight = Dimensions.get("window").height;
 var Dist = StepCount / 1300;
 var DistanceCovered = Dist.toFixed(2);
 var cal = DistanceCovered * 60;
 var caloriesBurnt = cal.toFixed(2);
//  var newGoal = 6500;

 async function loadSteps() {
  try {
    const steps = await AsyncStorage.getItem('stepCount');
    if (steps !== null) {
      setStepCount(parseInt(steps));
    }
  } catch (error) {
    console.error(error);
  }
}

const stepping = async () => {
  try {
    const end = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const result = await Pedometer.getStepCountAsync(start, end);

    setStepCount(result.steps);
  } catch (error) {
    console.error(error);
  }
};

const saveSteps = async (steps) => {
  const today = new Date();
  const dateString = today.toISOString().slice(0,10); // get date string in YYYY-MM-DD format
  const existingData = await AsyncStorage.getItem('stepData'); // get existing data from storage
  let data = {};
  if (existingData !== null) {
    data = JSON.parse(existingData); // parse existing data as JSON
  }
  data[dateString] = steps; // add current day's steps to data object
  await AsyncStorage.setItem('stepData', JSON.stringify(data)); // store updated data object in storage
}

// function to get steps for a specific date
const getSteps = async (date) => {
  const dateString = date.toISOString().slice(0,10); // get date string in YYYY-MM-DD format
  const existingData = await AsyncStorage.getItem('stepData'); // get existing data from storage
  if (existingData !== null) {
    const data = JSON.parse(existingData); // parse existing data as JSON
    return data[dateString] || 0; // return steps for the specified date, or 0 if not found
  } else {
    return 0;
  }
};



useEffect(() => {
  Pedometer.isAvailableAsync().then(
    (result) => {
      setPedometerAvailability(String(result));
    },
    (error) => {
      setPedometerAvailability(error);
    }
  );
}, []);

useEffect(() => {
  loadSteps();
  setIsInitialized(true);
  stepping();
}, []);

useEffect(() => {
  const interval = setInterval(() => {
    stepping();
  }, 10000);

  return () => clearInterval(interval);
}, []);
 
// get saved steps for each day of the week and store them in state
useEffect(() => {
  const getSavedSteps = async () => {
    const today = new Date();
    const savedSteps = JSON.parse(AsyncStorage.getItem('savedSteps'));

    if (Array.isArray(savedSteps)) {
      const filteredSteps = savedSteps.filter(step => {
        const stepDate = new Date(step.timestamp);
        return stepDate.getDate() === today.getDate() && stepDate.getMonth() === today.getMonth() && stepDate.getFullYear() === today.getFullYear();
      });
et
      const totalSteps = filteredSteps.reduce((accumulator, currentValue) => accumulator + currentValue.stepCount, 0);

      getSteps(totalSteps);
    }
  };

  getSavedSteps().catch(error => console.log(error));
}, []);

 return (

   <View style={styles.container}>

     <ImageBackground

       style={{ flex: 1 }}

      //  source={require("./assets/runningFinal.jpg")}

       resizeMode="cover"

     >

       <View style={{ flex: 1, justifyContent: "center" }}>

         <Text style={styles.headingDesign}>

          Available on the device : {PedometerAvailability}

         </Text>

       </View>

       <View style={styles.weeklyProgress1}>


<CircularProgress

value={1273}
maxValue={2632}
radius={30}
textColor={"#ecf0f1"}
activeStrokeColor={"#0359F6"}
inActiveStrokeColor={"#0359F6"}
inActiveStrokeOpacity={0.2}
inActiveStrokeWidth={10}
activeStrokeWidth={10}
title={"Mo"}
titleColor={"#ecf0f1"}
titleStyle={{ fontWeight: "bold" }}


/>
<CircularProgress

value={1349}
maxValue={1316}
radius={30}
textColor={"#ecf0f1"}
activeStrokeColor={"#0359F6"}
inActiveStrokeColor={"#0359F6"}
inActiveStrokeOpacity={0.2}
inActiveStrokeWidth={10}
activeStrokeWidth={10}
title={"Tu"}
titleColor={"#ecf0f1"}
titleStyle={{ fontWeight: "bold" }}

/>
<CircularProgress

value={StepCount}
maxValue={10000}
radius={30}
textColor={"#ecf0f1"}
activeStrokeColor={"#3CC266"}
inActiveStrokeColor={"#3CC266"}
inActiveStrokeOpacity={0.2}
inActiveStrokeWidth={10}
activeStrokeWidth={10}
title={"We"}
titleColor={"#ecf0f1"}
titleStyle={{ fontWeight: "bold" }}

/>
</View>
<View style={styles.weeklyProgress2}>
<CircularProgress

value={0}
maxValue={10000}
radius={30}
textColor={"#ecf0f1"}
activeStrokeColor={"#535563"}
inActiveStrokeColor={"#535563"}
inActiveStrokeOpacity={0.2}
inActiveStrokeWidth={10}
activeStrokeWidth={10}
title={"Th"}
titleColor={"#ecf0f1"}
titleStyle={{ fontWeight: "bold" }}

/>
<CircularProgress

value={0}
maxValue={10000}
radius={30}
textColor={"#ecf0f1"}
activeStrokeColor={"#535563"}
inActiveStrokeColor={"#535563"}
inActiveStrokeOpacity={0.2}
inActiveStrokeWidth={10}
activeStrokeWidth={10}
title={"Fr"}
titleColor={"#ecf0f1"}
titleStyle={{ fontWeight: "bold" }}

/>
<CircularProgress

value={0}
maxValue={10000}
radius={30}
textColor={"#ecf0f1"}
activeStrokeColor={"#535563"}
inActiveStrokeColor={"#535563"}
inActiveStrokeOpacity={0.2}
inActiveStrokeWidth={10}
activeStrokeWidth={10}
title={"Sa"}
titleColor={"#ecf0f1"}
titleStyle={{ fontWeight: "bold" }}

/>
<CircularProgress

value={0}
maxValue={10000}
radius={30}
textColor={"#ecf0f1"}
activeStrokeColor={"#535563"}
inActiveStrokeColor={"#535563"}
inActiveStrokeOpacity={0.2}
inActiveStrokeWidth={10}
activeStrokeWidth={10}
title={"Su"}
titleColor={"#ecf0f1"}
titleStyle={{ fontWeight: "bold" }}

/>


</View>
<View style={styles.goal}>
      <Text style={{...styles.label, fontSize: 24}}> Goal </Text>
      <View style={styles.goalkm}>
      <TextInput
        value={goal.toString() } // Convert goal to a string using the String function
        onChangeText={handleGoalChange}
        keyboardType="numeric"
        style={styles.input}
        returnKeyType="done" // Add this prop
        onSubmitEditing={handleGoalSubmit}
      
      />
      
      <Text style={styles.label}>Km ({(goal * 100000 / 76).toFixed(0)} steps) </Text>
    </View>
    </View>
       <View style={styles.progressWrapper}>

         <CircularProgress

           value={StepCount}
           maxValue={6500}
           radius={180}
           textColor={"#ecf0f1"}
           activeStrokeColor={"#3CC266"}
           inActiveStrokeColor={"#3CC266"}
           inActiveStrokeOpacity={0.2}
           inActiveStrokeWidth={40}
           activeStrokeWidth={40}
           title={"Steps"}
           titleColor={"#ecf0f1"}
           titleStyle={{ fontWeight: "bold" }}

         />
         

       </View>

 

       <View style={{ flex: 1, justifyContent: "center" }}>

         <View style={{ flex: 1 }}>

           
            

         

         
  


           
         </View>
         <View style={styles.textWrapper}>
         <View style={{ flex: 1 }}>
           <Text
             style={[
               styles.textDesign,
               { width: "93%", paddingLeft: 20, marginLeft: '-3.5%',},
             ]}
           >
            <Text style={{fontSize:24}}> Distance </Text> {'\n'} {DistanceCovered} km
           </Text>
         </View>
         <View style={{ flex: 1 }}>
           <Text
             style={[
               styles.textDesign,
               { width: "93%", paddingLeft: 20, marginLeft: '-3.5%',  },
             ]}

           >

<Text style={{fontSize:24}}> Calories </Text> {'\n'}{caloriesBurnt}

           </Text>
           </View>
         </View>

         <StatusBar style="auto" />

       </View>

     </ImageBackground>

   </View>

 );

}

 

const styles = StyleSheet.create({
  goal: {
    // marginTop: 30,
    paddingTop: 15,
    borderTopColor: "#fff",
    borderTopWidth: 2,
    // flexDirection: 'row',
    alignItems: 'center',
    alignSelf: "center",
    //  backgroundColor: "#3CC266",
    //  height: 50,
     width : '95%',
    //  borderWidth: 1,
     borderRadius: 50,
     overflow: "hidden",
     fontSize: 15,
     color: "white",
     fontWeight: "bold",
     fontFamily: "Arial",
     marginTop: -10,
     marginBottom: 30,

  
  },
  label: {
   textAlign: "center",
    
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Arial",
    color: "white",

    marginRight: 5,
    
  },
  input: {
    color: "white",
    textAlign: "center",

    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Arial",
    width: 40,
    height: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 5,
  },

 container: {

   flex: 1,

   backgroundColor: "#171717",

 },

 headingDesign: {

   alignSelf: "center",

   fontSize: 15,

   color: "white",

  //  fontWeight: "bold",

   fontFamily: "Arial",
   marginTop: -60,

 },
 weeklyProgress1: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  // width: 220,
  marginTop: -100,
  marginBottom: 15,
  marginLeft: 75,
  marginRight: 75,
},
weeklyProgress2: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  // width: 220,
  marginBottom: 30,
  marginLeft: 50,
  marginRight: 50,

},

 progressWrapper: {
  flex: 2,
  justifyContent: "center",
  alignItems: "center",
},

goalkm: {
  // backgroundColor: "#3CC266",
  flexDirection: 'row',
},

 textDesign: {
  marginBottom: 100,
  alignSelf: "center",
  //  backgroundColor: "#3CC266",
   height: 50,
   width : '85%',
  //  borderWidth: 1,
   borderRadius: 20,
   overflow: "hidden",
   fontSize: 15,
   color: "white",
   fontWeight: "bold",
   fontFamily: "Arial",
   textAlign: "center",

 },
  textWrapper: {
  flexDirection: 'row',
  // alignSelf: "center",
  alignItems: 'center',
  justifyContent: "center"
  },
 

});