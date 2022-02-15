function initChart() {
    const calculatedData = [];
    for(var i = 0; i <= 80; i++) {
        var xVal = (i / 2) - 20;
        var yVal = 60 - i;
        calculatedData.push( {
            x: xVal,
            y: yVal
        });
    }

    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                label: 'RL-Temperatur',
                data: calculatedData,
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
                    suggestedMin: -20,
                    suggestedMax: 20
                },
                y: {
                    type: "linear",
                    suggestedMin: 0,
                    suggestedMax: 80
                }
            }
        }
    });
}