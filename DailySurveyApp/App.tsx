import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Alert } from "react-native";
import CheckBox from "react-native-elements/dist/checkbox/CheckBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as MailComposer from "expo-mail-composer";
import RNPickerSelect from "react-native-picker-select";

export default function App() {
  const [formData, setFormData] = useState({
    actc: false,
    peerTutoring: false,
    writingCenter: false,
    mathCenter: false,
    trio: false,
    facultyHours: false,
    studyGroup: false,
    exercise: "",
    meditation: false,
    sleepHours: "",
    tao: false,
    togetherAll: false,
    meds: "",
  });

  useEffect(() => {
    requestNotificationPermission();
    scheduleDailyReminder();
  }, []);

  const requestNotificationPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Enable notifications for reminders.");
    }
  };

  const scheduleDailyReminder = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Daily Survey Reminder",
        body: "Don't forget to fill out your daily survey!",
      },
      trigger: { 
        seconds: 86400, 
        repeats: true,
      },
    });
  };

  const saveResponse = async () => {
    const storedData = await AsyncStorage.getItem("surveyData");
    const dataArray = storedData ? JSON.parse(storedData) : [];
    dataArray.push({ date: new Date().toISOString(), ...formData });

    await AsyncStorage.setItem("surveyData", JSON.stringify(dataArray));
    Alert.alert("Success", "Survey saved!");
  };

  const exportData = async () => {
    const storedData = await AsyncStorage.getItem("surveyData");
    if (!storedData) {
      Alert.alert("No Data", "No survey data found.");
      return;
    }

    const emailBody = JSON.stringify(JSON.parse(storedData), null, 2);

    const isAvailable = await MailComposer.isAvailableAsync();
    if (isAvailable) {
      await MailComposer.composeAsync({
        recipients: [],
        subject: "Survey Data",
        body: emailBody,
      });
    } else {
      Alert.alert("Error", "Mail app not available.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Daily Survey</Text>
      
      <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
        <CheckBox
          checked={formData.actc}
          onPress={() => setFormData({ ...formData, actc: !formData.actc })}
        />
        <Text>Did you go to ACTC?</Text>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
        <CheckBox
          checked={formData.peerTutoring}
          onPress={() => setFormData({ ...formData, peerTutoring: !formData.peerTutoring })}
        />
        <Text>Peer Tutoring?</Text>
      </View>

      <RNPickerSelect
        onValueChange={(value) => setFormData({ ...formData, exercise: value })}
        items={[
          { label: "Low", value: "low" },
          { label: "Medium", value: "medium" },
          { label: "High", value: "high" },
        ]}
        placeholder={{ label: "Select Exercise Level", value: null }}
      />

      <TextInput
        placeholder="Sleep Hours"
        keyboardType="numeric"
        value={formData.sleepHours}
        onChangeText={(value) => setFormData({ ...formData, sleepHours: value })}
        style={{ borderWidth: 1, padding: 8, marginVertical: 10 }}
      />

      <Button title="Submit" onPress={saveResponse} />
      <Button title="Export & Email" onPress={exportData} />
    </View>
  );
}
