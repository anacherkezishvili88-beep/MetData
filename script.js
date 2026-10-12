// colors for each department

const colors = [
  "#E9B94F", // Golden amber
  "#82709B", // Deep lavender
  "#79A7A8", // Muted teal
  "#B5A0BE", // Dusty lavender
  "#A6B99B", // Sage green
  "#819DBD", // Dusty blue
  "#D4A96B", // Soft ochre
  "#A99F91", // Warm taupe
  "#C58D83", // Muted terracotta
  "#94B8A7", // Soft sea green
  "#D6C16A", // Antique gold
  "#9B91B5", // Muted violet
  "#71969A", // Deep muted teal
  "#C5AE92", // Sand
  "#B9A1AC", // Dusty rose
  "#8DA0B5", // Slate blue
  "#D8B875", // Pale amber
  "#A3AD8C", // Olive sage
  "#9D8CA9"  // Soft plum
];

//elements of the page
const buttonArea = document.getElementById("departmentButtons");
const status = document.getElementById("selectionStatus");
const canvas = document.getElementById("radarChart");

//selection of data

let atlas;
let periods = [];
let departments = [];

const defaultDepartments = [
  "Egyptian Art",
  "Greek and Roman Art",
  "Asian Art",
  "The American Wing"
];

let selected = new Set(defaultDepartments);


//radar chart rendering

function renderChart() {

  // Find the currently selected departments.

  const activeDepartments = departments.filter(department =>
    selected.has(department.department)
  );

  // Update the selection counter.

  status.textContent =
    `${activeDepartments.length} of 4 departments selected`;

  // Destroy the previous chart before redrawing it.

  if (atlas) {
    atlas.destroy();
  }

  // Create a new radar chart using Chart.js.

  atlas = new Chart(canvas, {

    type: "radar",

    data: {

      labels: periods,

      datasets: activeDepartments.map(department => {

        const index = departments.indexOf(department);
        const color = colors[index % colors.length];

        return {

          label: department.department,

          // Percentage of objects in each historical period.

          data: periods.map(period =>
            department.shares[period] ?? 0
          ),

          // Object counts are used in the hover tooltips.

          counts: periods.map(period =>
            department.counts[period] ?? 0
          ),

          // Line and area styling.

          borderColor: color,

          // Convert the hexadecimal color to a translucent fill.

          backgroundColor: color + "35",

          pointBackgroundColor: color,
          pointBorderColor: "#FBF9F3",

          pointBorderWidth: 1.5,
          pointRadius: 4,
          pointHoverRadius: 7,

          borderWidth: 2.5,
          fill: true

        };

      })

    },


    // chart options

    options: {

      responsive: true,
      maintainAspectRatio: false,

      // Display tooltips for the point being hovered over.

      interaction: {
        mode: "nearest",
        intersect: true
      },


      plugins: {

        /* ---------- Legend ---------- */

        legend: {

          display: true,
          position: "bottom",

          labels: {

            color: "#625D54",

            boxWidth: 12,
            boxHeight: 12,

            padding: 18,

            usePointStyle: true,
            pointStyle: "circle",

            font: {
              family: "DM Sans",
              size: 12
            }

          }

        },


        /* ---------- Hover tooltips ---------- */

        tooltip: {

          backgroundColor: "#35332F",
          titleColor: "#F5D98B",
          bodyColor: "#FBF9F3",

          borderColor: "#82709B",
          borderWidth: 1,

          padding: 12,
          cornerRadius: 5,

          displayColors: true,

          callbacks: {

            label(context) {

              const percentage =
                Number(context.raw).toFixed(1);

              const count =
                Number(
                  context.dataset.counts[context.dataIndex]
                ).toLocaleString();

              return ` ${context.dataset.label}: ${percentage}% (${count} objects)`;

            }

          }

        }

      },


      // grid and scale for the radar 

      scales: {

        r: {

          min: 0,
          max: 80,

          ticks: {

            stepSize: 10,

            showLabelBackdrop: false,

            color: "#938B7F",
            backdropColor: "transparent",

            callback: value => `${value}%`,

            font: {
              family: "DM Sans",
              size: 11
            }

          },


          // Historical period labels around the chart.

          pointLabels: {

            color: "#625D54",

            padding: 8,

            font: {
              family: "DM Sans",
              size: window.innerWidth < 600 ? 10 : 12
            }

          },


          // Circular grid lines.

          grid: {
            color: "#E2DCCE"
          },


          // Lines connecting the center to each historical period.

          angleLines: {
            color: "#D8D0C2"
          }

        }

      }

    }

  });

}


// rendering department buttons 

function renderButtons() {

  // Clear the old buttons.

  buttonArea.innerHTML = "";

  // Generate a button for every department in output.json.

  departments.forEach((department, index) => {

    const name = department.department;
    const isSelected = selected.has(name);
    const color = colors[index % colors.length];

    const button = document.createElement("button");

    button.type = "button";

    button.className =
      "dept-option" + (isSelected ? " selected" : "");

    // Accessibility: expose the selected state.

    button.setAttribute(
      "aria-pressed",
      String(isSelected)
    );

    // Disable additional selections when four are selected.

    button.disabled =
      !isSelected && selected.size >= 4;


    // Create the colored indicator.

    const dot = document.createElement("span");

    dot.className = "dot";
    dot.style.backgroundColor = color;

    dot.setAttribute("aria-hidden", "true");


    // Create the department name.

    const label = document.createElement("span");

    label.textContent = name;


    // Add both elements to the button.

    button.append(dot, label);


    // Toggle selection when clicked.

    button.addEventListener("click", () => {

      if (selected.has(name)) {

        selected.delete(name);

      } else if (selected.size < 4) {

        selected.add(name);

      }

      // Update both the buttons and the chart.

      renderButtons();
      renderChart();

    });


    // Add the button to the page.

    buttonArea.appendChild(button);

  });

}


// load the processed data 

async function init() {

  try {

    // Load the JSON file generated by your data-processing scripts.

    const response = await fetch("./output.json");

    if (!response.ok) {
      throw new Error("Could not load output.json");
    }

    const data = await response.json();


    // Read historical periods and department statistics.

    periods = data.periods;
    departments = data.departments;


    // Use the default departments that exist in the dataset.

    selected = new Set(
      defaultDepartments.filter(name =>
        departments.some(department =>
          department.department === name
        )
      )
    );


    // If none of the default departments exist,
    // choose the first four available departments.

    if (selected.size === 0) {

      departments.slice(0, 4).forEach(department => {
        selected.add(department.department);
      });

    }


    // Build the interface.

    renderButtons();
    renderChart();

  } catch (error) {

    // Display a useful message if loading fails.

    document.querySelector("h1").textContent =
      "The collection data could not be loaded";

    status.textContent =
      "Check that output.json is beside index.html and that you are running the site through a local server.";

    console.error(
      "Error loading Met Collection data:",
      error
    );

  }

}


//initialize website

init();
