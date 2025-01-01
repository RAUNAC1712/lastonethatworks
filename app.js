const firebaseURL = "https://lastgoal-a90d1-default-rtdb.asia-southeast1.firebasedatabase.app/sensor_data.json";

// Function to fetch data from Firebase
async function fetchData() {
  try {
    const response = await fetch(firebaseURL);
    const data = await response.json();

    if (data) {
      document.getElementById("temp").textContent = data.temp || "N/A";
      document.getElementById("humid").textContent = data.humid || "N/A";
    } else {
      console.error("No data found.");
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

// Fetch data every 5 seconds to simulate real-time updates
setInterval(fetchData, 5000);

// Initial call
fetchData();

