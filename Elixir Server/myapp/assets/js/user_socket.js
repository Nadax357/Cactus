// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".
import Chart from "../assets/node_modules/chart.js/auto"

// Bring in Phoenix channels client library:
import {Socket} from "phoenix"

// And connect to the path in "lib/myapp_web/endpoint.ex". We pass the
// token for authentication. Read below how it should be used.
let socket = new Socket("/socket", {params: {token: window.userToken}})

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/myapp_web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/myapp_web/templates/layout/app.html.heex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/3" function
// in "lib/myapp_web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket, _connect_info) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1_209_600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, connect to the socket:
socket.connect()

// Now that you are connected, you can join channels with a topic.
// Let's assume you have a channel with a topic named `room` and the
// subtopic is its id - in this case 42:
let channel = socket.channel("metrics:lobby", {})
channel.on("new_data", payload => {
  console.log("Received new data:", payload)
  updateChart(payload['cpu_usage'], cpuUsageChart)
  updateChart(payload['memory_usage'], memoryUsageChart)
  updateChart(payload['cpu_temperature'], cpuTemperatureChart)
})
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

export default socket

// Setup Chart.js
Chart.defaults.font.size = 16;
let cpuUsageCanvas = document.getElementById('cpuChart').getContext('2d')
let memoryUsageCanvas = document.getElementById('memoryChart').getContext('2d')
let cpuTemperatureCanvas = document.getElementById('cpuTemperatureChart').getContext('2d')
let cpuUsageChart = new Chart(cpuUsageCanvas, {
  type: 'line', // Change to the type of chart you need
  data: {
    labels: [0,1,2,3,4,5,6,7,8,9], // Initialize with empty labels
    datasets: [{
      label: 'Cpu Usage %',
      data: [], // Initialize with empty data
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      }
    }
  }
})

let memoryUsageChart = new Chart(memoryUsageCanvas, {
  type: 'line', // Change to the type of chart you need
  data: {
    labels: [0,1,2,3,4,5,6,7,8,9], // Initialize with empty labels
    datasets: [{
      label: 'Memory Usage %',
      data: [], // Initialize with empty data
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  }
})

let cpuTemperatureChart = new Chart(cpuTemperatureCanvas, {
  type: 'line', // Change to the type of chart you need
  data: {
    labels: [0,1,2,3,4,5,6,7,8,9], // Initialize with empty labels
    datasets: [{
      label: 'CPU Temperature C°',
      data: [], // Initialize with empty data
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 100
      }
    }
  }
})

// Function to update chart with new data
function updateChart(newData, chart) {
  let data = chart.data.datasets[0].data
  data.push(newData)
  if(data.length > 10) {
    data.shift()
  }
  chart.update()
}

class circularChart extends Chart.DoughnutController {
  draw() {
    super.draw(arguments);
  }
}
