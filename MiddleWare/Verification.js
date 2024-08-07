const Verification = (req, res, next) => {
  const { email, password } = req.body;

  let error = [];

  if (
    !email ||
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
  ) {
    error.push({ message: "Invalid email" });
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;

  if (!password || !passwordRegex) {
    error.push({
      message:
        "Password must be at least 8 characters long and must contain at least one number, one uppercase and one special character",
    });
  }

  if (error.length > 0) {
    return res.status(400).json(error);
  }

  next();
};

module.exports = Verification;
