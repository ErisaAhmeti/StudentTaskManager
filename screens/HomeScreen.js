import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Menu } from 'react-native-paper';


const STORAGE_KEY = 'student_tasks';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);

  // Load tasks on component mount
  useEffect(() => {
    const loadTasks = async () => {
      
      try {
        const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTasks !== null) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (e) {
        console.error('Failed to load tasks:', e);
      }
    };
    loadTasks();
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } catch (e) {
        console.error('Failed to save tasks:', e);
      }
    };
    saveTasks();
  }, [tasks]);

  const confirmDelete = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => handleDelete(taskId) }
      ]
    );
  };

  const handleDelete = (taskId) => {

    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  console.log("Deleting item with ID:", id);
  };
  
  

  

  // Add task function passed to AddTask screen
  const addNewTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };
  
<Menu>
  <Menu.Item

  onPress={() => confirmDelete(item.id)}

  title="Delete"

  titleStyle={{ color: 'red' }}

/>

</Menu>


  // Render each task item
  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDetail}>Course: {item.course}</Text>
        <Text style={styles.taskDetail}>Deadline: {item.deadline}</Text>
        <Text style={styles.taskDetail}>Priority: {item.priority}</Text>
        <Text style={styles.taskDetail}>Progress: {item.progress}%</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}

      >
        <Icon name="delete-forever" size={24} color="#ff4444" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id.toString()} // Ensure it returns a string
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tasks found. Add your first task!</Text>
        }
      />

      <Button
        title="Add New Task"
        onPress={() => navigation.navigate('AddTask', { addTask: addNewTask })}
        color="#581845"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5', // sfondi i lehtë mbetet
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#700e34', // ngjyra e kuqe për titullin
    marginVertical: 16,
  },
  taskItem: {
    backgroundColor: 'white', // sfondi i bardhë për item-et
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2, // për një efekt hije të lehtë
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#700e34', // ngjyra e errët për titujt e detyrave
    marginBottom: 4,
  },
  taskDetail: {
    fontSize: 14,
    color: '#fc0624', // ngjyra më e lehtë për detajet
    marginBottom: 2,
    fontFamily : 'Times New Roman'
  },
  deleteButton: {
    padding: 8,
    borderRadius: 4, // këndet e buta të butonit
  },
  listContainer: {
    paddingBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#700e34', // ngjyra e kuqe për tekstin kur lista është bosh
    marginTop: 20,
    fontSize: 16,
  },
});


export default HomeScreen;