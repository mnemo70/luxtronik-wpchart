let myChart = null;

// Validation limits for temperatures.
const tempLimits = {
    heatingEnd: {min: 20, max: 70},
    heatingFoot: {min: 5, max: 35},
    heatingDelta: {min: -5, max: 5}
}

/**
 * Check one input element for min/max values.
 **/
function checkLimit(id) {
  const val = parseFloat(document.getElementById(id).value.trim());
  if(val !== 'NaN') {
    if(val < tempLimits[id].min) {
      document.getElementById(id).value = tempLimits[id].min;
    }
    else {
      if(val > tempLimits[id].max) {
        document.getElementById(id).value = tempLimits[id].max;
      }
    }
  }
}

/**
 * Update the graph with the current values from the user.
 **/
function updateGraph() {
  const heatingEnd = parseFloat(document.getElementById("heatingEnd").value.trim());
  const heatingFoot = parseFloat(document.getElementById("heatingFoot").value.trim());
  const heatingDelta = parseFloat(document.getElementById("heatingDelta").value.trim());
  const reverseXaxis = document.getElementById("reversex").checked;

  // Check all input values for consistency
  Object.keys(tempLimits).forEach(id => {
    checkLimit(id)
  });
  if(heatingEnd !== 'NaN' || heatingFoot !== 'NaN' || heatingDelta !== 'NaN') {
    if(myChart === null)
      initChart();
    updateChart(heatingEnd, heatingFoot, heatingDelta, reverseXaxis);
  }
  else
    window.alert("Ungültige Wertangaben! Bitte ändern.")
}

/**
 * Add (or subtract) a value from an input element's value.
 */
function addValue(id, val) {
  const el = document.getElementById(id);
  if(el !== null) {
    const v = parseFloat(el.value);
    if(v !== 'NaN') {
      el.value = v + val;
      updateGraph();
    }
  }
}

/**
 * Update the previously initialized graph.
 */
function updateChart(heatingEnd, heatingFoot, heatingDelta, reverseXaxis) {
    const calculatedData = [];

    // Calculate the complete heatcurve
    const xLow = -20;
    const xHigh = heatingFoot;
    const steps = (xHigh - xLow) * 2;
    for (let i = 0; i <= steps; i++) {
        let outdoorTemp = (xLow + i / 2);
        let yVal = calcHeatcurve(outdoorTemp, heatingEnd, heatingFoot, heatingDelta);
        calculatedData.push({
            x: outdoorTemp,
            y: yVal
        });
    }

    myChart.data.datasets[0].data = calculatedData;
    myChart.scales["x"].options.reverse = reverseXaxis;
    myChart.update();
}

/**
 * Calculate desired heating return value for given outdoor temperature and heatcurve.
 */
 function calcHeatcurve(outdoorTemp, heatingEnd, heatingFoot, heatingDelta) {
    return ((heatingFoot - outdoorTemp * (heatingEnd - 20.0)) / (20.0 - ((outdoorTemp - heatingFoot) / 2))) + heatingFoot + heatingDelta;
}

function initChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Heizkurve',
                data: [],
                parsing: {
                    xAxisKey: "x",
                    yAxisKey: "y",
                },
                backgroundColor: [
                    '#ff0000'
                ],
                borderColor: [
                    '#e00000'
                ],
                borderWidth: 1
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom"
                }
            },
            scales: {
                x: {
                    type: "linear",
                    title: {
                        display: true,
                        text: "Außentemperatur °C",
                        color: "#606060"
                    },
                    suggestedMin: -20,
                    suggestedMax: 20
                },
                y: {
                    type: "linear",
                    title: {
                        display: true,
                        text: "Rücklauf-Solltempeatur °C",
                        color: "#606060"
                    },
                    suggestedMin: 10,
                    suggestedMax: 40
                }
            }
        }
    });
}