import { useEffect, useRef, useState } from 'react';
import { getFirestore, collection, query, where, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import notifee, { AndroidImportance, AndroidSound } from '@notifee/react-native';
import { playAlarm, stopAlarm } from '../utils/playAlarm';

const useAssignedBookingListener = () => {
    const [assignedTask, setAssignedTask] = useState(null);
    const notifiedTaskIdRef = useRef(null);

    useEffect(() => {
        let unsubscribe = null;

        const listenToAssignedBookings = async () => {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;

            const db = getFirestore();
            const q = query(
                collection(db, 'booking_requests'),
                where('firebase_uid', '==', user.uid),
                where('status', '==', 'pending')
            );

            unsubscribe = onSnapshot(q, async (snapshot) => {
                const bookings = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log('Assigned bookings:', bookings);
                const task = bookings[0];
                if (bookings.length > 0) {
                    if (notifiedTaskIdRef.current !== task.id) {
                    await notifee.displayNotification({
                        title: '🚨 New Booking Assigned!',
                        body: task.service_name || 'You have a new booking',
                        android: {
                            channelId: 'seeb-booking',
                            importance: AndroidImportance.HIGH,
                            sound: 'notificationsound', // match filename in /res/raw (no .mp3)
                            smallIcon: 'ic_launcher', // ensure your icon exists
                            ongoing: true,          // 🔒 Notification not dismissible by user
                            pressAction: {
                                id: 'default',
                                launchActivity: 'default', // Opens app on tap
                            },
                            autoCancel: false,
                        },
                        ios: {
                            sound: 'notificationsound.mp3', // iOS: must match filename added to bundle
                        },
                    });
                    playAlarm();

                    // 3. Set timeout to stop sound after 20 seconds
                    setTimeout(() => {
                        stopAlarm();
                    }, 20000);

                    notifiedTaskIdRef.current = task.id; // mark as notified
                    }

                    setAssignedTask({
                        ...task,
                        booking_id: task.booking_service_id,
                        service_name: task.service_name || 'False Ceiling Installation',
                        slot_date: task.slot_date || '2025-06-29',
                        slot_time: task.slot_time || '10:00 AM',
                        status: task.status || 'assigned',
                        amount: task.amount ?? 0,
                        description: task.description || 'Install gypsum ceiling in living room, 12x15 ft.',
                        customer: task.customer || {
                            name: 'Rahul Mehta',
                            mobile: '9876543210',
                            address: '12/3, MG Road, Pune, Maharashtra',
                        },
                    });
                } else {
                    setAssignedTask(null);
                }
            });
        };

        listenToAssignedBookings();

        return () => {
            if (unsubscribe) unsubscribe(); // 🔐 clean listener
        };
    }, []);

    return { assignedTask, setAssignedTask };
};

export default useAssignedBookingListener;
