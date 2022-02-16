let myChart = null;

/**
 * Calculate desired heating return value for given outdoor temperature and heatcurve.
 */
 function calcHeatcurve(outdoorTemp, heatingEnd, heatingFoot, heatingDelta) {
    return ((heatingFoot - outdoorTemp * (heatingEnd - 20.0)) / (20.0 - ((outdoorTemp - heatingFoot) / 2))) + heatingFoot;
}

/**
 * Update the previously initialized graph.
 */
function updateChart(heatingEnd, heatingFoot, heatingDelta) {
    const calculatedData = [];

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
    myChart.update();
}

function initChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'RL-Temperatur',
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
            plugins: {
                legend: {
                    position: "bottom"
                }
            },
            scales: {
                x: {
                    type: "linear",
                    title: "Außentemp.",
                    suggestedMin: -20,
                    suggestedMax: 20
                },
                y: {
                    type: "linear",
                    title: "°C",
                    suggestedMin: 10,
                    suggestedMax: 40
                }
            }
        }
    });
}