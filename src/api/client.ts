import axios from "axios";
export const baseURL = "http://10.150.3.75:8000";

const client = axios.create({ baseURL });

export default client;
