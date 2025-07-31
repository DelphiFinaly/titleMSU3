// src/components/TeacherLoadTable.jsx
import React from "react";

const TeacherLoadTable = ({ data }) => {
  return (
    <table className="table-auto w-full border border-collapse border-gray-400">
      <thead>
        <tr className="bg-gray-200">
          <th className="border p-2">Преподаватель</th>
          <th className="border p-2">Предмет</th>
          <th className="border p-2">Очно</th>
          <th className="border p-2">Онлайн</th>
          <th className="border p-2">Итого</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([teacher, subjects]) =>
          Object.entries(subjects)
            .filter(([key]) => key !== "итого")
            .map(([subject, types], idx) => (
              <tr key={`${teacher}-${subject}`} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border p-2">{teacher}</td>
                <td className="border p-2">{subject}</td>
                <td className="border p-2">{types.очно || 0}</td>
                <td className="border p-2">{types.онлайн || 0}</td>
                <td className="border p-2">{(types.очно || 0) + (types.онлайн || 0)}</td>
              </tr>
            ))
        )}
      </tbody>
    </table>
  );
};

export default TeacherLoadTable;
