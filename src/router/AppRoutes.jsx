import React from "react";
import { Routes, Route } from "react-router-dom";
import StudentTable from "../pages/StudentTable";
import StudentProfile from "../pages/StudentProfile";
import AddEditStudent from "../pages/AddEditStudent";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<StudentTable />} />
      <Route path="/profile/:id" element={<StudentProfile />} />
      <Route path="/add-student" element={<AddEditStudent />} />
    </Routes>
  );
}

export default AppRoutes;
