
class controlClass {
    constructor() { }


    inputSelection(data) {
        View.closeError('inputError', false);
        //alert('inputSelector\ndata: ' + data.value + '\nchecked: ' + data.checked);
        //alert('1 cities length: ' + CitiesIndex.length);
        if (data.checked && CitiesIndex.length < 6) {
            CitiesIndex.push(Number(data.value));
            //alert('cities length: ' + CitiesIndex.length);
        }
        else if (!data.checked && CitiesIndex.length > 1) {

            let temp = CitiesIndex.indexOf(Number(data.value));
            //alert('index: ' + CitiesIndex + '\ndata: ' + data.value + '\ntemp: ' + temp);
            CitiesIndex.splice(CitiesIndex.indexOf(Number(data.value)), 1);
            //alert('cities: ' + CitiesIndex);
        }
        else {
            View.inputError('inputError', "No more than 6 and no less than 1 city can be selected.");
        }
        if (CitiesIndex.length < 7) {
            Controller.loadCityWeatherData();
        }

    }
    // Creates the query string that will get the weather for the city.
    loadCityWeatherData() {
        let queryStr1 = 'http://api.openweathermap.org/data/2.5/group?id=';
        let queryStr2 = '&APPID=04317c363ddc293ec154e0747c54c30e';
        let tmp = '';
        let url = '';

        for (let i = 0; i < CitiesIndex.length; i++) {

            // tmp += Cities[CitiesIndex[i]].id + ',';
            tmp += CitiesIndex[i] + ',';

        }

        url = queryStr1 + tmp.slice(0, -1) + queryStr2;

        Model.loadData(url)
            .then(response => response.json())
            .then(function (data) {
                Weather = data;
                document.dispatchEvent(weatherDataLoaded);
            })
            .catch(error => alert(error))

        //console.log(Weather);
    }

    loadWeatherIcon(data) {
        let queryString1 = 'http://openweathermap.org/img/wn/';
        let queryString2 = '@2x.png';
        //alert('url data: ' + data);
        let url = queryString1 + data + queryString2;

        return url;
    }

    selctedCity(id, lon, lat) {
        //alert('selectedCity: ' + id + '\nlon: ' + lon + '\nlat: ' + lat);
        Controller.loadMap(id, lon, lat, 2);
    }

    loadMap(id, lon, lat, zoom) {
        //alert('loadMap: ' + id + '\nlon: ' + lon + '\nlat: ' + lat);
        let xTile = this.lon2tile(lon, zoom);
        let yTile = this.lat2tile(lat, zoom);
        let queryString1 = 'http://tile.openweathermap.org/map/wind_new/';
        let tmp = zoom + '/' + xTile + '/' + yTile;
        let queryString2 = '.png?&APPID=04317c363ddc293ec154e0747c54c30e';

        View.displayMap(queryString1 + tmp + queryString2);
    }

    lon2tile(lon, zoom) {
        return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
    }

    lat2tile(lat, zoom) {
        return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
    }


    init() {
        Model.loadData('./json/cities.json')
            .then(response => response.json())
            .then(function (data) {
                Cities = data;
                Controller.loadCityWeatherData();
            })
            .catch(error => alert(error))
    }


}