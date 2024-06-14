// NOTE: The contents of this file will only be executed if
// you uncomment its entry in "assets/js/app.js".
import {Chart, DoughnutController} from "../assets/node_modules/chart.js/auto"

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
  updateChart(payload['cpu_usage'], cpuUsageChart)
  updateChart(payload['memory_usage'], memoryUsageChart)
  updateChart(payload['cpu_temperature'], cpuTemperatureChart)
  updateGauge(payload['cpu_usage'], cpuUsageGauge)
  updateGauge(payload['memory_usage'], memoryUsageGauge)
  updateGauge(payload['cpu_temperature'], cpuTemperatureGauge)
})
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) })
  .receive("error", resp => { console.log("Unable to join", resp) })

export default socket

class gaugeChart extends DoughnutController {
  draw() {
    super.draw(arguments);
    const { ctx, data, chartArea: { top, bottom, left, right, width, height } } = this.chart;
    const value = data.datasets[0].data[0]+data.datasets[0].unit || '';

    ctx.save();
    ctx.font = 'bold 150px sans-serif';
    ctx.fillStyle = data.datasets[0].backgroundColor[0]
    ctx.textAlign = 'center';
    ctx.fillText(value, width / 2, bottom-100)
  }
}

// Create gauge chart
gaugeChart.id = 'gauge';
gaugeChart.defaults = DoughnutController.defaults;
gaugeChart.defaults = {
  animation: {
    animateRotate: false
  },
  cutout: '75%',
  circumference: 180,
  rotation: 270,
};
gaugeChart.overrides = {
  aspectRatio: 1.5,
  plugins: {
    legend: {
      display: true
    },
    tooltip: {
      enabled: false
    }
  }
}

Chart.register(gaugeChart);

// Setup Chart.js
Chart.defaults.font.size = 16;
const cpuUsageCanvas = document.getElementById('cpuUsageChart').getContext('2d')
const memoryUsageCanvas = document.getElementById('memoryUsageChart').getContext('2d')
const cpuTemperatureCanvas = document.getElementById('cpuTemperatureChart').getContext('2d')
const cpuUsageGaugeCanvas = document.getElementById('cpuUsageGauge').getContext('2d')
const memoryUsageGaugeCanvas = document.getElementById('memoryUsageGauge').getContext('2d')
const cpuTemperatureGaugeCanvas = document.getElementById('cpuTemperatureGauge').getContext('2d')
const cpuUsageChart = new Chart(cpuUsageCanvas, {
  type: 'line', 
  data: {
    labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], 
    datasets: [{
      label: 'Cpu Usage %',
      data: [0,0,0,0,0,0,0,0,0,0],
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

const memoryUsageChart = new Chart(memoryUsageCanvas, {
  type: 'line',
  data: {
    labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    datasets: [{
      label: 'Memory Usage %',
      data: [],
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

const cpuTemperatureChart = new Chart(cpuTemperatureCanvas, {
  type: 'line',
  data: {
    labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    datasets: [{
      label: 'CPU Temperature C°',
      data: [],
      backgroundColor: 'rgba(220, 95, 0, 0.7)',
      borderColor: 'rgba(220, 95, 0, 0.6)',
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

const cpuUsageGauge = new Chart(cpuUsageGaugeCanvas, {
  type: 'gauge',
  data: {
    datasets: [{
      label: 'CPU Usage %',
      data: [0, 100],
      backgroundColor: [
        'rgba(220, 95, 0, 1)',
        'rgba(104, 109, 118, 0.5)'
      ],
      unit: '%'
    }]
  }
})

const memoryUsageGauge = new Chart(memoryUsageGaugeCanvas, {
  type: 'gauge',
  data: {
    datasets: [{
      label: 'Memory Usage %',
      data: [0, 100],
      backgroundColor: [
        'rgba(220, 95, 0, 1)',
        'rgba(104, 109, 118, 0.5)'
      ],
      unit: '%'
    }]
  }
})

const cpuTemperatureGauge = new Chart(cpuTemperatureGaugeCanvas, {
  type: 'gauge',
  data: {
    datasets: [{
      label: 'CPU Temperature C°',
      data: [0, 100],
      backgroundColor: [
        'rgba(220, 95, 0, 1)',
        'rgba(104, 109, 118, 0.5)'
      ],
      unit: '°'
    }]
  }
})

// Function to update chart with new data
function updateChart(newData, chart) {
  let data = chart.data.datasets[0].data
  data.push(newData)
  if (data.length > 10) {
    data.shift()
  }
  chart.update()
}

// Function to update gauge with new data
function updateGauge(newData, gauge) {
  gauge.data.datasets[0].data = [newData, 100 - newData];
  gauge.update();
}