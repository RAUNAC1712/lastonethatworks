const firebaseURL = "https://lastgoal-a90d1-default-rtdb.asia-southeast1.firebasedatabase.app/sensor_data.json";

// Get DOM elements
const tempElem = document.getElementById("temp");
const humidElem = document.getElementById("humid");

// Initialize datasets
let tempData = [];
let humidData = [];
let labels = []; // Time labels for the X-axis

// Create the temperature chart
const tempChart = new Chart(document.getElementById("tempChart"), {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: "Temperature (°C)",
      data: tempData,
      borderColor: "red",
      fill: false,
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "second",
        },
        title: { display: true, text: "Time" },
      },
      y: {
        title: { display: true, text: "Temperature (°C)" },
        beginAtZero: false,
        suggestedMin: 15, // Lower range for centered graph
        suggestedMax: 40, // Higher range for centered graph
      }
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x",
        }
      }
    }
  }
});

// Create the humidity chart
const humidChart = new Chart(document.getElementById("humidChart"), {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: "Humidity (%)",
      data: humidData,
      borderColor: "blue",
      fill: false,
    }]
  },
  options: {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "second",
        },
        title: { display: true, text: "Time" },
      },
      y: {
        title: { display: true, text: "Humidity (%)" },
        beginAtZero: false,
        suggestedMin: 30, // Center graph lower bound
        suggestedMax: 70, // Center graph upper bound
      }
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: "x",
        }
      }
    }
  }
});

// Fetch and update data
async function fetchData() {
  try {
    const response = await fetch(firebaseURL);
    const data = await response.json();

    if (data) {
      // Update current readings
      tempElem.textContent = data.temp || "N/A";
      humidElem.textContent = data.humid || "N/A";

      // Get the current time
      const currentTime = new Date();

      // Update datasets
      tempData.push({ x: currentTime, y: data.temp || 0 });
      humidData.push({ x: currentTime, y: data.humid || 0 });
      labels.push(currentTime);

      // Keep only last 2 minutes of data
      const twoMinutesAgo = new Date(currentTime.getTime() - 2 * 60 * 1000);
      tempData = tempData.filter(point => point.x >= twoMinutesAgo);
      humidData = humidData.filter(point => point.x >= twoMinutesAgo);
      labels = labels.filter(label => label >= twoMinutesAgo);

      // Update charts
      tempChart.update();
      humidChart.update();
    } else {
      console.error("No data found.");
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

// Fetch data every 5 seconds
setInterval(fetchData, 5000);

// Initial fetch
fetchData();
