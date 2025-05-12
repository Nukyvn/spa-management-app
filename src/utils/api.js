import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
});

export const getServices = () => api.get("/services");
export const getCustomers = () => api.get("/customers");
export const createTransaction = (data) => api.post("/transactions", data);
export const getAppointments = () => api.get("/appointments");
export const getInventory = () => api.get("/inventory");
export const addService = (data) => api.post("/services", data);
export const updateService = (id, data) => api.put(`/services/${id}`, data);
export const deleteService = (id) => api.delete(`/services/${id}`);
export const addInventory = (data) => api.post("/inventory", data);
export const updateInventory = (id, data) => api.put(`/inventory/${id}`, data);
export const deleteInventory = (id) => api.delete(`/inventory/${id}`);
export const getRevenueReport = () => api.get("/reports/revenue");
export const getCashFlow = () => api.get("/cash-flow");
export const getTechnicians = () => api.get("/technicians");
export const addCustomer = (data) => api.post("/customers", data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);
export const addTechnician = (data) => api.post("/technicians", data);
export const getTechnicianCommissions = () => api.get("/reports/commissions");
export const addAppointment = (data) => api.post("/appointments", data);
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);