// src/utils/loadCounter.js
export async function parseScheduleFiles(files) {
  const fileHashes = new Set();
  const mergedLessons = [];

  for (const file of files) {
    const content = await file.text();
    const hash = await sha1(content);
    if (fileHashes.has(hash)) continue;
    fileHashes.add(hash);
    try {
      const json = JSON.parse(content);
      mergedLessons.push(json);
    } catch (e) {
      console.warn("Невозможно разобрать файл:", file.name);
    }
  }

  const loadMap = {};

  mergedLessons.forEach(schedule => {
    for (const date in schedule) {
      const groups = schedule[date];
      for (const group in groups) {
        const lessons = groups[group];
        for (const pairNum in lessons) {
          const { lesson, teacher, online } = lessons[pairNum];
          if (!Array.isArray(teacher)) continue;
          const hours = 1.5;
          teacher.forEach(name => {
            if (!loadMap[name]) loadMap[name] = {};
            if (!loadMap[name][lesson]) loadMap[name][lesson] = { очно: 0, онлайн: 0 };
            if (online) loadMap[name][lesson].онлайн += hours;
            else loadMap[name][lesson].очно += hours;
          });
        }
      }
    }
  });

  for (const teacher in loadMap) {
    let total = 0;
    for (const subject in loadMap[teacher]) {
      const entry = loadMap[teacher][subject];
      total += entry.очно + entry.онлайн;
    }
    loadMap[teacher]["итого"] = total;
  }

  return loadMap;
}

async function sha1(str) {
  const buffer = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest("SHA-1", buffer);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}
