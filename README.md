This project visualizes the age profile of each department in The Metropolitan Museum of Art. The website uses a Chart.js radar chart to compare the percentage of each department's dated objects across historical periods.

I used the file named `MetObjects.csv` which is the original collection of all the Met objects in a CSV format; I keep this file in the project folder locally, but I didn't upload it to github cause it's too large. 
The file named `csvConvert.mjs` extracts the department, accession year, and object creation date from the CSV into `metObjects.json`, and creates `departments.json`. Which is just a way of filtering the data and using just the parts of the data that I need. 
The file: `script.mjs` groups each object's creation date into the exact historical periods used by the chart, calculates counts and percentages, and writes `output.json`.
`index.html` the basic website and the Chart.js radar-chart website.
`output.json` — the processed chart data used by the website.
`departments.json`, `package.json`, and `package-lock.json` are the files that support data and Node/npm setup files.


I installed the dependency once with `npm install`. Kept `MetObjects.csv` in this folder, then ran:

```bash
npm run build-data
```

This ran `csvConvert.mjs` and then `script.mjs` to regenerate `metObjects.json`, `departments.json`, and `output.json`. For local testing, so the browser was able to fetch `output.json`.


The visualization uses `Object Begin Date` (when the object was created, as recorded in the dataset), not `AccessionYear` (when the museum acquired it). Objects without a valid creation date are excluded.

The tools I used are: 
- **Chart.js**: https://www.chartjs.org/
- **The Metropolitan Museum of Art Open Access**: https://github.com/metmuseum/openaccess
- **ChatGPT (OpenAI)**: used to help create the Chart.js radar charts and department selection controls.  Example prompt: “Teach me how to make an interactive Chart.js radar chart comparing up to four departments by the percentage of objects from each historical period.”
- All the data processing was done by myself and with help of my instructor
