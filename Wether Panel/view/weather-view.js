
class viewClass {
    constructor() { }

    initPage() {
        View.createWeatherBoxSelector();
        //alert('Weather["list"].length: ' + Weather["list"].length);
        let html = '<div id="weather_box_holder" class="weather_box_holder">';

        for (let i = 0; i < Weather["list"].length; i++) {
            html += '<div class="weather_box" id="weather_box_' + i + '" onclick="Controller.selctedCity(';
            html += Weather["list"][i]["id"] + ',' + Weather["list"][i]["coord"]["lon"] + ',' + Weather["list"][i]["coord"]["lat"];
            html += ')">';
            html += View.getFrame(i);
            html += '</div>';
        }
        html += '</div>';
        Helper.setHtml('weather_box_container', html);
    }

    getFrame(indx) {
        let html = '<table>';

        //Create table header
        html += '<thead>';
        html += '<th class="align_center selectable" colspan="4">'
        html += Weather["list"][indx]["name"] + ', ' + Weather["list"][indx]["sys"]["country"];
        html += '</th></thead>';

        // ***** Create table body START *****
        // Date on one row
        html += '<tbody class="selectable"><tr><td class="align_center" colspan="4">';
        html += View.calculateDate(Weather["list"][indx]["dt"], Weather["list"][indx]["sys"]["timezone"]);
        html += '</td></tr>';

        //image over two rows and 2 columns
        html += '<tr><td class="icon" colspan="2" rowspan="2"><img src="';
        html += Controller.loadWeatherIcon(Weather["list"][indx]["weather"][0]["icon"]);
        html += '" /></td>';
        html += '<td rowspan="2" colspan="2">';
        //inner table
        html += '<table ><tr><td class="align_center">';
        html += Weather["list"][indx]["weather"][0]["main"];
        html += '</td></tr>';
        html += '<tr><td class="align_center weather_description">';
        html += Weather["list"][indx]["weather"][0]["description"];
        html += '</td></tr></table></td></tr><tr></tr>';

        //Lower row 1 temperature and current time.
        html += '<tr><td class="align_right label">Temp:</td><td>';
        html += View.calculateTemperature(Weather["list"][indx]["main"]["temp"]);
        html += '</td><td class="align_right label">Time:</td><td>';
        html += View.calculateTime(Weather["list"][indx]["dt"], Weather["list"][indx]["sys"]["timezone"]);
        html += '</td></tr>';

        //Lower row 2 min-temperature and sunrise.
        html += '<tr><td class="align_right label">min:</td><td>';
        html += View.calculateTemperature(Weather["list"][indx]["main"]["temp_min"]);
        html += '</td><td class="align_right label">Sunrise:</td><td>';
        html += View.calculateTime(Weather["list"][indx]["sys"]["sunrise"], Weather["list"][indx]["sys"]["timezone"]);
        html += '</td></tr>';

        //Lower row 3 max-temperature and sunset.
        html += '<td class="align_right label">max:</td><td>';
        html += View.calculateTemperature(Weather["list"][indx]["main"]["temp_max"]);
        html += '</td><td class="align_right label">Sunset:</td><td>';
        html += View.calculateTime(Weather["list"][indx]["sys"]["sunset"], Weather["list"][indx]["sys"]["timezone"]);
        html += '</td></tr>';

        html += '</tbody></table>';
        return html;
    }

    createWeatherBoxSelector() {
        //alert('createWeatherBoxSelector\ncitiesIndex: ' + CitiesIndex);
        let html = '<div id="weather_box_selector_holder" class="weather_box_selector_holder">';
        html += '<div class="select_item_group">';

        for (let i = 0; i < Cities.length; i++) {
            html += '<input type="checkbox" id="' + Cities[i].id + '" value="' + Cities[i].id + '" onchange="Controller.inputSelection(this)"';
            if (CitiesIndex.includes(Cities[i].id)) {
                html += ' checked';
            }
            html += '> ';
            html += '<label for="' + Cities[i].id + '">' + Cities[i].name + ', ' + Cities[i].country + '</label>';
            if ((i + 1) % 3 != 0) {
                html += '<br>';
            }
            if ((i + 1) % 3 == 0 && i < Cities.length) {
                html += '</div><div class="select_item_group">';
            }

        }
        html += "</div></div>";

        Helper.setHtml('weather_box_selector', html);

    }

    displayMap(src) {
        let html = '<img src="' + src + '" />';
        //alert('displayMap \nhtml: ' + html);
        Helper.setHtml('weather_map_container', html);
    }

    calculateTime(utcTimeStamp, timezoneCode) {
        let data = new Date((utcTimeStamp + timezoneCode) * 1000);
        //alert(data.toUTCString());
        return data.toUTCString().slice(17, 22);
    }

    calculateDate(utcTimeStamp, timezoneCode) {
        //alert('time:' + utcTimeStamp + '\nzone: ' + timezoneCode);
        let data = new Date((utcTimeStamp + timezoneCode) * 1000);
        //alert(data);
        return data.toUTCString().slice(0, 16);
    }

    // Converts from Kelvin to Celcius
    calculateTemperature(data) {
        return (data - 273.15).toFixed(1);
    }

    closeError(id, bool) {
        Helper.setDisplay(id, bool);
    }

    inputError(id, message) {
        Helper.setDisplay(id, true);
        Helper.setHtml(id, message);
    }
}