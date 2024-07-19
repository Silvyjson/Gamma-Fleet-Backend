const Verification = (req, res, next) => {
  const { email, password } = req.body;

  let error = [];

  if (
    !email ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  ) {
    error.push({ message: "Invalid email" });
  }

  if (
    !password ||
    password.length < 6 ||
    !/(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[$#&])/.test(password)
  ) {
    error.push({
      message:
        "Password must be at least 6 characters long and must contain at least one number, one uppercase and one special character",
    });
  }

  if (error.length > 0) {
    return res.status(400).json(error);
  }

  next();
};

module.exports = Verification;
