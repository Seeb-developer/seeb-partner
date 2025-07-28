import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
} from 'react-native';
import dayjs from 'dayjs';
import Navbar from '../../component/Navbar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { get } from '../../utils/api';

const STATUS_TABS = ['open', 'in_progress', 'closed'];

const MyTicketsScreen = ({ navigation }) => {
  const [status, setStatus] = useState('open');
  const [refreshing, setRefreshing] = useState(false);
  const [filtered, setFiltered] = useState({});
  const [tickets, setTickets] = useState([]);
  const [categories] = useState([
    { label: 'App Issue', value: 'app' },
    { label: 'Payment', value: 'payment' },
    { label: 'Service Delay', value: 'delay' },
    { label: 'Service Not Assigned', value: 'unassigned' },
    { label: 'Customer Unavailable', value: 'customer_unavailable' },
    { label: 'Material Requirement', value: 'material' },
    { label: 'Address/Location Issue', value: 'location' },
    { label: 'Document Verification', value: 'verification' },
    { label: 'Task Cancellation', value: 'cancellation' },
    { label: 'Other', value: 'other' },
  ]);

  const fetchTickets = async () => {
    try {
      setRefreshing(true);
      const partnerJson = await AsyncStorage.getItem('partner');
      const partner = partnerJson ? JSON.parse(partnerJson) : null;

      if (!partner?.id) return;

      const res = await get(`tickets/partner/${partner.id}`);
      setTickets(res.data?.data || []);
    } catch (err) {
      console.error('❌ Failed to fetch tickets:', err);
    } finally {
      setRefreshing(false);
    }
  };


  useEffect(() => {
    fetchTickets();
  }, []);

  const categoryMap = categories.reduce((acc, item) => {
    acc[item.value] = item.label;
    return acc;
  }, {});


  useEffect(() => {
    const filteredTickets = tickets.filter((t) => t.status === status);

    const grouped = filteredTickets.reduce((acc, ticket) => {
      const date = dayjs(ticket.created_at).format('YYYY-MM-DD');
      if (!acc[date]) acc[date] = [];
      acc[date].push(ticket);
      return acc;
    }, {});

    setFiltered(grouped);
  }, [status, tickets]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      fetchTickets(status);
      setRefreshing(false);
    }, 800);
  };



  const renderTicket = ({ item }) => (
    <TouchableOpacity
      style={styles.ticketCard}
      onPress={() => navigation.navigate('TicketChat', { ticketId: item.id })}
    >
      <View style={styles.row}>
        <Text style={styles.ticketTitle}>{item.subject}</Text>
        <Text style={styles.ticketStatus}>
          {item?.status
            .split('_')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')}
        </Text>
      </View>
      <Text style={styles.ticketMessage}>{categoryMap[item.category] || item.category}</Text>
      <Text style={styles.ticketTime}>{dayjs(item.created_at).format('hh:mm A')}</Text>
      {item.attachment && (
        <Image
          source={{ uri: item.attachment }}
          style={{ height: 100, width: '100%', marginTop: 8, borderRadius: 8 }}
          resizeMode="cover"
        />
      )}
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
