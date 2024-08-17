export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
export const validatePhoneNumber = (phoneNumber: string) => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format;
  return phoneRegex.test(phoneNumber);
};
export const validatePassword = (password: string) => {
// Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};
