import React, { useState, useEffect } from "react";

import {
  FlatList,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";

import { db, initDatabase } from "./database";

initDatabase();

const App = () => {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [telephone, setTelephone] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const showSuccessfulNotification = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const showfailedNotification = (message) => {
    ToastAndroid.show(message, ToastAndroid.LONG);
  };

  const selectStudentForUpdate = (student) => {
    setName(student.name);
    setLastName(student.lastName);
    setAddress(student.address);
    setTelephone(student.telephone);
    setSelectedStudent(student);
  };

  const clearInput = () => {
    setName("");
    setLastName("");
    setAddress("");
    setTelephone("");
    setSelectedStudent(null);
  };

  const createStudent = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO students (name, lastName, address, telephone) VALUES (?, ?, ?, ?);",
        [name, lastName, address, telephone],
        (_, result) => {
          if (result.rowsAffected > 0) {
            showSuccessfulNotification("Student inserted correctly");
            readStudents();
          } else {
            showfailedNotification("No student was inserted");
          }
        },
        (_, error) => {
          console.error("Error inserting student", error);
        }
      );
    });

    clearInput();
  };

  const readStudents = () => {
    db.transaction((tx) => {
      tx.executeSql("SELECT * FROM students;", [], (_, { rows }) => {
        setStudents(rows._array);
      });
    });
  };

  const updateStudent = () => {
    if (!selectedStudent) {
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE students SET name = ?, lastName = ?, address = ?, telephone = ? WHERE id = ?;",
        [name, lastName, address, telephone, selectedStudent.id],
        (_, result) => {
          if (result.rowsAffected > 0) {
            showSuccessfulNotification("Student was successfully updated");
            readStudents();
            clearInput();
          } else {
            showfailedNotification("Student was not updated correctly");
          }
        }
      );
    });
  };

  const deleteStudent = (id) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM students WHERE id = ?;", [id], (_, result) => {
        if (result.rowsAffected > 0) {
          showSuccessfulNotification("Student successfully removed");
          readStudents();
        } else {
          showfailedNotification("Student was not eliminated");
        }
      });
    });
  };

  useEffect(() => {
    readStudents();
  }, []);

  const renderItem = ({ item }) => (
    <View className="flex flex-row justify-between">
      <View className="w-full flex flex-row justify-between px-2 py-4">
        <View>
          <Text>
            {item.name} {item.lastName}
          </Text>
          <Text>{item.address}</Text>
          <Text className="">{item.telephone}</Text>
        </View>

        <View className="space-y-2">
          <TouchableOpacity
            onPress={() => {
              selectStudentForUpdate(item);
            }}
            className="p-1 rounded bg-green-500"
          >
            <Text className="font-semibold text-center text-gray-200">
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              deleteStudent(item.id);
            }}
            className="p-1 rounded bg-red-500"
          >
            <Text className="font-semibold text-center text-gray-200">
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 items-center justify-center py-12 px-4 space-y-3">
      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        className="w-full border rounded"
      />

      <View className="w-full items-center space-y-3">
        <View className="flex flex-row justify-between w-full space-x-4">
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={(text) => setName(text)}
            className="w-[48%] py-1 px-2 border"
          />

          <TextInput
            placeholder="Last name"
            value={lastName}
            onChangeText={(text) => setLastName(text)}
            className="w-[48%] py-1 px-2 border"
          />
        </View>

        <TextInput
          placeholder="Address"
          value={address}
          onChangeText={(text) => setAddress(text)}
          className="w-full py-1 px-2 border"
        />

        <TextInput
          placeholder="Telephone"
          value={telephone}
          onChangeText={(text) => setTelephone(text)}
          className="w-full py-1 px-2 border"
          keyboardType="numeric"
        />

        <TouchableOpacity
          onPress={selectedStudent ? updateStudent : createStudent}
          className="w-full"
        >
          <Text className="p-3 rounded font-semibold text-sm text-center text-gray-200 bg-blue-500">
            Add Student
          </Text>
        </TouchableOpacity>

        <StatusBar style="auto" />
      </View>
    </View>
  );
};

export default App;
