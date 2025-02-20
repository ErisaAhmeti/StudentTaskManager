import { scheduleTaskReminder, requestNotificationPermission } from '../utils/notifications';
import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { FAB, Card, Text, ProgressBar, Button, Menu, Divider, Slider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@tasks';

export default function HomeScreen({ navigation, route }) {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  const [filter, setFilter] = useState('All'); // Shto filtrimin
  const [sortBy, setSortBy] = useState('deadline'); // Shto renditjen
  const [filterMenuVisible, setFilterMenuVisible] = useState(false); // Menyja e filtrave
  const [sortMenuVisible, setSortMenuVisible] = useState(false); // Menyja e renditjes

  // Load tasks on mount
  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    saveTasks();
  }, [tasks]);

  // Request notification permission on component mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Handle new tasks from navigation
  useEffect(() => {
    if (route.params?.newTask) {
      const newTask = route.params.newTask;
      setTasks(prev => [...prev, newTask]);
      try {
        scheduleTaskReminder(newTask);
      } catch (error) {
        console.error('Failed to schedule reminder:', error);
      }
    }
  }, [route.params?.newTask]);

  // Load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        // Initialize with a default task if no tasks are found
        const initialTasks = [
          {
            id: '1',
            title: 'Math Homework',
            course: 'Mathematics',
            deadline: '2023-12-15',
            priority: 'High',
            progress: 30,
          },
        ];
        setTasks(initialTasks);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(initialTasks)); // Save initial task
      }
    } catch (e) {
      console.error('Failed to load tasks:', e);
    }
  };

  // Save tasks to AsyncStorage
  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save tasks:', e);
    }
  };

  // Handle progress change for a task
  const handleProgressChange = (taskId, newProgress) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, progress: newProgress } : task
      )
    );
  };

  // Confirm task deletion
  const confirmDelete = (taskId) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => handleDelete(taskId) },
      ]
    );
  };

  // Delete a task
  const handleDelete = (taskId) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  // Delete all tasks
  const handleDeleteAll = () => {
    Alert.alert(
      'Delete All Tasks',
      'Are you sure you want to delete all tasks?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete All', onPress: () => setTasks([]) },
      ]
    );
  };

  // Filter tasks based on priority
  const filteredTasks = tasks.filter(task => {
    if (filter === 'All') return true;
    return task.priority === filter;
  });

  // Sort tasks based on selected criteria
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'deadline') return new Date(a.deadline) - new Date(b.deadline);
    if (sortBy === 'priority') return a.priority.localeCompare(b.priority);
    return a.progress - b.progress;
  });

  // Render each task item
  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">{item.title}</Text>
        <Text variant="bodyMedium">Course: {item.course}</Text>
        <Text variant="bodyMedium">Deadline: {item.deadline}</Text>
        <Text variant="bodyMedium">Priority: {item.priority}</Text>
        <ProgressBar
          progress={item.progress / 100}
          style={styles.progressBar}
          color={getProgressColor(item.progress)}
        />
        <Text variant="bodySmall">{item.progress}% Complete</Text>
      </Card.Content>
      <Card.Actions>
        <Menu
          visible={editingTask?.id === item.id}
          onDismiss={() => setEditingTask(null)}
          anchor={
            <Button
              icon="dots-vertical"
              onPress={() => {
                setEditingTask(item);
                setProgressValue(item.progress);
              }}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setEditingTask({ ...item, progress: item.progress });
              setProgressValue(item.progress);
            }}
            title="Edit Progress"
          />
          <Divider />
          <Menu.Item
            onPress={() => confirmDelete(item.id)}
            title="Delete"
            titleStyle={{ color: 'red' }}
          />
        </Menu>
      </Card.Actions>
    </Card>
  );

  // Get progress color based on progress value
  const getProgressColor = (progress) => {
    if (progress >= 100) return '#4CAF50';
    if (progress >= 50) return '#FFC107';
    return '#F44336';
  };

  return (
    <View style={styles.container}>
      {/* Filter and Sort Buttons */}
      <View style={styles.filterSortContainer}>
        <Button
          mode="outlined"
          onPress={() => setFilterMenuVisible(true)}
          style={styles.filterButton}
        >
          Filter: {filter}
        </Button>
        <Button
          mode="outlined"
          onPress={() => setSortMenuVisible(true)}
          style={styles.sortButton}
        >
          Sort: {sortBy}
        </Button>
      </View>

      {/* Filter Menu */}
      <Menu
        visible={filterMenuVisible}
        onDismiss={() => setFilterMenuVisible(false)}
        anchor={<View />}
      >
        <Menu.Item onPress={() => setFilter('All')} title="All" />
        <Menu.Item onPress={() => setFilter('High')} title="High Priority" />
        <Menu.Item onPress={() => setFilter('Medium')} title="Medium Priority" />
        <Menu.Item onPress={() => setFilter('Low')} title="Low Priority" />
      </Menu>

      {/* Sort Menu */}
      <Menu
        visible={sortMenuVisible}
        onDismiss={() => setSortMenuVisible(false)}
        anchor={<View />}
      >
        <Menu.Item onPress={() => setSortBy('deadline')} title="By Deadline" />
        <Menu.Item onPress={() => setSortBy('priority')} title="By Priority" />
        <Menu.Item onPress={() => setSortBy('progress')} title="By Progress" />
      </Menu>

      {/* Task List */}
      <FlatList
        data={sortedTasks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={tasks} // Refresh when tasks change
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>No tasks found. Add a new task!</Text>
        }
      />

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('AddTask')}
      />

      {/* Delete All Button */}
      <Button
        mode="outlined"
        onPress={handleDeleteAll}
        style={styles.deleteAllButton}
      >
        Delete All Tasks
      </Button>

      {/* Edit Progress Modal */}
      {editingTask && (
        <View style={styles.editModal}>
          <Slider
            style={styles.slider}
            value={progressValue}
            minimumValue={0}
            maximumValue={100}
            step={5}
            onValueChange={setProgressValue}
          />
          <Button
            mode="contained"
            onPress={() => {
              handleProgressChange(editingTask.id, progressValue);
              setEditingTask(null);
            }}
          >
            Save {progressValue}%
          </Button>
          <Button
            mode="outlined"
            onPress={() => setEditingTask(null)}
          >
            Cancel
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    margin: 5,
    padding: 5,
  },
  progressBar: {
    height: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  editModal: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    right: 10,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  slider: {
    width: '100%',
    marginVertical: 10,
  },
  emptyMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  filterSortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterButton: {
    flex: 1,
    marginRight: 5,
  },
  sortButton: {
    flex: 1,
    marginLeft: 5,
  },
  deleteAllButton: {
    
      width: 160, // Gjerësia e butonit
      alignSelf: 'center', // Qendro butonin
      marginTop: 10, // Margjina nga lart
    
  },
});



