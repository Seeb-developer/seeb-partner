// screens/PayoutScreen.js
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import Navbar from '../../component/Navbar';
import { get, getPartnerId } from '../../utils/api';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import dayjs from 'dayjs';

const FILTERS = [
  { key: 'this_week', label: 'This Week' },
  { key: 'this_month', label: 'This Month' },
  { key: 'custom', label: 'Custom' },
];

const Payout = ({ navigation }) => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState('this_month');
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null });
  const [picker, setPicker] = useState({ visible: false, type: 'start' });

  useEffect(() => {
    // Default – load this month like the mockup
    handleFilterChange('this_month');
  }, []);

  const fetchPayouts = async (startDate = null, endDate = null) => {
    setLoading(true);
    try {
      const partnerId = await getPartnerId();
      if (!partnerId) throw new Error('Partner ID not found');

      const params = {};
      if (startDate && endDate) {
        params.start_date = dayjs(startDate).format('YYYY-MM-DD');
        params.end_date = dayjs(endDate).format('YYYY-MM-DD');
      }

      const res = await get(`payouts/${partnerId}`, params);

      if (res?.status === 200 && Array.isArray(res.data)) {
        setPayouts(res.data);
      } else {
        // fallback demo (mockup-like)
        setPayouts([
          {
            booking_id: '16',
            amount: '44052.00',
            date: '2025-07-23',
            status: 'paid',
          },
          {
            booking_id: '18',
            amount: '22000.00',
            date: '2025-07-25',
            status: 'pending',
          },
        ]);
      }
    } catch (e) {
      console.log('fetchPayouts error:', e.message);
      // show fallback so you can see UI
      setPayouts([
        {
          booking_id: '16',
          amount: '44052.00',
          date: '2025-07-23',
          status: 'paid',
        },
        {
          booking_id: '18',
          amount: '22000.00',
          date: '2025-07-25',
          status: 'pending',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type) => {
    setFilter(type);

    if (type === 'this_week') {
      const start = dayjs().startOf('week').toDate();
      const end = dayjs().endOf('week').toDate();
      fetchPayouts(start, end);
    } else if (type === 'this_month') {
      const start = dayjs().startOf('month').toDate();
      const end = dayjs().endOf('month').toDate();
      fetchPayouts(start, end);
    } else {
      // custom
      setCustomDateRange({ start: null, end: null });
    }
  };

  const onConfirmDate = (date) => {
    const newRange = { ...customDateRange, [picker.type]: date };
    setCustomDateRange(newRange);
    setPicker({ visible: false, type: 'start' });

    if (newRange.start && newRange.end) {
      fetchPayouts(newRange.start, newRange.end);
    }
  };

  const renderFilterChip = ({ key, label }) => {
    const active = filter === key;
    return (
      <TouchableOpacity
        key={key}
        onPress={() => handleFilterChange(key)}
        style={[styles.chip, active && styles.chipActive]}
      >
        <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    const statusStyle = item.status === 'paid'
      ? { bg: '#E6F4EA', text: '#2E7D32' }
      : { bg: '#FFF5E5', text: '#FF8C00' };

    return (
      <View style={styles.refCard}>
        <View style={styles.refRow}>
          <Text style={styles.refName}>Booking #{item.booking_id}</Text>
          <View style={[styles.pill, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.pillText, { color: statusStyle.text }]}>
              {(item.status || '').toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.refMetaRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="calendar-outline" color="#94A3B8" size={14} style={{ marginRight: 4 }} />
            <Text style={styles.refDate}>{dayjs(item.date).format('DD MMM YYYY')}</Text>
          </View>

          <Text style={styles.refBonusAmount}>₹ {Number(item.amount).toLocaleString('en-IN')}</Text>
        </View>
      </View>
    );
  };


  const listEmpty = useMemo(
    () =>
      !loading ? (
        <View style={styles.emptyBox}>
          <Ionicons name="file-tray-outline" size={26} color="#9AA4B2" />
          <Text style={styles.emptyText}>No payouts found</Text>
        </View>
      ) : null,
    [loading]
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Navbar title="My Payouts" onBack={() => navigation.goBack()} />

      {/* Filters */}
      <View style={styles.filtersWrap}>
        {FILTERS.map(renderFilterChip)}
      </View>

      {/* Custom range */}
      {filter === 'custom' && (
        <View style={styles.rangeWrap}>
          <TouchableOpacity
            style={styles.rangeBtn}
            onPress={() => setPicker({ visible: true, type: 'start' })}
          >
            <Ionicons name="calendar-outline" size={18} color="#1A73E8" style={styles.rangeIcon} />
            <Text style={styles.rangeText}>
              {customDateRange.start ? dayjs(customDateRange.start).format('DD MMM YYYY') : 'Start Date'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rangeBtn}
            onPress={() => setPicker({ visible: true, type: 'end' })}
          >
            <Ionicons name="calendar-outline" size={18} color="#1A73E8" style={styles.rangeIcon} />
            <Text style={styles.rangeText}>
              {customDateRange.end ? dayjs(customDateRange.end).format('DD MMM YYYY') : 'End Date'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <DateTimePickerModal
        isVisible={picker.visible}
        mode="date"
        onConfirm={onConfirmDate}
        onCancel={() => setPicker({ visible: false, type: 'start' })}
      />

      {/* List */}
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={payouts}
          keyExtractor={(item, index) => `${item.booking_id}_${index}`}
          renderItem={renderItem}
          ListEmptyComponent={listEmpty}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
};

const StatusPill = ({ status }) => {
  const isPaid = status === 'paid';
  return (
    <View style={[styles.pill, isPaid ? styles.pillPaid : styles.pillPending]}>
      <Text style={[styles.pillText, isPaid ? styles.pillPaidText : styles.pillPendingText]}>
        {status?.toUpperCase() || '—'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F9FC',
  },

  // Filters
  filtersWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#E8F1FF',
    marginRight: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  chipActive: {
    backgroundColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  // Date range
  rangeWrap: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 10,
  },
  rangeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F1FF',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  rangeIcon: { marginRight: 8 },
  rangeText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },

  // List / cards
  listContent: {
    padding: 16,
  },
  refCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 2,
  },
  refRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  refName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  refMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  refDate: {
    fontSize: 13,
    color: '#64748B',
  },
  refBonusAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  pill: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
  },


  // Empty + loader
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyBox: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#9AA4B2', marginTop: 6 },
});

export default Payout;
