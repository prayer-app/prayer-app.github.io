import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  TextInput,
  Text,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import shared utilities
import { formatDateForDisplay } from '@prayer-app/shared';

const PraiseDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const { praise, editMode = false } = route.params;
  const [isEditing, setIsEditing] = useState(editMode);
  const [editedPraise, setEditedPraise] = useState(praise);

  if (!praise) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text>Praise not found</Text>
      </View>
    );
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
    Alert.alert('Success', 'Praise updated successfully!');
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove Praise',
      'Are you sure you want to remove this praise?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement remove functionality
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.content}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Icon name="celebration" size={24} color="#34C759" />
              <Title style={styles.praiseTitle}>Praise</Title>
            </View>
          </View>

          {isEditing ? (
            <TextInput
              label="Praise"
              value={editedPraise.text}
              onChangeText={(text) => setEditedPraise(prev => ({ ...prev, text }))}
              mode="outlined"
              style={styles.editInput}
              multiline
              numberOfLines={6}
            />
          ) : (
            <Paragraph style={styles.praiseText}>{praise.text}</Paragraph>
          )}

          <View style={styles.dateContainer}>
            <Icon name="event" size={16} color="#666" />
            <Text style={styles.dateText}>
              {formatDateForDisplay(praise.date)}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {isEditing ? (
          <>
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
              icon="check"
            >
              Save Changes
            </Button>
            <Button
              mode="outlined"
              onPress={() => setIsEditing(false)}
              style={styles.cancelButton}
              icon="close"
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              mode="outlined"
              onPress={() => setIsEditing(true)}
              style={styles.editButton}
              icon="edit"
            >
              Edit Praise
            </Button>
            <Button
              mode="outlined"
              onPress={handleRemove}
              style={styles.removeButton}
              icon="delete"
              textColor="#f44336"
            >
              Remove
            </Button>
          </>
        )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  praiseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34C759',
  },
  praiseText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  editInput: {
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  actionButtons: {
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#34C759',
  },
  editButton: {
    borderColor: '#34C759',
  },
  removeButton: {
    borderColor: '#f44336',
  },
  cancelButton: {
    borderColor: '#666',
  },
});

export default PraiseDetailsScreen; 