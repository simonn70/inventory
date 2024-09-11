import axios from "axios";


export const sendSMS = async (message,recipient) => {
  const uelloSendUrl = "https://uellosend.com/quicksend/";
const api_key = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.=eyJkYXRhIjp7InVzZXJpZCI6MjAzOSwiYXBpU2VjcmV0IjoidzJFclZvcGhSSk1NPXhUIiwiaXNzdWVyIjoiVUVMTE9TRU5EIn19";
  const sender_id = "LaundryBowl";
  try {
    const response = await axios.post(uelloSendUrl, {
      api_key: api_key,
      sender_id: sender_id,
      message: message,
      recipient: recipient,
    });

    if (response.data.status === "200") {
      console.log("SMS sent successfully");
    } else {
      console.log(`Failed to send SMS: ${response.data.status}`);
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};


