let myChart = null;

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

function updateChart(heatingEnd, heatingFoot, heatingDelta) {
    const heatingStep = Math.abs(heatingEnd - heatingFoot) / 40;
    console.log('heatingEnd=' + heatingEnd + ' heatingFoot=' + heatingFoot + ' heatingStep=' + heatingStep);

    const calculatedData = [];
 
    for(var i = 0; i <= 80; i++) {
        var xVal = (i / 2) - 20;
        var yVal = heatingEnd - (i / 2) * heatingStep;
        calculatedData.push({
            x: xVal,
            y: yVal
        });
    }

    myChart.data.labels.pop();
    myChart.data.datasets.forEach((dataset) => {
        console.log('Pop dataset=' + dataset.data.label + ' data: ' + dataset.data.length);
        dataset.data.pop();
    });
    //myChart.data.labels.push(label);
    //myChart.data.datasets[0].data.push(calculatedData);
    myChart.data.datasets[0].data = calculatedData;
    /*myChart.data.datasets.forEach((dataset) => {
        console.log('Push set=' + dataset.data.label + ' data: ' + calculatedData.length);
        dataset.data.push(calculatedData);
    });*/
    myChart.update();
}