angular.module('CoffeeApp')
.controller('healthController', ['$scope', '$http', function($scope, $http) {
  // ************* coffeeConsumptionGraph *************

// create an object with the dates as keys and sum up the entries per date
  this.dataAccumulatedByDate = function(dataArray, key) {
    console.log('alt', dataArray);
    // sort array
    dataArray.sort(function (a,b) {
      return new Date(a.date) - new Date(b.date)
    });
    console.log('neu', dataArray);
    let data = {};
    for (let i = 0; i < dataArray.length; i++) {
      if (key === 'byDay') {
        if (data[dataArray[i].date] !== undefined) {
          data[dataArray[i].date] += 1;
        } else {
          data[dataArray[i].date] = 1;
        }
      } else {
        if (data[dataArray[i].date] !== undefined) {
          data[dataArray[i].date] += parseInt(Math.round(dataArray[i][key]));
        } else {
          data[dataArray[i].date] = parseInt(Math.round(dataArray[i][key]));;
        }
      }
    }
    console.log(data);
    return data;
  };

  // initialize variables for
  let cleanLabels = [];
  let cleanData = [];

  // convert data into a format chartJS can process
  this.parseData = function(dataArray, key) {
    cleanLabels = [];
    cleanData = [];
    let userData = [[],[]];
    let data = this.dataAccumulatedByDate(dataArray, key);
    for (let date in data) {
      userData[0].push(new Date(date));
      userData[1].push(data[date]);
      console.log('what is that?', data[date]);
    }

    for (var i = userData[0].length-1; i >= Math.max(0,userData[0].length-7); i--) {
      cleanLabels.unshift(userData[0][i].toDateString());
      cleanData.unshift(Math.round(userData[1][i]));
    }
    console.log("hey user data")
    console.log(cleanData);
    console.log(cleanLabels);
  };

  this.createConsumptionGraph = function(dataArray, key) {
    this.parseData(dataArray, key);
    ctx = document.getElementById("coffeeConsumptionGraph");
    var mixedChart = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
          label: '# of cups',
          data: cleanData,
          backgroundColor: 'rgba(67,165,207,.8)',
          borderColor: 'rgba(67,165,207,1)',
          borderWidth: 1
        // }, {
        //   label: 'recommended daily limit',
        //   data: [5,5,5,5,5,5,5],
        //   borderColor: 'rgba(255,0,0,1)',
        //   fill: false,
        //   pointRadius: 0,
        //   pointHoverRadius: 0,
        //   backgroundColor: 'rgba(255,0,0,1)',
        //   // Changes this dataset to become a line
        //   type: 'line'
        }],
        labels: cleanLabels
      },
      options: {
          scales: {
              responsive: true,
              yAxes: [{
                  ticks: {
                      min:0,
                      beginAtZero:true,
                      stepSize: 1
                  }
              }]
          }
      }
    });
  console.log("done charting")
  };

  this.createCaffeineGraph = function(dataArray, key) {
    this.parseData(dataArray, key);
    ctx = document.getElementById("caffeineIntakeGraph");
    var mixedChart = new Chart(ctx, {
      type: 'bar',
      data: {
        datasets: [{
          label: 'caffeine in mg',
          data: cleanData,
          backgroundColor: 'rgba(67,165,207,.8)',
          borderColor: 'rgba(67,165,207,1)',
          borderWidth: 1
        }, {
          label: 'recommended daily limit',
          data: [400,400,400,400,400,400,400],
          borderColor: 'rgba(255,0,0,1)',
          fill: false,
          pointRadius: 0,
          pointHoverRadius: 0,
          backgroundColor: 'rgba(255,0,0,1)',
          // Changes this dataset to become a line
          type: 'line'
        }],
        labels: cleanLabels
      },
      options: {
          scales: {
              responsive: true,
              yAxes: [{
                  ticks: {
                      min:0,
                      beginAtZero:true,
                      stepSize: 50
                  }
              }]
          }
      }
    });
  };
}]);
