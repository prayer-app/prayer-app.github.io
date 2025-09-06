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
  FAB,
  IconButton,
  Menu,
  Text,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import shared utilities
import { formatDateForDisplay } from '@prayer-app/shared';

const PraiseListScreen = ({ route }) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(null);

  // Get praises from route params or context
  const praises = route.params?.praises || [];
  const onRefresh = route.params?.onRefresh;

  // Sort praises by date (newest first)
  const sortedPraises = [...praises].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  // Render praise item
  const renderPraiseItem = useCallback(({ item: praise }) => {
    return (
      <Card style={styles.card} onPress={() => navigation.navigate('PraiseDetails', { praise })}>
        <Card.Content>
          <View style={styles.headerRow}>
            <View style={styles.titleContainer}>
              <Icon name="celebration" size={20} color="#34C759" />
              <Title style={styles.praiseTitle}>Praise</Title>
            </View>
            <Menu
              visible={menuVisible === praise.id}
              onDismiss={() => setMenuVisible(null)}
              anchor={
                <IconButton
                  icon="dots-vertical"
                  onPress={() => setMenuVisible(praise.id)}
                />
              }
            >
              <Menu.Item
                leadingIcon="edit"
                onPress={() => {
                  setMenuVisible(null);
                  navigation.navigate('PraiseDetails', { praise, editMode: true });
                }}
                title="Edit"
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

          <Paragraph style={styles.praiseText} numberOfLines={4}>
            {praise.text}
          </Paragraph>

          <View style={styles.dateContainer}>
            <Icon name="event" size={16} color="#666" />
            <Text style={styles.dateText}>
              {formatDateForDisplay(praise.date)}
            </Text>
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

  if (praises.length === 0) {
    return (
      <View style={[styles.emptyContainer, { paddingTop: insets.top }]}>
        <Icon name="celebration" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No Praises Yet</Text>
        <Text style={styles.emptySubtitle}>
          Start by adding your first praise
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        data={sortedPraises}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPraiseItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContainer}
      />
      
      <FAB
        icon="plus"
        style={[styles.fab, { bottom: insets.bottom + 16 }]}
        onPress={() => navigation.navigate('AddPraise')}
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
  praiseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
  },
  praiseText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
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
    backgroundColor: '#34C759',
  },
});

export default PraiseListScreen; 