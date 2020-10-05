/* Global variables init */
var Countries = Array();
var html = "";
var in_box = "";

function loadCountries() {
  //alert('InLoading');
  let country = {};

  country.name = "Sverige";
  country.capital = "Stockholm";
  country.valuta = "SEK";
  country.rate = 1;
  Countries.push(country);

  country = {};
  country.name = "Finland";
  country.capital = "Helsinki";
  country.valuta = "EUR";
  country.rate = 10.474;
  Countries.push(country);

  country = {};
  country.name = "USA";
  country.capital = "Washington, DC";
  country.valuta = "USD";
  country.rate = 8.942;
  Countries.push(country);

  country = {};
  country.name = "Great Britain";
  country.capital = "London";
  country.valuta = "GBP";
  country.rate = 11.562;
  Countries.push(country);

  country = {};
  country.name = "Australia";
  country.capital = "Canberra";
  country.valuta = "AUD";
  country.rate = 6.411;
  Countries.push(country);

  country = {};
  country.name = "New Zealand";
  country.capital = "Wellington";
  country.valuta = "NZD";
  country.rate = 5.937;
  Countries.push(country);

  country = {};
  country.name = "Canada";
  country.capital = "Ottawa";
  country.valuta = "CAD";
  country.rate = 6.723;
  Countries.push(country);

  country = {};
  country.name = "Switzerland";
  country.capital = "Bern";
  country.valuta = "CHF";
  country.rate = 9.724;
  Countries.push(country);

  country = {};
  country.name = "Japan";
  country.capital = "Tokyo";
  country.valuta = "JPY";
  country.rate = 0.849;
  Countries.push(country);

  console.log(Countries); /* Comment out for production */
}

// Create the html content for the list of countries and inject into the element with id='country_list'
function createCountriesListTable() {
  html =
    '<table class="listTable_Class"><thead><tr><th>Country</th ><th>Currency</th><th>Exchange Rate</th></tr > ';
  for (let i = 0; i < Countries.length; i++) {
    html += "<tr>";
    html +=
      "<td class='countryColumn_class'>" +
      Countries[i].name +
      " (" +
      Countries[i].capital +
      ")" +
      "</td>";
    html += '<td class="center_class">' + Countries[i].valuta + "</td>";
    html += '<td class="align_right">' + Countries[i].rate + "</td>";
    html += "</tr>";
  }

  html += "</table>";

  Helper.setHtml("country_list", html);
}

function createCalculation() {
  html = '<table><thead><th id="input_err"></th><th>Currency</th></thead>';
  let temp = 0;
  for (i = 0; i < 2; i++) {
    temp = i + 1;
    html +=
      '<tr><td><input name="val_' +
      temp +
      '" id="val_' +
      temp +
      "\" onkeyup=numbChange('val_" +
      temp +
      "')></td><td><select name=\"curr_" +
      temp +
      '" id="curr_' +
      temp +
      '" onchange="currChange(\'curr_' +
      temp +
      "')\">";
    for (j = 0; j < Countries.length; j++) {
      html +=
        '<option value="' +
        j.toString() +
        '">' +
        "(" +
        Countries[j].valuta +
        ") " +
        Countries[j].name +
        "</option>";
    }
    html += "</select></td></tr>";
  }
  html +=
    "<tr><td class='clearButton' colspan=2><button id=\"clear_button\"'>Clear</button></td></tr></table>";

  Helper.setHtml("calculator", html);
}

function showCountriesList(bShow) {
  //alert("showCountriesList bShow: " + bShow.toString());
  if (Countries.length > 0) {
    Helper.setDisplay("country_list", bShow);
    Helper.setDisplay("calculator", !bShow);
    if (bShow) {
      Helper.setHtml("action_button", "Calculate");
    } else {
      Helper.setHtml("action_button", "Currency List");
      Helper.focus("val_1");
    }
  } else {
    alert("Countries not defined!");
  }
}

function changeView() {
  //alert("changeView func " + val + "\n" + Helper.getDisplay("country_list"));
  if (Helper.getDisplay("country_list") == "block") {
    showCountriesList(false);
  } else {
    showCountriesList(true);
  }
}

// Does the actual calculation called from currChange and/or numbChange event handlers.
// Collects all data from the page and calculates the amount in the other currency.
// From numbChange it also recieves information about which input field that was changed and calculates the other
// currency's amount. Valid entries for box 0 (call from currChange), 1 (call from numbChange upper inbox), 2 (call from numbChange lower inbox)
function calculate(id, box) {
  //alert("in calculate id: " + id + "\n val = " + box);
  let val1 = Helper.getValue("val_1");
  let val2 = Helper.getValue("val_2");
  let curr1 = Helper.getValue("curr_1"); // Base currency
  let curr2 = Helper.getValue("curr_2"); // Quote currency
  let exch_rate = 1;
  let result = 1;
  let res = "";

  //alert("val1= " +val1 +"\nval2 = " +val2 +"\ncurr1 = " +curr1 +"\ncurr2 = " +curr2);

  exch_rate = getExchangeRate(curr1, curr2);

  if ((in_box == "val_1" || in_box == "") && val1 !== "") {
    result = val1 * exch_rate;
    //alert("calculate \nindexof(.) = " + result.toString().indexOf("."));
    if (result.toString().indexOf(".") > 0) {
      res = result.toString().substring(0, result.toString().indexOf(".") + 3);
    } else {
      res = result; //result.toString().substring(0, result.toString().indexOf(".") + 3);
    }
    Helper.setValue("val_2", res);
  } else {
    if (val2 !== "") {
      result = val2 * exch_rate;
      if (result.toString().indexOf(".") > 0) {
        result += 0.005;
        res = result
          .toString()
          .substring(0, result.toString().indexOf(".") + 3);
      } else {
        res = result; //result.toString().substring(0, result.toString().indexOf(".") + 3);
      }
      Helper.setValue("val_1", res);
    }
  }
  if (in_box == "val_2") {
    Helper.focus(in_box);
  } else {
    Helper.focus("val_1");
  }
}

function getExchangeRate(c1, c2) {
  // alert("getExchangeRate\n" + "c1 = " + c1 + "\nc2 = " + c2 + "\nin_box = " + in_box);
  let result = Countries[c1].rate / Countries[c2].rate;
  // alert("getExchangeRate result = " + result);
  if (in_box == "val_1" || in_box == "") {
    return result;
  } else {
    return 1 / result;
  }
}

// Responds to the onChange event for the dropdown lists
function currChange(id) {
  //alert("in currChange obj: " + id);
  calculate(id, 0);
}

// Responds to the onKeyPress event from the input fields.
function numbChange(id) {
  //alert("numbChange, id = " + id);
  let temp = Helper.getValue(id);
  //alert("numbChange temp= " + temp);
  if (isNumber(temp)) {
    if (id == "val_1") {
      in_box = "val_1";
      calculate(id, 1);
    } else if (id == "val_2") {
      in_box = "val_2";
      calculate(id, 2);
    } else {
      alert(
        "Function numbChange did not receive a proper id atribute \n id = " + id
      );
    }
  } else {
    Helper.setHtml("input_err", temp + " is not a number or .");
  }
}
// inputs a string/number and checks if the character is a number.
// Returns true for number and false for all else.
// Will not allow , but . as a decimal point nor will it allow thousands separators.
// any character that is not a number or a . (period) will return a false value.
function isNumber(x) {
  //alert("in isNumber, x = " + x + "\nNumber(x) = " + Number(x));
  Helper.setHtml("input_err", "");
  if (Number(x).toString() !== "NaN" || x == ".") {
    //alert("isNumber = true");
    return true;
  } else {
    //alert("isNumber = false");
    return false;
  }
}

function clear() {
  Helper.setValue("val_2", "");
  Helper.setValue("val_1", "");
  Helper.focus("val_1");
}
