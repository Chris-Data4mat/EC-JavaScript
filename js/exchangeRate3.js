
// Create events
const onERLoaded = document.createEvent('Event');
onERLoaded.initEvent('onExchangeRatesLoaded', true, true);

const onCLoaded = document.createEvent('Event');
onCLoaded.initEvent('onCountriesLoaded', true, true);

// Test function for onERLoaded event. Note: Works!
function testEvent() {
  alert('Test Event "onERLoaded" Works!');
}

// Test function for onCLoaded event. Note: Works!
function testEvent2() {
  alert('Test Event "onCLoaded" Works!');
}

/* Global variables init */
var Countries = Array();
var html = "";
var in_box = "";
var newRates = Array();
var createListFirstRun = true;
var baseCurrency = "USD";

function initData() {

  //alert("initData");
  //let country = {};
  //document.dispatchEvent(onERLoaded); // testing onERLoaded event.
  //alert("initData after dispatchEvent.");
  //document.dispatchEvent(onCLoaded);

  fetch("./json/exchangeRate2.json")
    .then((response) => response.json())
    .then(function (data) {
      //alert("data: " + data);
      Countries = data;

      let xdata;
      // ******** Developer NOTE ****** Put the second fetch in a function. Makes the code cleaner to read.
      fetch(
        "https://v6.exchangerate-api.com/v6/352611ef689d2d7857379dd1/latest/" +
        baseCurrency
      )
        .then((response) => response.json())
        .then(function (xdata) {
          //alert("data in getNewRates: " + xdata);
          newRates = xdata;
          for (let i = 0; i < Countries.length; i++) {
            //alert("newRates: " + newRates["conversion_rates"][Countries[i].currency]);
            Countries[i].rate =
              newRates["conversion_rates"][Countries[i].currency];
          }
          // Creates the countries list table page
          //alert('before createCountriesList()');
          createCountriesListTable();
          // Creates the calculation page
          if (createListFirstRun) {
            createCalculation();
          }
          // Opens the Country list page as a default
          showCountriesList(true);
          if (createListFirstRun) {
            addEvents();
          }
        });
      //alert("newData in loadCountries: " + newRates);
      //alert("Countries in loadCountries: " + Countries);
    });
  console.log(Countries); /* Comment out for production */
}

// Create the html content for the list of countries and inject into the element with id='country_list'
function createCountriesListTable() {
  //alert("in CreateCountry List");
  html =
    '<table class="listTable_Class"><tr><td class="align_right">Select base currency:</td><td><select id="baseCurr" class="selectCurrency" name="baseCurr" onchange="selectBaseCurrency()">';
  for (j = 0; j < Countries.length; j++) {
    html += '<option class="selectCurrency" value="' + j.toString() + '"';
    if (Countries[j].currency == baseCurrency) {
      html += " selected";
    }
    html +=
      ">(" + Countries[j].currency + ") " + Countries[j].name + "</option>";
  }
  html +=
    '</select></tr></table><table class="listTable_Class"><thead><tr><th>Country</th ><th>Currency</th><th>Exchange Rate</th></tr ></thead><tbody>';
  for (let i = 0; i < Countries.length; i++) {
    html += "<tr>";
    html +=
      "<td class='countryColumn_class'>" +
      Countries[i].name +
      " (" +
      Countries[i].capital +
      ")" +
      "</td>";
    html += '<td class="center_class">' + Countries[i].currency + "</td>";
    html +=
      '<td class="align_right" id="rate_' +
      i.toString() +
      '">' +
      Countries[i].rate +
      "</td>";
    html += "</tr>";
  }

  html += "</tbody></table>";

  Helper.setHtml("country_list", html);
}

function selectBaseCurrency() {
  let var1 = Helper.getValue("baseCurr");
  //alert("selectBaseCurrency var1: " + var1);
  baseCurrency = Countries[var1].currency;
  //alert("selectBaseCurrency baseCurrency: " + baseCurrency);
  createListFirstRun = false;
  initData();
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
      html += '<option value="' + j.toString() + '"';
      if (i == 0 && Countries[j].currency == "USD") {
        html += " selected";
      } else if (i == 1 && Countries[j].currency == "EUR") {
        html += " selected";
      }

      html +=
        "> " +
        "(" +
        Countries[j].currency +
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
  clear();
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
  } else if (val_1 == "") {
    Helper.setValue("val_2", "");
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
    } else {
      Helper.setValue("val_1", "");
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
    return 1 / result;
  } else {
    return result;
  }
}

// Responds to the onChange event for the dropdown lists
function currChange(id) {
  alert("in currChange obj: " + id);
  calculate(id, 0);
}

// Responds to the onKeyPress event from the input fields.
function numbChange(id) {
  //alert("numbChange, id = " + id);
  let temp = Helper.getValue(id);
  //alert("numbChange temp= " + temp);
  if (temp == "") {
    clear();
    Helper.focus(id); // et focus on the box that caused the action.
  } else {
    if (isNumber(temp)) {
      if (id == "val_1") {
        in_box = "val_1";
        calculate(id, 1);
      } else if (id == "val_2") {
        in_box = "val_2";
        calculate(id, 2);
      } else {
        alert(
          "Function numbChange did not receive a proper id atribute \n id = " +
          id
        );
      }
    } else {
      if (temp !== "") {
        Helper.setHtml("input_err", temp + " is not a number or .");
      }
    }
  }
}
// inputs a string/number and checks if the character is a number.
// Returns true for number and false for all else.
// Will not allow , but . as a decimal point nor will it allow thousands separators.
// any character that is not a number or a . (period) will return a false value.
function isNumber(x) {
  //alert("in isNumber, x = " + x + "\nNumber(x) = " + Number(x));
  Helper.setHtml("input_err", "");
  //alert("isNumber Number(): " + Number(x).toString());
  if (x != "" && (Number(x).toString() !== "NaN" || x == ".")) {
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
