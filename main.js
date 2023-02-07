var ManagerSystem = function () {
    console.log("hello ManagerSystem")
    
    var linkGetLocalData = "http://127.0.0.1:3000/getLocalDataFile"
    // var linkGetLocalData = "https://demo-deploy-app-01.onrender.com/getLocalDataFile"
    $.ajax({
        url: linkGetLocalData,
        type: "GET",
        success: function (data) {
            // data = JSON.parse(data);
            console.log("hello data")
            console.log(data)
            var myLabel = []
            var myLabelName = '# of Recored'
            var myLabelRecords = []
            var myLabelRecordsBackground = [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(255, 159, 64, 0.2)'
                        ]
            var myLabelRecordsBorder = [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ]


            for (var name of Object.keys(data)) {
                myLabel.push(name)
                myLabelRecords.push(data[name])
            }



            var ctx = document.getElementById('myChart').getContext('2d');
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: myLabel,
                    datasets: [{
                        label: myLabelName,
                        data: myLabelRecords,
                        backgroundColor: myLabelRecordsBackground,
                        borderColor: myLabelRecordsBorder,
                        borderWidth: 1
                    }]
                },
                // options: {
                //     scales: {
                //         yAxes: [{
                //             ticks: {
                //                 beginAtZero: true
                //             }
                //         }]
                //     }
                // }
            });

        },
        error: function (jXHR, textStatus, errorThrown) {
            console.log("got error")
        }
    });

}