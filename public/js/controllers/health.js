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
    $('.health-article').eq(0).animate({height: '87vh'});
    $('.health-article').eq(0).animate({visibility: 'visibile'});

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
    $('.health-article').eq(1).animate({height: '87vh'});
    $('.healthContent').eq(1).css('visibility', 'visible');
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

      this.choicePlain = 0;
      this.choiceFlavored = 0;

      this.showSugarGraph = function() {
        $('.health-article').eq(2).animate({height: '87vh'});
        $('#sugarGraph').css('display', 'flex');
        $('#sugarForm').css('display', 'flex');


      };

      this.getValuesForUserInput = function() {
        $('#sugarLimit').animate({height: '0'});
        $('#plainDrink').animate({height: '0'});
        $('#flavoredDrink').animate({height: '0'});

        let values = [5,7,9,10,17,20,37];
        let sugarlimit = 25;

        let max = Math.max(sugarlimit, values[parseInt(this.choicePlain)], values[parseInt(this.choiceFlavored)]);
        let heightLimit = 0;
        let heightPlain = 0;
        let heightFlavored = 0;
        console.log("max " + max);

        heightPlain = Math.round((100 / max) * values[parseInt(this.choicePlain)]);
        console.log("heightplan " + heightPlain);
        heightLimit = Math.round((100 / max) * sugarlimit);
        console.log("heightlimit " + heightLimit);
        heightFlavored = Math.round((100 / max) * values[parseInt(this.choiceFlavored)]);
        console.log("heightFlavored " + heightFlavored);


        $('.sugarGraphContent').css('display', 'flex');

        $('#sugarLimit').animate({height: heightLimit +'%'});

        $('#plainDrink').animate({height: heightPlain +'%'});
        $('#plainDrink').css('borderTop', '2px dashed black');
        $('#sugarGrammsPlain').text(values[parseInt(this.choicePlain)] + 'g of sugar from milk');


        $('#flavoredDrink').animate({height: heightFlavored + '%'});
        $('#flavoredDrink').css('borderTop', '2px dashed black');
        $('#sugarGrammsFlavored').text(values[parseInt(this.choiceFlavored)] + 'g of sugar total, partly from milk, partly free sugars');


        console.log("plain, limit, flavored ", heightPlain, heightLimit, heightFlavored);
      };


}]);
