// src/pages/TeacherLoad.jsx
import React, { useState } from "react";
import TeacherLoadTable from "../components/TeacherLoadTable";
import { parseScheduleFiles } from "../utils/loadCounter";

const TeacherLoad = () => {
  const [teacherLoad, setTeacherLoad] = useState(null);

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files);
    const loadData = await parseScheduleFiles(files);
    setTeacherLoad(loadData);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Педагогическая нагрузка</h1>
      <input
        type="file"
        multiple
        accept="application/json"
        onChange={handleFiles}
        className="mb-4"
      />
      {teacherLoad && <TeacherLoadTable data={teacherLoad} />}
    </div>
  );
};

export default TeacherLoad;
