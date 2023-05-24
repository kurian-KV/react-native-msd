import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToStorage = async (key: string, value: string) => {
  try {
    const result = await AsyncStorage.setItem(key, value);
    return result;
  } catch (err) {
    return null;
  }
};

export const getFromStorage = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch (err) {
    return null;
  }
};

export const generateAndSaveMadId = async () => {
  let MADid = await getFromStorage('MAD_UUID');
  if (!MADid) {
    MADid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // eslint-disable-next-line no-bitwise, prettier/prettier
      const r = Math.random() * 16 | 0 ;
      // eslint-disable-next-line no-bitwise, prettier/prettier
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    await saveToStorage('MAD_UUID', MADid);
  }
};
