import React, { useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Dimensions,
} from "react-native";

import { useState } from "react";

import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
const COLORS = {
  primary: "rgba(58, 103, 138, 0.8)",
  secondary: "rgba(255,255,255,0.5)",
};

const image = {
  uri: "https://images.unsplash.com/photo-1521459467264-802e2ef3141f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80",
};
const App = () => {
  const [todos, setTodos] = useState([]);
  const [textInput, setTextInput] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  useEffect(() => {
    saveTodo(todos);
  }, [todos]);

  const addTodo = () => {
    if (textInput == "") {
      Alert.alert("Error", "Please Enter a Task to add it into List");
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };
      setTodos([...todos, newTodo]);
      setTextInput("");
    }
  };

  const saveTodo = async (todos) => {
    try {
      const saveTo = JSON.stringify(todos);
      await AsyncStorage.setItem("todos", saveTo);
    } catch (error) {
      console.log(error);
    }
  };

  const getTodos = async () => {
    try {
      const todos = await AsyncStorage.getItem("todos");
      if (todos != null) {
        setTodos(JSON.parse(todos));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markTodoComplete = (todoId) => {
    const newTodosItem = todos.map((item) => {
      if (item.id == todoId) {
        return { ...item, completed: true };
      }
      return item;
    });

    setTodos(newTodosItem);
  };

  const deleteTodo = (todoId) => {
    const newTodosItem = todos.filter((item) => item.id != todoId);
    setTodos(newTodosItem);
  };

  const clearAllTodos = () => {
    Alert.alert("Confirm", "Clear All tasks?", [
      {
        text: "Yes",
        onPress: () => setTodos([]),
      },
      {
        text: "No",
      },
    ]);
  };

  const ListItem = ({ todo }) => {
    return (
      <View style={styles.listItem}>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 20,
              color: COLORS.primary,
              textDecorationLine: todo?.completed ? "line-through" : "none",
            }}
          >
            {todo?.task}
          </Text>
        </View>
        {!todo?.completed && (
          <TouchableOpacity onPress={() => markTodoComplete(todo.id)}>
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: "rgba(226, 88, 0, 0.76)" },
              ]}
            >
              <Icon name="done" size={20} color="white" />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => deleteTodo(todo.id)}>
          <View
            style={[
              styles.actionIcon,
              { backgroundColor: "rgba(57, 105, 255, 0.59)" },
            ]}
          >
            <Icon name="delete" size={20} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <View style={styles.header}>
          <Text style={styles.heading}>TODO APP</Text>
          <Icon
            name="delete"
            size={40}
            color="rgba(226, 25, 0, 0.76)"
            onPress={clearAllTodos}
          />
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          data={todos}
          renderItem={({ item }) => <ListItem todo={item} />}
        />

        <View style={styles.addContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              value={textInput}
              placeholder="Add Todo"
              onChangeText={(text) => setTextInput(text)}
            />
          </View>
          <TouchableOpacity onPress={addTodo}>
            <View style={styles.iconContainer}>
              <Icon name="add" color="white" size={50} />
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  inputContainer: {
    height: 50,
    paddingHorizontal: 20,
    elevation: 40,
    backgroundColor: COLORS.secondary,
    flex: 1,
    marginVertical: 20,
    marginRight: 20,
    borderRadius: 30,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    elevation: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  listItem: {
    padding: 20,
    backgroundColor: COLORS.secondary,
    flexDirection: "row",
    elevation: 12,
    borderRadius: 7,
    marginVertical: 10,
  },
  actionIcon: {
    height: 25,
    width: 25,
    backgroundColor: COLORS.secondary,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    marginLeft: 5,
    borderRadius: 3,
  },
  header: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    fontWeight: "bold",
    fontSize: 30,
    color: COLORS.primary,
  },
  image: {
    flex: 1,
    justifyContent: "center",
    height: Dimensions.get("window").height,
  },
});

export default App;
