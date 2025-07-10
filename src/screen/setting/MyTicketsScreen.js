import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import dayjs from 'dayjs';
import Navbar from '../../component/Navbar';

const STATUS_TABS = ['open', 'in_progress', 'closed'];

const TICKETS = [
  {
    id: 101,
    category: 'Payment',
    subject: 'Amount not credited',
    status: 'open',
    created_at: '2025-07-08T12:34:56',
  },
  {
    id: 102,
    category: 'App Issue',
    subject: 'App crashing on login',
    status: 'in_progress',
    created_at: '2025-07-06T09:12:22',
  },
  {
    id: 103,
    category: 'Service Delay',
    subject: 'Electrician not arrived',
    status: 'closed',
    created_at: '2025-07-04T15:45:00',
  },
];

const MyTicketsScreen = ({ navigation }) => {
  const [status, setStatus] = useState('open');
  const [refreshing, setRefreshing] = useState(false);
  const [filtered, setFiltered] = useState({});

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      filterTickets(status);
      setRefreshing(false);
    }, 800);
  };

  const filterTickets = (status) => {
    const filteredTickets = TICKETS.filter((t) => t.status === status);
    const grouped = filteredTickets.reduce((acc, ticket) => {
      const date = dayjs(ticket.created_at).format('YYYY-MM-DD');
      if (!acc[date]) acc[date] = [];
      acc[date].push(ticket);
      return acc;
    }, {});
    setFiltered(grouped);
  };

  useEffect(() => {
    filterTickets(status);
  }, [status]);

  const renderTicket = ({ item }) => (
    <TouchableOpacity
      style={styles.ticketCard}
      onPress={() => navigation.navigate('TicketChat', { ticketId: item.id })}
    >
      <View style={styles.row}>
        <Text style={styles.ticketTitle}>{item.subject}</Text>
        <Text style={styles.ticketStatus}>{item.status}</Text>
      </View>
      <Text style={styles.ticketMessage}>{item.category}</Text>
      <Text style={styles.ticketTime}>{dayjs(item.created_at).format('hh:mm A')}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Navbar title="My Tickets" onBack={() => navigation.goBack()} />
      <View style={styles.tabBar}>
        {STATUS_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, status === tab && styles.activeTab]}
            onPress={() => setStatus(tab)}
          >
            <Text style={status === tab ? styles.activeText : styles.tabText}>
              {tab.replace('_', ' ').toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={Object.entries(filtered)}
        keyExtractor={([date]) => date}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item: [date, items] }) => (
          <View>
            <Text style={styles.dateLabel}>{dayjs(date).format('D MMM YYYY')}</Text>
            {items.map((ticket) => (
              <View key={ticket.id}>{renderTicket({ item: ticket })}</View>
            ))}
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No tickets found.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tabItem: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#FF9800',
  },
  tabText: {
    color: '#888',
  },
  activeText: {
    color: '#FF9800',
    fontWeight: '600',
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 14,
    marginBottom: 6,
    marginLeft: 16,
  },
  ticketCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ticketTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  ticketStatus: {
    fontSize: 12,
    color: '#FF9800',
  },
  ticketMessage: {
    color: '#555',
    marginVertical: 4,
  },
  ticketTime: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  empty: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 40,
  },
});

export default MyTicketsScreen;
