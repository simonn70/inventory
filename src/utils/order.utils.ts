import axios from "axios";
import { connectToDatabase } from "../database";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export const initializePayment = async (paymentData) => {
  const response = await axios.post(
    'https://api.paystack.co/transaction/initialize',
    paymentData,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    }
  );

  return response.data;
};
export const verifyPayment = async (reference) => {

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );
  
    return response.data;
  };