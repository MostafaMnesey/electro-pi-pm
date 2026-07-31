export const googleVerify = async (token) => {
  try {
    const { OAuth2Client } = await import("google-auth-library");
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return payload;
  } catch (error) {
    return null;
  }
};
