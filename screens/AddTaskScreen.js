import { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Button, TextInput, Menu } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddTaskScreen({ route, navigation }) {
  const { addTask } = route.params;
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [deadline, setDeadline] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState('Medium');
  const [menuVisible, setMenuVisible] = useState(false);
  const [courseMenuVisible, setCourseMenuVisible] = useState(false);

  const courses = ['Mathematics', 'English', 'Physics', 'Chemistry'];


  const handleSave = () => {
    if (!title.trim() || !course.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const newTask = {
      id: Date.now().toString(), // ID generation added here
      title,
      course,
      deadline: deadline.toISOString().split('T')[0],
      priority,
      progress: 30,
    };

    addTask(newTask);
    navigation.goBack();
  };

  const onDateChange = (event, selectedDate) => {
    console.log("Selected Date:", selectedDate);
    setShowDatePicker(false);
    if (selectedDate) {
      setDeadline(selectedDate);
    }
  };
  

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Task Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
        mode="outlined"
      />

      {/* Course Selection Menu */}
      <Menu
        visible={courseMenuVisible}
        onDismiss={() => setCourseMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setCourseMenuVisible(true)}
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

      {/* Date Picker */}
      <TextInput
        label="Deadline"
        value={deadline.toDateString()}
        style={styles.input}
        mode="outlined"
        editable={false}
        right={<TextInput.Icon icon="calendar" onPress={() =>  setShowDatePicker(true)} />}
      />
      {showDatePicker && (
        <DateTimePicker
          value={deadline}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Priority Selection */}
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setMenuVisible(true)}
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

      <Button
        mode="contained"
        onPress={handleSave}
        style={styles.button}
        icon="content-save"
      >
        Save Task
      </Button>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5', // Sfondi mbetet i njëjtë
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff', // Inputet mbeten të bardha për kontrast të mirë
    borderColor: '#700e34', // Kufiri i inputeve me ngjyrë #700e34
    borderWidth: 1, // Shtuar kufirin
    borderRadius: 5, // Rrafshezo kufirin
    paddingHorizontal: 10, // Pak hapësirë brenda inputit
  },
  button: {
    marginTop: 10,
    paddingVertical: 10,
    backgroundColor: '#700e34', // Ngjyra e butonit është #700e34
    borderRadius: 5, // Rrumbullakos kufirin e butonit
    alignItems: 'center', // Përshtat tekstin në qendër
  },
  buttonText: {
    color: '#fff', // Teksti i butonit të bardhë për kontrast të mirë
    fontSize: 16,
    fontWeight: 'bold',
  },
  menuContainer: {
    marginBottom: 15,
    minHeight: 50,
    justifyContent: 'center',
  },
  select: {
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#700e34', // Kufiri për selektorin "course:select"
    borderRadius: 5,
    backgroundColor: '#fff', // Background për selektorin
  },
  selectText: {
    color: '#700e34', // Teksti i selektorit është në ngjyrë #700e34
    fontSize: 14,
  },
  priority: {
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#700e34', // Kufiri për prioritetin
    borderRadius: 5,
    backgroundColor: '#fff', // Background për prioritetin
  },
  priorityText: {
    color: '#700e34', // Teksti për prioritetin është në ngjyrë #700e34
    fontSize: 14,
  },
  saveTask: {
    marginTop: 20,
    paddingVertical: 12,
    backgroundColor: '#700e34', // Ngjyra e butonit "save task"
    borderRadius: 5,
    alignItems: 'center',
  },
  saveTaskText: {
    color: '#fff', // Teksti i butonit "save task" është i bardhë
    fontSize: 16,
    fontWeight: 'bold',
  },
});
