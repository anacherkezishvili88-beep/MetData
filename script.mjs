import { readFileSync, writeFileSync } from "fs";

// Reads the object-level data created by csvConvert.mjs.
const data = JSON.parse(readFileSync("./metObjects.json", "utf8"));
const departments = JSON.parse(readFileSync("./departments.json", "utf8"));

// These are the exact historical periods shown in the radar-chart reference.
// Object Begin Date is used; this is not the museum accession/acquisition year.
const periods = [
  { label: "before 3000 BCE", test: (year) => year < -3000 },
  { label: "3000–1000 BCE", test: (year) => year >= -3000 && year < -1000 },
  { label: "1000 BCE–1 CE", test: (year) => year >= -1000 && year < 1 },
  { label: "1–500", test: (year) => year >= 1 && year < 500 },
  { label: "500–1000", test: (year) => year >= 500 && year < 1000 },
  { label: "1000–1400", test: (year) => year >= 1000 && year < 1400 },
  { label: "1400–1600", test: (year) => year >= 1400 && year < 1600 },
  { label: "1600–1800", test: (year) => year >= 1600 && year < 1800 },
  { label: "1800–1900", test: (year) => year >= 1800 && year < 1900 },
  { label: "1900–2000", test: (year) => year >= 1900 && year < 2000 },
  { label: "2000+", test: (year) => year >= 2000 }
];

const outputData = departments.map((department) => {
  const departmentObjects = data.filter((row) => row.department === department);

  const counts = Object.fromEntries(periods.map((period) => [period.label, 0]));

  for (const row of departmentObjects) {
    const year = Number(row.year);
    if (!Number.isFinite(year)) continue;

    const period = periods.find((item) => item.test(year));
    if (period) counts[period.label]++;
  }

  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const shares = Object.fromEntries(
    periods.map((period) => [
      period.label,
      total ? Number(((counts[period.label] / total) * 100).toFixed(2)) : 0
    ])
  );

  return { department, counts, shares, total };
});

writeFileSync(
  "output.json",
  JSON.stringify(
    {
      periods: periods.map((period) => period.label),
      departments: outputData
    },
    null,
    2
  )
);

console.log(`Processed ${data.length.toLocaleString()} dated objects.`);
console.log(`Created exact-period counts and percentages for ${outputData.length} departments.`);
console.log("Wrote output.json for the Chart.js radar chart.");
