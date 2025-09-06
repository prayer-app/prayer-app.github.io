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
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddPraiseScreen = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [praiseText, setPraiseText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get handlers from route params
  const onAddPraise = route.params?.onAddPraise;

  const handleSubmit = async () => {
    // Validate form
    if (!praiseText.trim()) {
      Alert.alert('Error', 'Please enter a praise.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (onAddPraise) {
        await onAddPraise(praiseText.trim());
        Alert.alert('Success', 'Praise added successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        // Fallback - just go back
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to add praise. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>
            <Icon name="celebration" size={24} color="#34C759" />
            {' '}Add New Praise
          </Title>
          <Paragraph style={styles.subtitle}>
            Give thanks for answered prayers and blessings
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.formCard}>
        <Card.Content>
          <TextInput
            label="Praise"
            value={praiseText}
            onChangeText={setPraiseText}
            mode="outlined"
            style={styles.input}
            placeholder="What are you thankful for today?"
            multiline
            numberOfLines={6}
            left={<TextInput.Icon icon="celebration" />}
          />
        </Card.Content>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting || !praiseText.trim()}
          style={styles.submitButton}
          icon="check"
        >
          Add Praise
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
  buttonContainer: {
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#34C759',
  },
  cancelButton: {
    borderColor: '#666',
  },
});

export default AddPraiseScreen; 