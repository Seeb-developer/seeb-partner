// screens/ReferralAndEarnScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Alert,
  FlatList,
  ActivityIndicator,
  LayoutAnimation,
  UIManager,
  Platform,
  RefreshControl,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';
import Navbar from '../../component/Navbar';
import Ionicons from 'react-native-vector-icons/Ionicons';
// import Clipboard from '@react-native-clipboard/clipboard';
import dayjs from 'dayjs';
import { get, getPartnerId } from '../../utils/api';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const STATUS_COLORS = {
  paid: { bg: '#E6F4EA', text: '#2E7D32' },
  pending: { bg: '#FFF5E5', text: '#FF8C00' },
  registered: { bg: '#EAF4FF', text: '#1A73E8' },
  verified: { bg: '#E6F4EA', text: '#2E7D32' },
  onboarded: { bg: '#F2F4F7', text: '#111' },
};

const ReferralAndEarnScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [referralCode, setReferralCode] = useState('SEEB1234');
  const [stats, setStats] = useState({
    total_referred: 0,
    total_bonus_earned: 0,
    total_bonus_paid: 0,
    total_bonus_pending: 0,
  });

  const [referrals, setReferrals] = useState([]);
  const [payouts, setPayouts] = useState([]);

  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteMobile, setInviteMobile] = useState('');

  const handleInvite = async () => {
    if (!inviteName || !inviteMobile) {
      Alert.alert('Missing Info', 'Please enter name and mobile number');
      return;
    }

    try {
      const partnerId = await getPartnerId();
      const res = await post(`referrals/invite`, {
        partner_id: partnerId,
        name: inviteName,
        mobile: inviteMobile,
      });

      if (res?.status === 200) {
        Alert.alert('Success', 'Invite sent successfully!');
        setInviteName('');
        setInviteMobile('');
        fetchAll();
      } else {
        Alert.alert('Error', res?.message || 'Failed to send invite');
      }
    } catch (err) {
      console.error('Invite Error:', err);
      Alert.alert('Error', 'Something went wrong');
    }
  };


  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      const partnerId = await getPartnerId();

      // Replace with your real endpoint
      const res = await get(`referral/summary/${partnerId}`);

      if (res?.status === 200 && res.data) {
        const d = res.data;
        setReferralCode(d.referral_code ?? 'SEEB1234');
        setStats({
          total_referred: d.total_referred ?? 0,
          total_bonus_earned: d.total_bonus_earned ?? 0,
          total_bonus_paid: d.total_bonus_paid ?? 0,
          total_bonus_pending: d.total_bonus_pending ?? 0,
        } ?? stats);
        setReferrals(d.referrals ?? []);
        setPayouts(d.payouts ?? []);
      } else {
        loadMock();
      }
      // loadMock();
    } catch (e) {
      console.log('referral fetch error', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadMock = () => {
    setReferralCode('SEEB1234');
    setStats({
      total_referred: 3,
      total_bonus_earned: 1500,
      total_bonus_paid: 1000,
      total_bonus_pending: 500,
    });
    setReferrals([
      {
        id: 1,
        name: 'Ravi Kumar',
        mobile: '9876543210',
        joined_at: '2025-07-14',
        status: 'verified',
        bonus_amount: 500,
        bonus_status: 'paid',
      },
      {
        id: 2,
        name: 'Aditi Sharma',
        mobile: '9898989898',
        joined_at: '2025-07-20',
        status: 'registered',
        bonus_amount: 500,
        bonus_status: 'pending',
      },
      {
        id: 3,
        name: 'Harsh Jain',
        mobile: '9090909090',
        joined_at: '2025-07-22',
        status: 'onboarded',
        bonus_amount: 500,
        bonus_status: 'pending',
      },
    ]);
    setPayouts([
      { id: 11, amount: 500, date: '2025-07-23', status: 'paid' },
      { id: 12, amount: 500, date: '2025-07-26', status: 'pending' },
    ]);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAll();
  };

  const copyCode = () => {
    Clipboard.setString(referralCode);
    Alert.alert('Copied', 'Referral code copied!');
  };

  const shareCode = () => {
    Share.share({
      message: `Join Seeb Partner & earn with me! Use my referral code ${referralCode} while signing up. https://partner.seeb.in`,
    });
  };

  const toggleSection = (setter) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setter((v) => !v);
  };

  const renderReferralItem = ({ item }) => {
    const st =
      STATUS_COLORS[item.bonus_status?.toLowerCase?.()] || STATUS_COLORS['pending'];
    const userSt =
      STATUS_COLORS[item.status?.toLowerCase?.()] || STATUS_COLORS['registered'];

    return (
      <View style={styles.refCard}>
        <View style={styles.refRow}>
          <Text style={styles.refName}>{item.name}</Text>
          <View style={[styles.pill, { backgroundColor: userSt.bg }]}>
            <Text style={[styles.pillText, { color: userSt.text }]}>
              {(item.status || '').toUpperCase()}
            </Text>
          </View>
        </View>
        <Text style={styles.refMobile}>{item.mobile}</Text>

        <View style={styles.refMetaRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="calendar-outline" color="#94A3B8" size={14} style={{ marginRight: 4 }} />
            <Text style={styles.refDate}>
              {dayjs(item.joined_at).format('DD MMM YYYY')}
            </Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.refBonusAmount}>₹ {item.bonus_amount}</Text>
            <View style={[styles.pill, { backgroundColor: st.bg, marginLeft: 8 }]}>
              <Text style={[styles.pillText, { color: st.text }]}>
                {(item.bonus_status || '').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderPayoutItem = ({ item }) => {
    const st = STATUS_COLORS[item.status?.toLowerCase?.()] || STATUS_COLORS['pending'];
    return (
      <View style={styles.payoutItem}>
        <View>
          <Text style={styles.payoutAmount}>₹ {item.amount}</Text>
          <Text style={styles.payoutDate}>
            {dayjs(item.date).format('DD MMM YYYY')}
          </Text>
        </View>
        <View style={[styles.pill, { backgroundColor: st.bg }]}>
          <Text style={[styles.pillText, { color: st.text }]}>
            {(item.status || '').toUpperCase()}
          </Text>
        </View>
      </View>
    );
  };

  const StatTile = ({ label, value }) => (
    <View style={styles.statTile}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  const StepItem = ({ index, text }) => (
    <View style={styles.stepItem}>
      <View style={styles.stepCircle}>
        <Text style={styles.stepNum}>{index}</Text>
      </View>
      <Text style={styles.stepText}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Navbar title="Referral & Earn" onBack={() => navigation.goBack()} />
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={referrals}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderReferralItem}
          ListHeaderComponent={
            <>
              {/* Referral Code Card */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>Your Referral Code</Text>

                <View style={styles.codeBox}>
                  <Text style={styles.codeText}>{referralCode}</Text>
                  <TouchableOpacity onPress={copyCode} style={styles.iconBtn}>
                    <Ionicons name="copy-outline" size={18} color="#007AFF" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.shareBtn} onPress={() => navigation.navigate('InvitePartnerScreen')}>
                  <Ionicons name="send-outline" size={18} color="#000" />
                  <Text style={styles.shareBtnText}>Send Invite</Text>
                </TouchableOpacity>

              </View>


              {/* Stats */}
              <View style={styles.statsWrap}>
                <StatTile label="Total Referred" value={stats.total_referred} />
                <StatTile label="Bonus Earned" value={`₹ ${stats.total_bonus_earned}`} />
                <StatTile label="Paid" value={`₹ ${stats.total_bonus_paid}`} />
                <StatTile label="Pending" value={`₹ ${stats.total_bonus_pending}`} />
              </View>

              {/* Referral List Label */}
              <View style={styles.listHeader}>
                <Text style={styles.sectionTitle}>Your Referrals</Text>
                <Text style={styles.sectionSub}>{referrals.length} people</Text>
              </View>

              {referrals.length === 0 && (
                <View style={styles.emptyBox}>
                  <Ionicons name="people-outline" size={24} color="#9AA4B2" />
                  <Text style={styles.emptyText}>No referrals yet</Text>
                </View>
              )}
            </>
          }
          ListFooterComponent={
            <>
              {/* Payouts */}
              {!!payouts.length && (
                <View style={styles.card}>
                  <Text style={styles.sectionTitle}>Referral Payouts</Text>
                  {payouts.map((p) => (
                    <View key={p.id} style={{ marginTop: 12 }}>
                      {renderPayoutItem({ item: p })}
                    </View>
                  ))}
                </View>
              )}

              {/* How it works */}
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => toggleSection(setShowHowItWorks)}
                activeOpacity={0.8}
              >
                <Text style={styles.sectionTitle}>How it works</Text>
                <Ionicons
                  name={showHowItWorks ? 'chevron-up-outline' : 'chevron-down-outline'}
                  size={18}
                  color="#64748B"
                />
              </TouchableOpacity>
              {showHowItWorks && (
                <View style={styles.accordionBody}>
                  <StepItem index={1} text="Share your referral code or link with your friends." />
                  <StepItem index={2} text="They sign up and complete onboarding." />
                  <StepItem index={3} text="After their first job completion, the bonus gets unlocked." />
                  <StepItem index={4} text="Your bonus is credited to your payout wallet." />
                </View>
              )}

              {/* Terms */}
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => toggleSection(setShowTerms)}
                activeOpacity={0.8}
              >
                <Text style={styles.sectionTitle}>Terms & Conditions</Text>
                <Ionicons
                  name={showTerms ? 'chevron-up-outline' : 'chevron-down-outline'}
                  size={18}
                  color="#64748B"
                />
              </TouchableOpacity>
              {showTerms && (
                <View style={styles.accordionBody}>
                  <Text style={styles.tcPoint}>
                    • Bonus is payable only after the referred partner completes verification and first successful service.
                  </Text>
                  <Text style={styles.tcPoint}>
                    • Seeb reserves the right to change or withdraw the program.
                  </Text>
                  <Text style={styles.tcPoint}>
                    • Fraudulent referrals will be disqualified.
                  </Text>
                </View>
              )}

              <View style={{ height: 40 }} />
            </>
          }
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F9FC' },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 2,
  },

  // Referral code
  codeBox: {
    marginTop: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#007AFF',
    borderRadius: 10,
    backgroundColor: '#F0F8FF',
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeText: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#007AFF',
  },
  iconBtn: { padding: 4 },

  shareBtn: {
    flexDirection: 'row',
    backgroundColor: '#FFE0B2',
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareBtnText: {
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
    fontSize: 15
  },

  // Stats
  statsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 16,
  },
  statTile: {
    flexBasis: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    elevation: 2,
  },
  statValue: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  statLabel: { marginTop: 4, color: '#64748B', fontSize: 12, fontWeight: '500' },

  // Sections
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  sectionSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  listHeader: {
    marginTop: 24,
    marginBottom: 8,
  },

  // Referral list item
  refCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },
  refRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  refName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  refMobile: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 13,
  },
  refMetaRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  refDate: { color: '#94A3B8', fontSize: 12 },
  refBonusAmount: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 14,
  },

  // Pill
  pill: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  pillText: {
    fontWeight: '700',
    fontSize: 11,
  },

  // Payout list
  payoutItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  payoutAmount: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 16,
  },
  payoutDate: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },

  // Accordions
  accordionHeader: {
    marginTop: 20,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accordionBody: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  stepItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  stepNum: { color: '#fff', fontWeight: '700', fontSize: 12 },
  stepText: { color: '#334155', fontSize: 13, flex: 1 },
  tcPoint: { color: '#334155', fontSize: 13, marginBottom: 8 },

  emptyBox: { alignItems: 'center', marginTop: 20 },
  emptyText: { color: '#94A3B8', marginTop: 6, fontSize: 13 },
});

export default ReferralAndEarnScreen;
