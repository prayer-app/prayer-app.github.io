import React, { useState, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Chip,
  FAB,
  IconButton,
  Menu,
  Divider,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import shared utilities
import { 
  formatDateForDisplay, 
  isToday, 
  isPastDue, 
  getDaysUntil,
  formatRelativeTime 
} from '@prayer-app/shared';

const PrayerListScreen = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(null);

  // Get prayers from route params or context
  const prayers = route.params?.prayers || [];
  const onRefresh = route.params?.onRefresh;

  // Filter prayers based on status
  const activePrayers = prayers.filter(prayer => 
    !prayer.is_removed && !prayer.is_archived
  );

  const answeredPrayers = prayers.filter(prayer => 
    prayer.is_answered && !prayer.is_removed && !prayer.is_archived
  );

  const archivedPrayers = prayers.filter(prayer => 
    prayer.is_archived && !prayer.is_removed
  );

  // Get next follow-up date for a prayer
  const getNextFollowup = (prayer) => {
    const pendingFollowups = prayer.followups.filter(
      followup => !followup.did_followup && !followup.followedup_at
    );
    
    if (pendingFollowups.length === 0) return null;
    
    return pendingFollowups.sort((a, b) => 
      new Date(a.followup_at) - new Date(b.followup_at)
    )[0];
  };

  // Render prayer item
  const renderPrayerItem = useCallback(({ item: prayer }) => {
    const nextFollowup = getNextFollowup(prayer);
    const daysUntil = nextFollowup ? getDaysUntil(nextFollowup.followup_at) : null;
    const isOverdue = nextFollowup ? isPastDue(nextFollowup.followup_at) : false;

    return (
      <Card style={styles.card} onPress={() => navigation.navigate('PrayerDetails', { prayer })}>
        <Card.Content>
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Title style={styles.personName} numberOfLines={1}>
                {prayer.person}
              </Title>
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
            <Menu
              visible={menuVisible === prayer.id}
              onDismiss={() => setMenuVisible(null)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={() => setMenuVisible(prayer.id)}
                />
              }
            >
              <Menu.Item
                leadingIcon="edit"
                onPress={() => {
                  setMenuVisible(null);
                  navigation.navigate('PrayerDetails', { prayer, editMode: true });
                }}
                title="Edit"
              />
              <Menu.Item
                leadingIcon={prayer.is_answered ? "radio-button-unchecked" : "check-circle"}
                onPress={() => {
                  setMenuVisible(null);
                  // Handle toggle answered
                }}
                title={prayer.is_answered ? "Mark as Unanswered" : "Mark as Answered"}
              />
              <Menu.Item
                leadingIcon="archive"
                onPress={() => {
                  setMenuVisible(null);
                  // Handle archive
                }}
                title="Archive"
              />
              <Menu.Item
                leadingIcon="delete"
                onPress={() => {
                  setMenuVisible(null);
                  // Handle remove
                }}
                title="Remove"
              />
            </Menu>
          </View>

          <Paragraph style={styles.prayerText} numberOfLines={3}>
            {prayer.prayer}
          </Paragraph>

          {nextFollowup && (
            <View style={styles.followupContainer}>
              <Icon name="schedule" size={16} color="#666" />
              <Text style={[
                styles.followupText,
                isOverdue && styles.overdueText
              ]}>
                Follow-up {formatRelativeTime(nextFollowup.followup_at)}
                {isOverdue && ' (Overdue)'}
              </Text>
            </View>
          )}

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Icon name="schedule" size={14} color="#666" />
              <Text style={styles.statText}>
                {prayer.followups.length} follow-up{prayer.followups.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <View style={styles.stat}>
              <Icon name="check-circle" size={14} color="#666" />
              <Text style={styles.statText}>
                {prayer.followups.filter(f => f.did_followup).length} completed
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  }, [navigation, menuVisible]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setRefreshing(false);
  }, [onRefresh]);

  // Render section header
  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>({section.data.length})</Text>
    </View>
  );

  // Prepare sections
  const sections = [
    {
      title: 'Active Prayers',
      data: activePrayers.filter(p => !p.is_answered),
    },
    {
      title: 'Answered Prayers',
      data: answeredPrayers,
    },
    {
      title: 'Archived Prayers',
      data: archivedPrayers,
    },
  ].filter(section => section.data.length > 0);

  if (prayers.length === 0) {
    return (
      <View style={[styles.emptyContainer, { paddingTop: insets.top }]}>
        <Icon name="prayer-times" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No Prayers Yet</Text>
        <Text style={styles.emptySubtitle}>
          Start by adding your first prayer request
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={sections}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item: section }) => (
          <View>
            {renderSectionHeader({ section })}
            <FlatList
              data={section.data}
              keyExtractor={(item) => item.id}
              renderItem={renderPrayerItem}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              scrollEnabled={false}
            />
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContainer}
      />
      
      <FAB
        icon="plus"
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
        onPress={() => navigation.navigate('AddPrayer')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  personName: {
    fontSize: 18,
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
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  followupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  followupText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  overdueText: {
    color: '#f44336',
    fontWeight: 'bold',
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
    fontSize: 12,
    color: '#666',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  sectionCount: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  separator: {
    height: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#007AFF',
  },
});

export default PrayerListScreen; 