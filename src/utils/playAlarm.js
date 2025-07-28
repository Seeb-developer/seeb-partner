// utils/playAlarm.js
import Sound from 'react-native-sound';

let alarmSound;

export const playAlarm = () => {
  alarmSound = new Sound('notificationsound.mp3', Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log('❌ Failed to load sound:', error);
      return;
    }
    alarmSound.setNumberOfLoops(-1); // infinite loop
    alarmSound.play((success) => {
      if (!success) console.log('❌ Sound playback failed');
    });
  });
};

export const stopAlarm = () => {
  if (alarmSound) {
    alarmSound.stop(() => {
      console.log('🛑 Alarm stopped');
    });
  }
};
