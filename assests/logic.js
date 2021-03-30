var searchButton = $(".searchButton");
var apiKey = "40ad46380b6d8c16e4ee5168aa8adc07";
var keyCount = 0;
var todayTime = moment().format("h:mm:ss a")
var datetime = null

$("#Time").text(todayTime);

for (var i = 0; i < localStorage.length; i++) {
    var city = localStorage.getItem(i);
    var cityName = $(".listGroup").addClass("listGroupItem");
    cityName.append("<li>" + city + "</li>");
}
//starting function for the search button
searchButton.click(function() {
    //sets the searchInput to what is getting entered
    var searchInput = $(".searchInput").val();
    //setting the current url to the apicall adding in the search input, and adding in the apikey
    let urlCurrent =
        "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";
    //if the input doesnt equal anything, wont do anything goes into the else
    if (searchInput == "") {} else {
        //calls upon a fetch on the current url with the input and the apikey
        fetch(urlCurrent, { method: "GET" })
            //than returns the data as json
            .then(function(data) {
                return data.json();
            })
            //sets a var to cityname and sets it to local storage and adds an extra key count
            .then(function(response) {
                var cityName = $(".listGroup").addClass("listGroupItem");
                cityName.append("<li>" + response.name + "</li>");
                localStorage.setItem(keyCount, response.name);
                keyCount = keyCount + 1;
                //appending the current and adding classes to that card
                var currentCard = $(".currentCard").append("<div>").addClass("card-body");
                var currentName = currentCard.append("<h1>");
                var currentDay = moment().format("MMMM Do");
                //clears the currentcard to empty so it can add the information.
                currentCard.empty();
                currentCard.append(
                    "<h4>" + response.name + " - " + currentDay + "</h4>" + `<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">` + "<ol>" + "Temperature: " + response.main.temp +
                    "°F" + "</ol>" + "<ol>" + "Humidity: " + response.main.humidity + "%" + "</ol>" + "<ol>" + "Wind Speed: " + response.wind.speed + "</ol>"
                );
                //adds the current temp
                var currentTemp = currentName;
                //sets var for a index
                let indexURL = `https://api.openweathermap.org/data/2.5/uvi?appid=40ad46380b6d8c16e4ee5168aa8adc07&lat=${response.coord.lat}&lon=${response.coord.lon}`;
                //fetches the index for the day
                fetch(indexURL, { method: "GET" })
                    //returns data as json
                    .then(function(data) {
                        return data.json();
                    })
                    //grabs the current uv, and appends it to the page as well as sets the border color bases on the uv index.
                    .then(function(response) {
                        var currentUV = currentTemp
                            .append("<ol>" + "UV Index: " + response.value + "</ol>")
                            .addClass("cardText indicator");
                        currentTemp.append(currentUV);
                        var UVindex = document.querySelector(".indicator");
                        if (response.value >= 8) {
                            UVindex.style.borderColor = "red";
                        } else if (response.value >= 3) {
                            UVindex.style.borderColor = "orange";
                        } else {
                            UVindex.style.borderColor = "green";
                        }
                    });
            });
    }
    //sets the url for the 5 days with the searchinput and the apikey
    let fiveDayURL =
        "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";
    //fetchs the url for the 5days.
    fetch(fiveDayURL, { method: "GET" })
        .then(function(data) {
            return data.json();
        })
        .then(function(response) {
            var day = [0, 8, 16, 24, 32];
            var fiveDayDiv = $(".fiveDayOne").addClass("card-text flex-grow");
            fiveDayDiv.empty();
            day.forEach(function(i) {
                var fiveDayDate = moment(response.list[i].dt * 1000).format("MMMM Do");
                console.log(response);
                fiveDayDiv.append(
                    "<div class=fiveDayColor>" + "<h4>" + fiveDayDate + "</h4>" + "<li>" + `<img src="https://openweathermap.org/img/wn/${response.list[i].weather[0].icon}@2x.png">` + "</li>" + "<ol>" +
                    "Temp: " + response.list[i].main.temp + "°F" + "</ol>" + "<ol>" + "Humidity: " + response.list[i].main.humidity + "%" + "</ol>" + "</div>"
                );
            });
        });
});

//updates the clock every second.
$(document).ready(function() {
    datetime = $('#Time')
    update();
    setInterval(update, 1000);
});
//sets the background for present,past,and future background
var update = function() {
    date = moment(new Date())
    datetime.html(date.format('h:mm:ss a'));
};