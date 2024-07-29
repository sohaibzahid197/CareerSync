const axios = require("axios");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const initiateZoomMeeting = async () => {
  try {
    const authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
    return { authUrl };
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getZoomOAuthTokens = async (code) => {
  try {
    const response = await axios.post("https://zoom.us/oauth/token", null, {
      params: {
        code: code,
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data;
  } catch (error) {
    console.error(error.response.data);
    throw error;
  }
};

const createZoomMeeting = async (accessToken, topic) => {
  try {
    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic: topic,
        type: 2,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.join_url;
  } catch (error) {
    console.error(error.response.data);
    throw error;
  }
};

module.exports = {
  initiateZoomMeeting,
  getZoomOAuthTokens,
  createZoomMeeting,
};