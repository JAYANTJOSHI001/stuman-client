import React from "react";
import { Link } from "react-router-dom";

const StudentCard = ({ student }) => (
  <div className="border p-4 rounded shadow bg-white dark:bg-gray-700">
    <h3 className="text-lg font-bold">{student.name}</h3>
    <p>Email: {student.email}</p>
    <p>Phone: {student.phone}</p>
    <p>Handle: {student.cfHandle}</p>
    <p>Current Rating: {student.currentRating}</p>
    <p>Max Rating: {student.maxRating}</p>
    <Link to={`/profile/${student._id}`} className="text-blue-500 mt-2 inline-block">View More</Link>
  </div>
);

export default StudentCard;