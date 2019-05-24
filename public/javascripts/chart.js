$(".chart").on("click",function () {
    this.remove();
    chart();
});
function chart() {
    $(".charts").removeClass("hide");
    var data = [];
    let series = [], seriesSUM = [], seriesRg = [];
    $.ajax({
        url: '/select',
        complete: function (dataJSON) {
            //console.log(dataJSON.responseJSON.data);
            data = JSON.parse(dataJSON.responseJSON.data);
            console.log(data);
            data.forEach(function (value, index) {
                let obj = {
                    name: value.number,
                    data: value.data
                };
                let objSUM = {
                    name: value.number + " " + value.name,
                    data: value.dataSUM
                };
                let objRg = {
                    name: value.number + " " + value.name,
                    data: value.dataRg
                };
                series.push(obj);
                seriesSUM.push(objSUM);
                seriesRg.push(objRg);
            });
            //console.log(seriesRg);
            create("container1", series, "Часова статистика", (600 * 1000));
            create("container2", seriesSUM, "Сумарна статистика", (3600 * 1000));
            create("container3", seriesRg, "Рейтингова статистика", (3600 * 1000));
        }
    });
}

function create(container, series, text, interval) {
        Highcharts.stockChart(container, {

            title: {
                text: text
            },

            subtitle: {
                text: ''
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Кількість голосів'
                }
            },
            legend: {
                enabled: true,
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            plotOptions: {
                series: {
                    showInNavigator: true,
                    label: {
                        connectorAllowed: true
                    },
                    pointStart: Date.UTC(2019, 4, 15, 9),
                    pointInterval: interval
                }
            },
            series: series,

            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            layout: 'horizontal',
                            align: 'center',
                            verticalAlign: 'bottom'
                        }
                    }
                }]
            }

        });

}