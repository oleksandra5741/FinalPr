import moment from 'moment';

let getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
};
let cities = [
    {
        name: 'Поточне місцезнаходження',
        //longitude: currentPosition.longitude,
        //latitude: currentPosition.longitude
    },
    {
        name: 'Kyiv',
        longitude: 30.490064099999994,
        latitude: 50.4346147
    },
    {
        name: 'Kharkiv',
        longitude: 36.2328,
        latitude: 49.9984
    },
    {
        name: 'Lviv',
        longitude: 23.9935,
        latitude: 49.8398
    }
];

let dic = {
    'Thunderstorm' : {
        ind: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
        img: 'img/image_for_Thunderstorm.jpg'
    },
    'Drizzle': {
        ind: [300, 301, 302, 310, 311, 312, 313, 314, 321],
        img: 'img/image_for_Drizzle.jpg'
    },
    'Rain': {
        ind: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
        img: 'img/image_for_Rain.jpg'
    },
    'Snow': {
        ind: [600, 601, 602, 611, 612, 615, 616, 620, 621, 622],
        img: 'img/image_for_Snow.jpg'
    },
    'Mist': {
        ind: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
        img: 'img/image_for_Mist.jpg'
    },
    'Clear': {
        ind: [800],
        img: 'img/image_for_Clear.jpg'
    },
    'Clouds': {
        ind: [801, 802, 803, 804],
        img: 'img/image_for_Clouds.jpg'
    },
    'Storm': {
        ind: [960, 961, 962, 959, 958, 957, 956],
        img: 'img/image_for_Storm.jpg'
    },
    'Hurricane': {
        ind: [902, 901, 900],
        img: 'img/image_for_Hurricane.jpg'
    }
};

let getWeatherClothes = (id) => {
    let indexes = Object.keys(dic);

    $('#clothesWrapper').html('');

    indexes.forEach((child) => {
        dic[child].ind.forEach((weather) => {
            if(weather == id) {
                $('#clothesWrapper').append(`<img class="img-responsive clothes" 
                    src="${dic[child].img}" alt="Image for ${child}" />`)
            }
        });
    })
};

let weatherCtrl = () => {
    let currentPosition;
    const apiKey = '06b35b79d950c1636ced91b9b62f506b';
    const apiKey_pixabay = '7345804-d2dd778dcdd715c08a57bebf3';
    $('#now').html(`${moment().format('HH:mm')}`) ;

    let getWeatherImage = (search) => {
        let settings = {
            "async": true,
            "crossDomain": true,
            "url": `https://pixabay.com/api/?key=${apiKey_pixabay}&q=${search}&image_type=photo`,
            "method": "GET"
        };

        $.ajax(settings).done(function (response) {
            $('#fountainG').css('display', 'none');
            let factor = Math.round(getRandomArbitrary(0, +response.hits.length));
            $('.jumbotronAfter').css('background-image', `url(${response.hits[factor].webformatURL})`);
        });
    };

    let parseData = (data) => {
        let temp =  Math.round(data.main.temp - 273.15);

        $('#temp').html(`${temp} °C`);
        $('#humidity').html(`${data.main.humidity} %`);
        $('#pressure').html(`${data.main.pressure} мм рт. ст.`);
        $('#clouds').html(`${data.clouds.all} %`);
        $('#visibility').html(`${data.visibility} м`);
        $('#wind').html(`${data.wind.speed} м/с`);

        let string = '';
        $('#weather').html('');

        data.weather.forEach((child) => {
           $('#weather').append(`<p>${child.description}
                <img src="http://openweathermap.org/img/w/${child.icon}.png" 
                    alt="${child.description}" class="weatherIcon">
                </p>`)

            string += `${child.main}+`;
            getWeatherClothes(child.id)
        });
        $('#fountainG').css('display', 'none');
        //getWeatherImage(string);
    };

    let getCurrentWeather = (data) => {
        let settings = {
            "async": true,
            "crossDomain": true,
            "url":
                `http://api.openweathermap.org/data/2.5/weather?lat=${data.latitude}&lon=${data.longitude}&appid=${apiKey}&lang=ua`,
            "method": "GET"
        };

        $.ajax(settings).done(function (response) {
            parseData(response);
        });
    };

    if (navigator.geolocation){
        $('#fountainG').css('display', 'block');
        navigator.geolocation.getCurrentPosition((res)=>{
            currentPosition = res.coords;
            getCurrentWeather(currentPosition);
        ﻿   cities[0].longitude = currentPosition.longitude;
            cities[0].latitude = currentPosition.latitude;
            mapInit(currentPosition);
        }, (error) => {
            console.log(error);
        })
    }

    $('#selectWeather').change(function () {
        getCurrentWeather(cities[$(this).val()]);
        mapInit(cities[$(this).val()]);
    })
};

let map;

let mapInit = (position) => {
    console.log(position);
    map.setCenter(new google.maps.LatLng( position.latitude, position.longitude ) );
};

$(document).ready(()=>{
    weatherCtrl();
});

function init(){
    let latlng = new google.maps.LatLng(0, 0);
    let myOptions = {
        zoom: 12,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map"), myOptions);
}

google.maps.event.addDomListener(window, 'load', init);
