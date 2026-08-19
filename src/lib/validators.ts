/**
 * Type-safe validation utility for runtime form checking & API payloads
 */

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateContactForm(data: {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (data.phone && data.phone.trim().length > 0) {
    const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]*$/;
    if (!phoneRegex.test(data.phone.trim()) || data.phone.trim().length < 7) {
      errors.phone = 'Please provide a valid contact phone number.';
    }
  }

  if (!data.message || data.message.trim().length < 5) {
    errors.message = 'Message must be at least 5 characters long.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateLoginForm(data: {
  emailOrPhone?: string;
  password?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.emailOrPhone || data.emailOrPhone.trim().length < 3) {
    errors.emailOrPhone = 'Please enter a valid email address or phone number.';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateRegisterForm(data: {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please provide a valid email address.';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long.';
  }

  if (data.confirmPassword !== undefined && data.confirmPassword !== data.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
