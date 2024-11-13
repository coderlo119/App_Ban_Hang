import axios from "axios";
export const baseURL = "http://10.0.119.194:8000";

const client = axios.create({ baseURL });

export default client;
