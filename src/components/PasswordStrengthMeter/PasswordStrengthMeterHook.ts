export const calculateStrength = (password: string) => {
  let strength = 0;

  if (password.length >= 8) strength += 1;
  if (/[a-z]/.test(password)) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/\d/.test(password)) strength += 1;
  if (/[\W_]/.test(password)) strength += 1;

  return strength;
};

export const getStrengthLabel = (strength: number) => {
  if (strength === 1) {
    return "Muito fraca";
  } else if (strength === 2) {
    return "Fraca";
  } else if (strength === 3 || strength === 4) {
    return "Regular";
  } else if (strength === 5) {
    return "Forte";
  } else {
    return "";
  }
};
