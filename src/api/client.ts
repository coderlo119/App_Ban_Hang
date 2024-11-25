import axios from "axios";
export const baseURL = "http://10.0.140.235:8000";

const client = axios.create({ baseURL });

export default client;
