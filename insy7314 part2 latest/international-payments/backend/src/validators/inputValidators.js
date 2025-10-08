// backend/src/validators/inputValidators.js
import validator from "validator";

export function validateRegistration({ full_name, id_number, account_number, password }) {
  if (!full_name || !id_number || !account_number || !password) return false;

  // allow letters, spaces, apostrophes and hyphens
  const namePattern = /^[A-Za-z\s'-]{2,100}$/;
  // ID and account numbers: digits only, between 6 and 50 chars
  const idPattern = /^[0-9]{6,50}$/;
  const accPattern = /^[0-9]{6,50}$/;

  if (!namePattern.test(full_name) || !idPattern.test(id_number) || !accPattern.test(account_number)) {
    return false;
  }

  // enforce reasonably strong password
  return validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 0,
    minNumbers: 1,
    minSymbols: 0
  });
}

export function validatePayment({ amount, currency, provider, payee_account, swift_code }) {
  if (amount === undefined || currency === undefined || provider === undefined || !payee_account || !swift_code) {
    return false;
  }

  // numeric amount > 0 and reasonable upper bound
  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0 || amt > 1000000000) return false;

  // currency ISO3 upper-case
  if (!/^[A-Z]{3}$/.test(String(currency).toUpperCase())) return false;

  if (!/^[A-Za-z\s'-]{2,50}$/.test(provider)) return false;

  if (!/^[0-9]{6,50}$/.test(payee_account)) return false;

  // SWIFT/BIC: 8 or 11 chars alphanumeric uppercase
  if (!/^[A-Z0-9]{8,11}$/.test(swift_code)) return false;

  return true;
}
