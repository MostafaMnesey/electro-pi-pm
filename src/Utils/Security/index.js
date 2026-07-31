import bcrypt from "bcryptjs";


export const hashText = async ({ text, salt = process.env.SALT }) => {
  return await bcrypt.hash(text, Number(salt));
};

export const compareText = async ({ text, hash }) => {
  return await bcrypt.compare(text, hash);
};


