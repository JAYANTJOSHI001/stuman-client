import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// CRUD
export const getAllStudents = async () => {
  const res = await API.get("/students");
  return res.data;
};

export const addStudent = async (student) => {
  const res = await API.post("/students", student);
  return res.data;
};

export const updateStudent = async (id, student) => {
  const res = await API.put(`/students/${id}`, student);
  return res.data;
};

export const deleteStudent = async (id) => {
  const res = await API.delete(`/students/${id}`);
  return res.data;
};

export const getStudentProfile = async (id) => {
  const res = await API.get(`/students/${id}/profile`);
  return res.data;
};

export const getStudentPro = async (id) => {
  const res = await API.get(`/students/${id}/pro`);
  return res.data;
};

export const triggerSync = async () => {
  const res = await API.post("/sync");
  return res.data;
};
