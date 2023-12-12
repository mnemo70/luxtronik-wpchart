/**
 * Alpha-InnoTec / Novelan heatcurve visualisation.
 * 
 * Author: Thomas Meyer <mnemotron@gmail.com>
 */

// Global chart object
let myChart = null;

// Limits for the various values
const tempLimits =
{
    heatingEnd0: {min: 20, max: 70},
    heatingFoot0: {min: 5, max: 35},
    heatingDelta0: {min: -5, max: 5},
    heatingEnd1: {min: 20, max: 70},
    heatingFoot1: {min: 5, max: 35},
    heatingDelta1: {min: -5, max: 5},
    heatingEnd2: {min: 20, max: 70},
    heatingFoot2: {min: 5, max: 35},
    heatingDelta2: {min: -5, max: 5}
}

/**
 * Shortcut for getElementById().
 */
function getEl(id)
{
    return document.getElementById(id);
}

/**
 * Check one input element for min/max values.
 **/
function checkLimit(id)
{
    const val = parseFloat(getEl(id).value.trim());
    if(!isNaN(val))
    {
        if(val < tempLimits[id].min)
            getEl(id).value = tempLimits[id].min;
        else
        {
            if(val > tempLimits[id].max)
                getEl(id).value = tempLimits[id].max;
        }
    }
}

/**
 * Update the graph with the current values from the user.
 **/
function updateGraph()
{
    // Check all input values for consistency
    Object.keys(tempLimits).forEach(id => {
        checkLimit(id)
    });

    if(myChart === null)
        initChart();

    for (datasetIndex = 0; datasetIndex < 3; datasetIndex++)
    {
        if (getEl("heatingShow" + datasetIndex).checked)
        {
            let heatingEnd = parseFloat(getEl("heatingEnd" + datasetIndex).value.trim());
            let heatingFoot = parseFloat(getEl("heatingFoot" + datasetIndex).value.trim());
            let heatingDelta = parseFloat(getEl("heatingDelta" + datasetIndex).value.trim());
            
            if(!isNaN(heatingEnd) && !isNaN(heatingFoot) && !isNaN(heatingDelta))
                updateDataset(datasetIndex, heatingEnd, heatingFoot, heatingDelta);
            else
                window.alert("Ungültige Wertangaben bei Heizkurve " + (datasetIndex + 1) + "! Bitte korrigieren.")
        }
        else
            disableChart(datasetIndex);
    }

    const reverseXaxis = getEl("reversex").checked;
    myChart.scales["x"].options.reverse = reverseXaxis;
    myChart.update();
}

/**
 * Add (or subtract) a value from an input element's value.
 */
function addValue(id, val)
{
    const el = getEl(id);
    if(el !== null)
    {
        const v = parseFloat(el.value);
        if(!isNaN(v))
        {
            el.value = v + val;
            updateGraph();
        }
    }
}

/**
 * Calculate desired heating return value for given outdoor temperature and heatcurve.
 */
function calcHeatcurve(outdoorTemp, heatingEnd, heatingFoot, heatingDelta)
{
    // Prevent DivisionByZero
    if((outdoorTemp - heatingFoot) != 40)
        return heatingFoot + (heatingEnd - 20) * (heatingFoot - outdoorTemp) / (20 - (outdoorTemp - heatingFoot) / 2) + heatingDelta;
    else
        return 0;
}

/**
 * Disable (hide) the indicated graph.
 */
function disableChart(datasetIndex)
{
    myChart.data.datasets[datasetIndex].data = [];
    myChart.data.datasets[datasetIndex].visible = false;
    myChart.update();
}

/**
 * Update the previously initialized graph.
 */
function updateDataset(datasetIndex, heatingEnd, heatingFoot, heatingDelta)
{
    const calculatedData = [];

    // Calculate the complete heatcurve
    const xLow = -20;
    const xHigh = Math.max(heatingFoot, 20);
    const steps = (xHigh - xLow) * 2;
    for (let i = 0; i <= steps; i++)
    {
        let outdoorTemp = (xLow + i / 2);
        let yVal = calcHeatcurve(outdoorTemp, heatingEnd, heatingFoot, heatingDelta);
        calculatedData.push({
            x: outdoorTemp,
            y: yVal
        });
    }

    myChart.data.datasets[datasetIndex].data = calculatedData;
}

/**
 * Basic initialization of the chart component.
 */
function initChart() {
    const ctx = getEl('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'RL-Temperatur 1',
                    data: [],
                    parsing: {
                        xAxisKey: 'x',
                        yAxisKey: 'y',
                    },
                    backgroundColor: [ '#ff3030' ],
                    borderColor: [ '#ff3030' ],
                    borderWidth: 1
                },
                {
                    label: 'RL-Temperatur 2',
                    data: [],
                    parsing: {
                        xAxisKey: 'x',
                        yAxisKey: 'y',
                    },
                    backgroundColor: [ '#308030' ],
                    borderColor: [ '#308030' ],
                    borderWidth: 1
                },
                {
                    label: 'RL-Temperatur 3',
                    data: [],
                    parsing: {
                        xAxisKey: 'x',
                        yAxisKey: 'y',
                    },
                    backgroundColor: [ '#3030ff' ],
                    borderColor: [ '#3030ff' ],
                    borderWidth: 1
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#000000'
                    }
                }
            },
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Außentemperatur °C',
                        color: '#101010'
                    },
                    suggestedMin: -20,
                    suggestedMax: 20
                },
                y: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Rücklauf-Solltemperatur °C',
                        color: '#101010'
                    },
                    suggestedMin: 10,
                    suggestedMax: 40
                }
            }
        }
    });
}