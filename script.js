//When the page loads the screen should be clear of any "errors"
// $(window).on( "load", function() {
// });

//get the capital of the country the user types in
$("#search").on("click", function(event){
    event.preventDefault();
    var country = $("#countryInput").val().trim().toLowerCase();
    if (country) {
        $("#countryInput").val("");
    } 
    getCountryInfo(country);
}) 

//get capital from api to search with
function getCountryInfo(country){
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://restcountries-v1.p.rapidapi.com/all",
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "restcountries-v1.p.rapidapi.com",
            "x-rapidapi-key": "52dbb116femsh414adea3d2d39b0p1baee8jsn399515d8751e"
        }
    }
    $.ajax(settings).done(function (response) {
        
        for (var i = 0; i < response.length; i++) {
            var countryMatch = (response[i].name).toLowerCase(); 
            if (country === countryMatch){
                var capital = response[i].capital;
                $("#capital").text(capital + ", " + response[i].name);
                getPictures(capital);
                getWeather(capital);
                getForecast(capital);
                wikiLink(capital);
            }
        }
    });
}


//search for picture based on the capital
function getPictures(capital){
    var queryURL = "https://api.unsplash.com/search/photos?query=" + capital + "&per_page=20&client_id=tLFvPdAvAFpRTR2LhyEwk38gT8ALPvluLPQTUjttXfc"

    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response){
      var picList = response.results;     
      showPictures(picList);
    })
}

//shows pictures in a carousel
function showPictures(picList){
    $("#pictures").empty();
    var carouselPics = []
    for (var i = 0; i < picList.length; i++){
    
        var picWidth = picList[i].width;
        var picHeight = picList[i].height;
        
    
        if (picWidth > picHeight){
            carouselPics.push(picList[i])
        } 
    }   
    showPicturesTwo(carouselPics, picList)
    console.log(carouselPics)
}

function showPicturesTwo(carouselPics, picList){
    var carouselDiv = $("<div>").addClass("carousel")
    
    if (carouselPics.length < 5) {
       
        var anchor = $("<a>").addClass("carousel-item").append($("<img>").attr("src", "https://images.unsplash.com/photo-1488197047962-b48492212cda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1047&q=80"))
        carouselDiv.append(anchor)
        var anchor = $("<a>").addClass("carousel-item").append($("<img>").attr("src", "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"))
        carouselDiv.append(anchor)
        var anchor = $("<a>").addClass("carousel-item").append($("<img>").attr("src", "https://images.unsplash.com/photo-1491731909388-282f39055af7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"))
        carouselDiv.append(anchor)
        var anchor = $("<a>").addClass("carousel-item").append($("<img>").attr("src", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1053&q=80"))
        carouselDiv.append(anchor)
        var anchor = $("<a>").addClass("carousel-item").append($("<img>").attr("src", "https://images.unsplash.com/photo-1526923268711-fa1c7e80f0e3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"))
        carouselDiv.append(anchor)

        var carouselCaption = $("<h5>").text("We're sorry, we couldn't find any pictures for this capital city").addClass("center-align")
        var captionDiv = $("<div>").append(carouselCaption)
       
        $("#pictures").append(carouselDiv) 
        $("#pictures").append(captionDiv)
    } 
    else {
        
        for (var i = 0; i < 16; i++){
            var picWidth = picList[i].width;
            var picHeight = picList[i].height;

            if (picWidth > picHeight){
            var picURL = picList[i].urls.regular;    
            
            var anchor = $("<a>").addClass("carousel-item").append($("<img>").attr("src", picURL))
            carouselDiv.append(anchor)
            $("#pictures").append(carouselDiv)  
            }
        }
    }    
    
    $('.carousel').carousel()
}

//openweathermap API to get current weather for capital city
function getWeather(capital) { 
    if (capital === "Rome"){
        capital = capital + ",it"
    }
   
    var currentQueryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + capital + "&APPID=62fca606199df2afea0a32e25faffdc5";

    $.ajax({
        url: currentQueryURL,
        method: "GET"
    }).then(function(response){
        var timeZone = (response.timezone)/60/60;
        showWeather(response);
        showTimes(timeZone);
    });
}
  
//show current weather in capital
function showWeather(response){
    $("#icon-div").removeClass("hide");
    $("#capitalCity").text(response.name)
    var icon = response.weather[0].icon;
    var iconURL = "https://openweathermap.org/img/w/" + icon + ".png";
    $("#mainIcon").attr("src", iconURL);
    var mainTemp = ((response.main.temp - 273.15) * 1.80 + 32).toFixed(0); 
    $("#temp").text(mainTemp);   
}

//get 3 day forecast for capital
function getForecast(capital){
    var forecastQueryURL= "https://api.openweathermap.org/data/2.5/forecast?q=" + capital + "&APPID=62fca606199df2afea0a32e25faffdc5";;
    $.ajax({
        url:forecastQueryURL,
        method: "GET"
    }).then(showForecast)
}

//show 3 day forecast in a modal
function showForecast(forecastResponse){
    var list = forecastResponse.list;
    var count = 1;
    var x = 7
    for (var i = 0; i < 3; i++){
        
        $("#date-"+ count).text(new Date(list[x].dt_txt).toLocaleDateString());
        
        var iconURL = "https://openweathermap.org/img/w/" + list[x].weather[0].icon + ".png";
        $("#icon-"+ count).attr("src", iconURL);

        $("#temp-"+ count).text(((list[x].main.temp- 273.15) * 1.80 +32).toFixed(0));
        
        count++; 
    	var x = x + 8
  }
}

//show time in capital city
function showTimes(timeZone){
    var currentHrs= moment().utcOffset()/60;
    var timeDif = timeZone-currentHrs;
        if (timeDif === 1) {
        $("#timeDif").text((Math.abs(timeDif)) + " hour ahead");
        } else if (timeDif === -1) {
        $("#timeDif").text((Math.abs(timeDif)) + " hour behind");
        } else if (timeDif === 0){
        $("#timeDif").text("You are in the same time zone");
        } else if (timeDif > 0){
            $("#timeDif").text((Math.abs(timeDif)) + " hours ahead");
        } 
    var capitalTime = moment().utcOffset(timeZone).format('h:mm A ' + ' / ' + 'MMMM Do');
    $("#capitalTime").text(capitalTime);

}

function currentTime() {
    $("#dateTime").text(moment().format('MMMM Do YYYY, h:mm:ss a'));
}

setInterval(currentTime,1000)

//Wiki link for the footer
function wikiLink (capital){
    var wikiURL = "https://en.wikipedia.org/wiki/" + capital;
    $("#wiki-link").text("Link for the " + capital + " " + "Wikipedia Page");
    $("#wiki-link").attr("href", wikiURL);
    }

$('#modal1').modal();