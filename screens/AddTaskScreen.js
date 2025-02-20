import { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Menu, Divider } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddTaskScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState('Medium');
  const [menuVisible, setMenuVisible] = useState(false);
  const [courseMenuVisible, setCourseMenuVisible] = useState(false);

  // Lista e kurseve të disponueshme
  const courses = ['Mathematics', 'Physics', 'Chemistry', 'Biology'];

  // Funksioni për ruajtjen e detyrës
  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }
    if (!course.trim()) {
      Alert.alert('Error', 'Please select a course');
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      title,
      course,
      deadline: deadline.toISOString().split('T')[0], // Ruaj vetëm datën
      priority,
      progress: 0,
    };

    // Kthehu në HomeScreen me detyrën e re
    navigation.navigate('Home', { newTask });
    Alert.alert('Success', 'Task saved successfully!');
  };

  // Funksioni për ndryshimin e datës
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Input për titullin e detyrës */}
      <TextInput
        label="Task Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />

      {/* Menu për zgjedhjen e kursit */}
      <Menu
        visible={courseMenuVisible}
        onDismiss={() => setCourseMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setCourseMenuVisible(true)}
            style={styles.input}
            icon="book"
          >
            Course: {course || 'Select Course'}
          </Button>
        }
      >
        {courses.map((courseItem, index) => (
          <Menu.Item
            key={index}
            onPress={() => {
              setCourse(courseItem);
              setCourseMenuVisible(false);
            }}
            title={courseItem}
          />
        ))}
      </Menu>

      {/* Input për afatin e detyrës */}
      <TextInput
        label="Deadline"
        value={deadline.toDateString()}
        style={styles.input}
        mode="outlined"
        editable={false}
        right={<TextInput.Icon icon="calendar" onPress={() => setShowDatePicker(true)} />}
      />
      {showDatePicker && (
        <DateTimePicker
          value={deadline}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Menu për zgjedhjen e prioritetit */}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
            style={styles.input}
            icon="alert-circle"
          >
            Priority: {priority}
          </Button>
        }
      >
        <Menu.Item
          onPress={() => {
            setPriority('High');
            setMenuVisible(false);
          }}
          title="High"
        />
        <Menu.Item
          onPress={() => {
            setPriority('Medium');
            setMenuVisible(false);
          }}
          title="Medium"
        />
        <Menu.Item
          onPress={() => {
            setPriority('Low');
            setMenuVisible(false);
          }}
          title="Low"
        />
      </Menu>

      {/* Butoni për ruajtjen e detyrës */}
      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        icon="content-save"
      >
        Save Task
      </Button>

      {/* Butoni për anulim */}
      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.button}
        icon="close"
      >
        Cancel
      </Button>
    </ScrollView>
  );
}

// Stilizimi
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
  },
});
