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
  Chip,
  TextInput,
  IconButton,
  Text,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import shared utilities
import { formatDateForDisplay, formatRelativeTime } from '@prayer-app/shared';

const PrayerDetailsScreen = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const { prayer, editMode = false } = route.params;
  const [isEditing, setIsEditing] = useState(editMode);
  const [editedPrayer, setEditedPrayer] = useState(prayer);

  if (!prayer) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text>Prayer not found</Text>
      </View>
    );
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false);
    Alert.alert('Success', 'Prayer updated successfully!');
  };

  const handleToggleAnswered = () => {
    // TODO: Implement toggle answered functionality
    Alert.alert('Info', 'Toggle answered functionality will be implemented');
  };

  const handleArchive = () => {
    // TODO: Implement archive functionality
    Alert.alert('Info', 'Archive functionality will be implemented');
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove Prayer',
      'Are you sure you want to remove this prayer?',
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
              <Icon name="favorite" size={24} color="#f44336" />
              <Title style={styles.personName}>{prayer.person}</Title>
            </View>
            {prayer.is_answered && (
              <Chip 
                icon="check-circle" 
                mode="outlined" 
                style={styles.answeredChip}
                textStyle={styles.answeredChipText}
              >
                Answered
              </Chip>
            )}
          </View>

          {isEditing ? (
            <TextInput
              label="Prayer Request"
              value={editedPrayer.prayer}
              onChangeText={(text) => setEditedPrayer(prev => ({ ...prev, prayer: text }))}
              mode="outlined"
              style={styles.editInput}
              multiline
              numberOfLines={4}
            />
          ) : (
            <Paragraph style={styles.prayerText}>{prayer.prayer}</Paragraph>
          )}

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Icon name="schedule" size={16} color="#666" />
              <Text style={styles.statText}>
                {prayer.followups.length} follow-up{prayer.followups.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <View style={styles.stat}>
              <Icon name="check-circle" size={16} color="#666" />
              <Text style={styles.statText}>
                {prayer.followups.filter(f => f.did_followup).length} completed
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Follow-up History */}
      {prayer.followups.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Follow-up History</Title>
            {prayer.followups.map((followup, index) => (
              <View key={index} style={styles.followupItem}>
                <View style={styles.followupHeader}>
                  <Icon name="schedule" size={16} color="#666" />
                  <Text style={styles.followupDate}>
                    {formatDateForDisplay(followup.followup_at)}
                  </Text>
                  {followup.did_followup && (
                    <Chip size="small" style={styles.completedChip}>
                      Completed
                    </Chip>
                  )}
                </View>
                {followup.followedup_at && (
                  <Text style={styles.followupNote}>
                    Followed up on {formatDateForDisplay(followup.followedup_at)}
                  </Text>
                )}
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

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
              Edit Prayer
            </Button>
            <Button
              mode="outlined"
              onPress={handleToggleAnswered}
              style={styles.toggleButton}
              icon={prayer.is_answered ? "radio-button-unchecked" : "check-circle"}
            >
              {prayer.is_answered ? "Mark as Unanswered" : "Mark as Answered"}
            </Button>
            <Button
              mode="outlined"
              onPress={handleArchive}
              style={styles.archiveButton}
              icon="archive"
            >
              {prayer.is_archived ? "Unarchive" : "Archive"}
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
  personName: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  answeredChip: {
    backgroundColor: '#e8f5e8',
    borderColor: '#4caf50',
  },
  answeredChipText: {
    color: '#2e7d32',
    fontSize: 12,
  },
  prayerText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  editInput: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  followupItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  followupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  followupDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  completedChip: {
    backgroundColor: '#e8f5e8',
  },
  followupNote: {
    fontSize: 12,
    color: '#666',
    marginLeft: 24,
  },
  actionButtons: {
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  editButton: {
    borderColor: '#007AFF',
  },
  toggleButton: {
    borderColor: '#4caf50',
  },
  archiveButton: {
    borderColor: '#ff9800',
  },
  removeButton: {
    borderColor: '#f44336',
  },
  cancelButton: {
    borderColor: '#666',
  },
});

export default PrayerDetailsScreen; 