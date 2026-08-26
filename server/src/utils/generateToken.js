import jwt from "jsonwebtoken";
import env from "../config/environment.js";

const generateToken = (user) => {
  const payload = {
    id: user._id.toString(),
    role: user.role,
  };

  return jwt.sign(payload, env.jwtSecretKey, {
    expiresIn: "7d",
  });
};

export default generateToken;