angular.module('CoffeeApp')
.controller('financesController', ['$scope', '$http', function($scope, $http) {
  this.userPrices = {};
  this.averagePrices = [{
      beverage: 'cappuccino',
      indexPrice: [3.06, 3.28],
      userPrice: 0
    }, {
      beverage: 'drip coffee',
      indexPrice: [1.87, 2.41],
      userPrice: 0
    }];

    this.purchaseStats = {};

  // source: http://www.scanews.coffee/2015/10/30/the-specialty-coffee-price-index-a-benchmark-for-coffee-retailers/
  this.getAveragePrices = function() {
    $http({
      method: 'GET',
      url: $scope.baseUrl + 'purchases/finances',
      headers: {
         Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
       }
    }).then(
      response => {
        console.log(response);
        if (response.data.status === 200) {
          this.averagePrices[0].userPrice = response.data.cappuccino_average;
          this.averagePrices[1].userPrice = response.data.coffee_average;
          this.purchaseStats = response.data.stats;
        } else {
          console.log(response.data.status);
        }
      },
      error => {
        console.log(error);
      });
  };

  this.getAveragePrices();

  this.comparePrices = function() {

    $('.finance-article').animate({height: '100%'});
    $('.financeContent').eq(0).animate({height: '75vh'});

    let options = Chart.defaults.bubble;

    let ctx = document.getElementById("bubbleChart");

    let maximum = Math.max(this.purchaseStats.past_month.by_cup.average_price, this.purchaseStats.total.by_cup.average_price);

    let maxCount = Math.max(this.purchaseStats.past_month.by_cup.count, this.purchaseStats.total.by_cup.count);
    let minCount = Math.min(this.purchaseStats.past_month.by_cup.count, this.purchaseStats.total.by_cup.count);


    const toPercentages = function(num) {
      return (Math.round((100 / maximum) * parseFloat(num)))/3;
    };

    let cleanData = [
      {
        label: 'price / purchase in past month: $' + this.purchaseStats.past_month.by_cup.average_price,
        backgroundColor: 'rgba(67,165,207,.4)',
        borderColor: 'rgba(67,165,207,1)',
        data: [
          {
            x: 1, // past month
            y: this.purchaseStats.past_month.by_cup.count, // count
            r: toPercentages(this.purchaseStats.past_month.by_cup.average_price) // average spent
          }
        ]
      }, {
        label: 'price / purchase all time: $' + this.purchaseStats.total.by_cup.average_price,
        backgroundColor: 'rgba(67,165,207,.8)',
        borderColor: 'rgba(67,165,207,1)',
        data: [
          {
            x: 2, // total
            y: this.purchaseStats.total.by_cup.count, // count
            r: toPercentages(this.purchaseStats.total.by_cup.average_price) // average spent
          }
        ]
      },
      {
        label: 'index price / cappuccino: $3.28',
        backgroundColor: 'rgba(255,20,147,.6)',
        borderColor: 'rgba(255,20,147,1)',
        data: [
          {
            x: 3,
            y: maxCount,
            r: toPercentages(3.28) // average price
          }
        ]
      }
    ]


    var myBubbleChart = new Chart(ctx,{
      type: 'bubble',
      data: {
        datasets: cleanData
      },
      options: {
        tooltips: {enabled: false},
        hover: {mode: null},
        title: {
          display: true,
          text: 'My Coffee Shop Visits: # of Purchases and Average Prices Paid'
        }, scales: {
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: "Total number of purchases at coffee shops"
            },
            gridLines : {
                display : false
            },
            ticks: {
                stepSize: 1,
                min: minCount - 1,
                max: (maxCount + 1)
            }
          }],
          xAxes: [{
            gridLines : {
                display : false
            },
            ticks: {
                min: 0,
                max: 4,
                beginAtZero:true,
                stepSize: 1,
                display: false
            }
          }],
        }
      }
    });
  };

}]);
