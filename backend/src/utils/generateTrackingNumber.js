import crypto from 'crypto';

const generateTrackingNumber = () => {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = crypto.randomBytes(5).toString('hex').substring(0, 9);
  return `SP${year}${random}`.toUpperCase();
};

export default generateTrackingNumber;
