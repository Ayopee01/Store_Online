function validateLogin(form) {
  let errors = {};
  // Validation patterns
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailPattern.test(form.email)) {
    errors.email = "Invalid email format";
  }

  if (!form.password.trim()) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}
export default validateLogin;
