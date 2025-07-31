import React, { useState } from "react";
import ExcelUpload from "./components/ExcelUpload";
import ScheduleForm from "./components/ScheduleForm";
import ScheduleTable from "./components/ScheduleTable";
import ExportToWord from "./components/ExportToWord";
import ExportWeekToWord from "./components/ExportWeekToWord";
import SliderDays from "./components/SliderDays";
import ExportToJson from "./components/ExportToJson";
import ExportWeekToJson from "./components/ExportWeekToJson";
import ImportWeekFromJson from "./components/ImportWeekFromJson";
import TeacherLoad from "./pages/TeacherLoad";
import { useSchedule } from "./context/ScheduleContext";

function getMonday(d) {
  d = new Date(d);
  const day = d.getDay() || 7;
  if (day !== 1) d.setDate(d.getDate() - (day - 1));
  return d;
}

export default function App() {
  const [excelData, setExcelData] = useState({ lessons: [], teachers: [], rooms: [] });
  const { schedule, setSchedule } = useSchedule();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [showTeacherLoad, setShowTeacherLoad] = useState(false);

  const monday = getMonday(selectedDate);
  const weekDates = Array.from({ length: 6 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });

  function handleSliderChange(idx) {
    setActiveDayIdx(idx);
    setSelectedDate(weekDates[idx]);
  }

  function handleAddToSchedule({ date, group, pairNum, lesson, teacher, room, online }) {
  const dateKey = new Date(date).toISOString().slice(0, 10); // Преобразуем дату в строку
  setSchedule(prev => {
    const updatedSchedule = {
      ...prev,
      [dateKey]: {
        ...(prev[dateKey] || {}),
        [group]: {
          ...(prev[dateKey]?.[group] || {}),
          [pairNum]: { lesson, teacher, room, online }
        }
      }
    };
    console.log('Updated schedule:', updatedSchedule); // Логируем обновлённое состояние
    return updatedSchedule; // Возвращаем обновлённое состояние
  });
}


  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Table MSU</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-4 rounded"
          onClick={() => setShowTeacherLoad(!showTeacherLoad)}
        >
          {showTeacherLoad ? "Назад к расписанию" : "Пед. нагрузка"}
        </button>
      </div>

      {showTeacherLoad ? (
        <TeacherLoad />
      ) : (
        <div style={{ display: "flex", minHeight: "100vh" }}>
          <div className="left-panel">
            <h2>Table MSU</h2>
            <ExcelUpload setExcelData={setExcelData} />
            <label style={{ marginTop: 18, fontWeight: "bold" }}>Календарь даты:
              <input
                type="date"
                value={selectedDate.toISOString().slice(0, 10)}
                onChange={e => {
                  setSelectedDate(new Date(e.target.value));
                  const monday = getMonday(new Date(e.target.value));
                  const d = new Date(e.target.value);
                  const idx = Math.max(0, Math.min(5, Math.floor((d - monday) / (1000 * 60 * 60 * 24))));
                  setActiveDayIdx(idx);
                }}
                style={{ marginLeft: 8 }}
              />
            </label>
            <ScheduleForm
              lessons={excelData.lessons}
              teachers={excelData.teachers}
              rooms={excelData.rooms}
              date={selectedDate}
              onAdd={handleAddToSchedule}
            />
            <div className="flex gap-2 mt-4 flex-wrap">
              <ExportToWord schedule={schedule} date={selectedDate} />
              <ExportWeekToWord schedule={schedule} weekDates={weekDates} />
              <ExportToJson schedule={schedule} date={selectedDate} />
              <ExportWeekToJson schedule={schedule} weekDates={weekDates} />
              <ImportWeekFromJson setSchedule={setSchedule} />
            </div>
          </div>

          <div className="right-panel" style={{ flexGrow: 1, paddingLeft: 24 }}>
            <SliderDays weekDates={weekDates} activeIdx={activeDayIdx} setActiveIdx={handleSliderChange} />
            <ScheduleTable date={selectedDate} schedule={schedule} />
          </div>
        </div>
      )}
    </div>
  );
}
