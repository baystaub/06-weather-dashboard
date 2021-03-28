var searchButton = $(".searchButton");
var apiKey = "40ad46380b6d8c16e4ee5168aa8adc07";
var keyCount = 0;

for (var i = 0; i < localStorage.length; i++) {
    var city = localStorage.getItem(i);
    var cityName = $(".list-group").addClass("list-group-item");
    cityName.append("<li>" + city + "</li>");
}
searchButton.click(function() {
    var searchInput = $(".searchInput").val();
    let urlCurrent =
        "https://api.openweathermap.org/data/2.5/weather?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";

    if (searchInput == "") {} else {
        fetch(urlCurrent, { method: "GET" })
            .then(function(data) {
                return data.json();
            })
            .then(function(response) {
                var cityName = $(".list-group").addClass("list-group-item");
                cityName.append("<li>" + response.name + "</li>");
                localStorage.setItem(keyCount, response.name);
                keyCount = keyCount + 1;

                var currentCard = $(".currentCard")
                    .append("<div>")
                    .addClass("card-body");
                var currentName = currentCard.append("<h1>");
                var currentDay = moment().format("MMMM Do");
                currentCard.empty();
                currentCard.append(
                    "<h4>" + response.name + " - " + currentDay + "</h4>" + `<img src="https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png">` + "<ol>" + "Temperature: " + response.main.temp +
                    "°F" + "</ol>" + "<ol>" + "Humidity: " + response.main.humidity + "%" + "</ol>" + "<ol>" + "Wind Speed: " + response.wind.speed + "</ol>"
                );

                var currentTemp = currentName;
                let indexURL = `https://api.openweathermap.org/data/2.5/uvi?appid=40ad46380b6d8c16e4ee5168aa8adc07&lat=${response.coord.lat}&lon=${response.coord.lon}`;

                fetch(indexURL, { method: "GET" })
                    .then(function(data) {
                        return data.json();
                    })
                    .then(function(response) {
                        var currentUV = currentTemp
                            .append("<ol>" + "UV Index: " + response.value + "</ol>")
                            .addClass("card-text indicator");
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

    let fiveDayURL =
        "https://api.openweathermap.org/data/2.5/forecast?q=" + searchInput + "&Appid=" + apiKey + "&units=imperial";

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