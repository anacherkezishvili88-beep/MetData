# Met Collection Atlas

This project visualizes the age profile of departments in The Metropolitan Museum of Art's collection. The website uses a Chart.js radar chart to compare the percentage of each department's dated objects across historical periods. Visitors can select up to four departments and hover over chart points to see percentages and object counts.

## Files and setup

- `MetObjects.csv` — the original collection CSV; keep this file in the project folder locally, but do not commit a huge file to GitHub unless your instructor asks you to.
- `csvConvert.mjs` — extracts the department, accession year, and object creation date from the CSV into `metObjects.json`, and creates `departments.json`.
- `script.mjs` — groups each object's creation date into the exact historical periods used by the chart, calculates counts and percentages, and writes `output.json`.
- `index.html` — the Chart.js radar-chart website.
- `output.json` — the processed chart data used by the website.
- `departments.json`, `package.json`, and `package-lock.json` — supporting data and Node/npm setup files.

## Run the data processing

Install the dependency once with `npm install`. Keep `MetObjects.csv` in this folder, then run:

```bash
npm run build-data
```

This runs `csvConvert.mjs` and then `script.mjs` to regenerate `metObjects.json`, `departments.json`, and `output.json`. For local testing, open the folder in VS Code and serve it with Live Server or another local web server, so the browser can fetch `output.json`.

## Publish with GitHub Pages

Commit `index.html`, `output.json`, `README.md`, and the supporting project files needed for your submission. In the repository's **Settings → Pages**, publish from your main branch and root folder. The browser loads Chart.js from its CDN.

## Data and interpretation

The visualization uses `Object Begin Date` (when the object was created, as recorded in the dataset), not `AccessionYear` (when the museum acquired it). Objects without a valid creation date are excluded. The chart displays each period as a share of the dated objects in that department, making departments of different sizes easier to compare.

## Tools and resources

- **Chart.js**: https://www.chartjs.org/
- **The Metropolitan Museum of Art Open Access**: https://www.metmuseum.org/about-the-met/policies-and-documents/open-access
- **ChatGPT (OpenAI)**: used to help extend the existing scripts and create the Chart.js radar chart, department selection controls, tooltip labels, CSS styling, and this README. Example prompt: “Build on my existing Met Museum data-processing scripts and make an interactive Chart.js radar chart comparing up to four departments by the percentage of objects from each historical period.”

Update this section to accurately disclose any additional tutorials, libraries, or resources you use.
