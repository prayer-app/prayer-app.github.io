import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  Switch,
  Text,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddPrayerScreen = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [formData, setFormData] = useState({
    person: '',
    prayer: '',
    followup_at: null,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get handlers from route params
  const onAddPrayer = route.params?.onAddPrayer;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({
        ...prev,
        followup_at: selectedDate.toISOString().split('T')[0],
      }));
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (!formData.person.trim()) {
      Alert.alert('Error', 'Please enter a person name.');
      return;
    }

    if (!formData.prayer.trim()) {
      Alert.alert('Error', 'Please enter a prayer request.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (onAddPrayer) {
        await onAddPrayer(formData);
        Alert.alert('Success', 'Prayer added successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        // Fallback - just go back
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add prayer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Select date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>
            <Icon name="add-circle" size={24} color="#007AFF" />
            {' '}Add New Prayer
          </Title>
          <Paragraph style={styles.subtitle}>
            Add a prayer request for someone you care about
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.formCard}>
        <Card.Content>
          <TextInput
            label="Person Name"
            value={formData.person}
            onChangeText={(text) => handleInputChange('person', text)}
            mode="outlined"
            style={styles.input}
            placeholder="Enter the person's name"
            left={<TextInput.Icon icon="person" />}
          />

          <TextInput
            label="Prayer Request"
            value={formData.prayer}
            onChangeText={(text) => handleInputChange('prayer', text)}
            mode="outlined"
            style={styles.input}
            placeholder="Enter the prayer request"
            multiline
            numberOfLines={4}
            left={<TextInput.Icon icon="prayer-times" />}
          />

          <View style={styles.dateSection}>
            <Text style={styles.dateLabel}>Follow-up Date (Optional)</Text>
            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.dateButton}
              icon="calendar"
            >
              {formatDateForDisplay(formData.followup_at)}
            </Button>
            {formData.followup_at && (
              <Button
                mode="text"
                onPress={() => handleInputChange('followup_at', null)}
                style={styles.clearButton}
                textColor="#f44336"
              >
                Clear Date
              </Button>
            )}
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={formData.followup_at ? new Date(formData.followup_at) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting || !formData.person.trim() || !formData.prayer.trim()}
          style={styles.submitButton}
          icon="check"
        >
          Add Prayer
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
          icon="close"
        >
          Cancel
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  formCard: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  dateSection: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  dateButton: {
    marginBottom: 8,
  },
  clearButton: {
    alignSelf: 'flex-start',
  },
  buttonContainer: {
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    borderColor: '#666',
  },
});

export default AddPrayerScreen; 