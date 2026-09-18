import api from "./api";

export const submitExperience = async (data) => {
  const response = await api.post("/verifications/experience", data);
  return response.data;
};

export const sendOtp = async (data) => {
  const response = await api.post("/verifications/send-otp", data);
  return response.data;
};

export const verifyOtp = async (data) => {
  const response = await api.post("/verifications/verify-otp", data);
  return response.data;
};