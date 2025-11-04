import validator from "validator";

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
    amount: data.amount ?? 0,
    currency: validator.escape(data.currency ?? ''),
    provider: validator.escape(data.provider ?? ''),
    payee_account: validator.escape(data.payee_account ?? ''),
    swift_code: validator.escape(data.swift_code ?? '')
  };
}


