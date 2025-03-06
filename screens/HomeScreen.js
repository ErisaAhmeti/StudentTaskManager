import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

const STORAGE_KEY = 'student_tasks';

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
        }
      } catch (error) {
        console.error('Failed to load tasks:', error);
      }
    };
    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      try {
        if (tasks.length > 0) {
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        }
      } catch (error) {
        console.error('Failed to save tasks:', error);
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
        { text: 'Delete', onPress: () => handleDelete(taskId), style: 'destructive' }
      ]
    );
  };

  const handleDelete = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const addNewTask = (newTask) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const markAsComplete = (taskId) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === taskId ? { ...task, progress: 100 } : task
    ));
  };

  const renderTaskItem = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskContent}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskDetail}>Course: {item.course}</Text>
        <Text style={styles.taskDetail}>Deadline: {item.deadline}</Text>
        <Text style={styles.taskDetail}>Priority: {item.priority}</Text>
        <Text style={styles.taskDetail}>Progress: {item.progress}%</Text>
      </View>
      <View style={styles.taskActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => markAsComplete(item.id)}>
          <Icon name="check-circle" size={24} color="#28a745" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => confirmDelete(item.id)}>
          <Icon name="delete-forever" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.emptyText}>No tasks found. Add your first task!</Text>}
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
    backgroundColor: '#f5f5f5',
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#700e34',
    marginBottom: 4,
  },
  taskDetail: {
    fontSize: 14,
    color: '#fc0624',
    marginBottom: 2,
  },
  taskActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
  },
  listContainer: {
    paddingBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#700e34',
    marginTop: 20,
    fontSize: 16,
  },
});

export default HomeScreen;

