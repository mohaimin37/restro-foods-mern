import jwt from "jsonwebtoken";

// Signs a JWT and sets it as a secure httpOnly cookie (used for login/register/refresh)
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });

  const cookieDays = Number(process.env.JWT_COOKIE_EXPIRES_DAYS) || 30;

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: cookieDays * 24 * 60 * 60 * 1000,
  });

  return token;
};

export default generateToken;
