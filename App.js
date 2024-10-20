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
          clearInput();
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
      <View className="w-full px-2 py-4">
        <View>
          <Text className="font-medium text-center">
            {item.name} {item.lastName}
          </Text>
          <Text className="font-medium text-center">{item.address}</Text>
          <Text className="font-medium text-center">{item.telephone}</Text>
        </View>

        <View className="flex flex-row justify-evenly py-2">
          <TouchableOpacity
            onPress={() => {
              selectStudentForUpdate(item);
            }}
            className=""
          >
            <Text className="text-3xl">
            📝
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              deleteStudent(item.id);
            }}
            className=""
          >
            <Text className="text-3xl">
            🗑️
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 items-center justify-center py-12 px-4 space-y-3 bg-gray-300">
      <Text className="text-xl font-bold">Lista de Estudiantes</Text>

      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        className="w-full"
      />

      <View className="w-[90%] items-center space-y-4">
        <TextInput
          placeholder="Ingrese el nombre del estudiante"
          value={name}
          onChangeText={(text) => setName(text)}
          className="w-full border-b-2 border-blue-900"
        />

        <TextInput
          placeholder="Ingrese el apellido del estudiante"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
          className="w-full border-b-2 border-blue-900"
        />

        <TextInput
          placeholder="Ingrese la dirección del estudiante"
          value={address}
          onChangeText={(text) => setAddress(text)}
          className="w-full border-b-2 border-blue-900"
        />

        <TextInput
          placeholder="Ingrese el teléfono del estudiante"
          value={telephone}
          onChangeText={(text) => setTelephone(text)}
          className="w-full border-b-2 border-blue-900"
          keyboardType="numeric"
        />

        <View className="w-full flex flex-row justify-between space-x-3">
          <TouchableOpacity
            onPress={clearInput}
            className="w-[48%] py-3"
          >
            <Text className="p-3 font-semibold text-sm text-center text-gray-200 bg-rose-800">
              Cancelar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={selectedStudent ? updateStudent : createStudent}
            className="w-[48%] py-3"
          >
            <Text className="p-3 font-semibold text-sm text-center text-gray-200 bg-blue-900">
              Agregar
            </Text>
          </TouchableOpacity>
        </View>

        <StatusBar style="auto" />
      </View>
    </View>
  );
};

export default App;
