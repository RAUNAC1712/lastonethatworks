const firebaseURL = "https://lastgoal-a90d1-default-rtdb.asia-southeast1.firebasedatabase.app/sensor_data.json";

// Get DOM elements
const tempElem = document.getElementById("temp");
const humidElem = document.getElementById("humid");

// Initialize datasets for graphs
const tempData = [];
const humidData = [];
const labels = []; // Labels for time

// Create charts
const tempChart = new Chart(document.getElementById("tempChart"), {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: "Temperature (°C)",
      data: tempData,
      borderColor: "red",
      fill: false
    }]
  },
  options: {
    scales: {
      x: {
        title: { display: true, text: "Time" },
      },
      y: {
        title: { display: true, text: "Temperature (°C)" },
        beginAtZero: true
      }
    }
  }
});

const humidChart = new Chart(document.getElementById("humidChart"), {
  type: "line",
  data: {
    labels: labels,
    datasets: [{
      label: "Humidity (%)",
      data: humidData,
      borderColor: "blue",
      fill: false
    }]
  },
  options: {
    scales: {
      x: {
        title: { display: true, text: "Time" },
      },
      y: {
        title: { display: true, text: "Humidity (%)" },
        beginAtZero: true
      }
    }
  }
});

// Function to fetch data from Firebase
async function fetchData() {
  try {
    const response = await fetch(firebaseURL);
    const data = await response.json();

    if (data) {
      // Update DOM
      tempElem.textContent = data.temp || "N/A";
      humidElem.textContent = data.humid || "N/A";

      // Get the current time
      const currentTime = new Date().toLocaleTimeString();

      // Update datasets
      if (tempData.length > 10) {
        tempData.shift();
        humidData.shift();
        labels.shift();
      }

      tempData.push(data.temp || 0);
      humidData.push(data.humid || 0);
      labels.push(currentTime);

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
