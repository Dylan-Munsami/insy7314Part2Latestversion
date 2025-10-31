import validator from "validator";

export function validateRegistration({ full_name, id_number, account_number, password }) {
  const namePattern = /^[A-Za-z\s]{2,100}$/;
  const idPattern = /^[0-9]{6,20}$/;
  const accPattern = /^[0-9]{6,20}$/;

  if (!namePattern.test(full_name) || !idPattern.test(id_number) || !accPattern.test(account_number)) {
    return false;
  }

  return validator.isStrongPassword(password, { minLength: 8 });
}

export function sanitizeRegistration(data) {
  return {
    full_name: validator.escape(data.full_name),
    id_number: validator.escape(data.id_number),
    account_number: validator.escape(data.account_number),
    password: data.password
  };
}

export function validatePayment({ amount, currency, provider, payee_account, swift_code }) {
  return (
    validator.isNumeric(amount.toString()) &&
    /^[A-Z]{3}$/.test(currency) &&
    /^[A-Za-z\s]{3,50}$/.test(provider) &&
    /^[0-9]{6,30}$/.test(payee_account) &&
    /^[A-Z0-9]{8,11}$/.test(swift_code)
  );
}

export function sanitizePayment(data) {
  return {
    amount: data.amount,
    currency: validator.escape(data.currency),
    provider: validator.escape(data.provider),
    payee_account: validator.escape(data.payee_account),
    swift_code: validator.escape(data.swift_code)
  };
}
