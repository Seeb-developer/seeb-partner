export const formatAadhaar = (val) => val.replace(/\D/g, '').slice(0, 12).replace(/(\d{4})(?=\d)/g, '$1 ').trim();
export const formatPAN = (val) => val.toUpperCase();
export const formatDate = (isoDate) => {
    if (!isoDate || isoDate === '0000-00-00') return '';
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
};
export const isAdult = (dateStr) => {
    const [dd, mm, yyyy] = dateStr.split('/');
    const birthDate = new Date(`${yyyy}-${mm}-${dd}`);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    return age > 18 || (age === 18 && m >= 0);
};


export const parseDate = (str) => {
    const [dd, mm, yyyy] = str.split('/');
    return new Date(`${yyyy}-${mm}-${dd}`);
};

export const isValidAadhaar = (v) => /^\d{4} \d{4} \d{4}$/.test(v);
export const isValidPAN = (v) => /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v);
export const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export const capitalizeWord = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

