import jwt from "jsonwebtoken";

export const tokenTypeEnum = {
  access: "access",
  refresh: "refresh",
};

export const generateToken = ({ user, tokenType = tokenTypeEnum.access }) => {
  const secret = tokenType === tokenTypeEnum.access
    ? process.env.JWT_SECRET_ACCESS
    : process.env.JWT_SECRET_REFRESH;

  return jwt.sign({ id: user.id }, secret, {
    expiresIn: tokenType === tokenTypeEnum.access ? "1d" : "7d",
  });
};

export const verifyToken = ({ token, tokenType = tokenTypeEnum.access }) => {
  const secret = tokenType === tokenTypeEnum.access
    ? process.env.JWT_SECRET_ACCESS
    : process.env.JWT_SECRET_REFRESH;

  return jwt.verify(token, secret);
};

export const generateTokensForUser = ({ user }) => {
  const accessToken = generateToken({ user, tokenType: tokenTypeEnum.access });
  const refreshToken = generateToken({ user, tokenType: tokenTypeEnum.refresh });
  return { accessToken, refreshToken };
};