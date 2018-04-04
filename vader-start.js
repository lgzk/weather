'use strict';

/* Förklaringar till förkortningarna i parameterlistan som returneras från SMHI
spp         frozen precipitation, %                 int, 0-100, -9 om null
pcat        precipitation category                  int, 0-6
pmin        minimum precipitation intensity, mm/h   decimal, 1 decimal
pmean       mean precipitation intensity, mm/h      decimal, 1 decimal
pmax        maximum precipitation intensity, mm/h   decimal, 1 decimal
pmedian     median precipitation intensity, mm/h    decimal, 1 decimal
tcc_mean    total cloud cover, mean                 int, 0-8
lcc_mean    low level cloud cover, mean             int, 0-8
mcc_mean    medium level cloud cover, mean          int, 0-8
hcc_mean    high level cloud cover, mean            int, 0-8
msl         air pressure, hPa                       decimal, 1 decimal
t           temperature, C                          decimal, 1 decimal
vis         visibility, km                          decimal, 1 decimal
wd          wind direction, degree                  int
ws          wind speed, m/s                         decimal, 1 decimal
r           relative humidity, %                    int, 0-100
tstm        thunder probability, %                  int, 0-100
gust        wind gust speed, m/s                    decimal, 1 decimal
Wsymb2      weather symbol                          int, 1-27
 */

/* Givna konstanter, longitud och latitud för Malmö, url till SMHI,
  månadsnamn, namn på vädertyperna (med en tom typ först för att de ska
  ha ett index som motsvarar symbolernas nummer):
*/
const lonMalmo = 13.087616;
const latMalmo = 55.436559;
const url = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${lonMalmo}/lat/${latMalmo}/data.json`;
const months = [
  'jan',
  'feb',
  'mar',
  'apr',
  'maj',
  'jun',
  'jul',
  'jun',
  'aug',
  'sep',
  'okt',
  'nov',
  'dec'
];
const vadertyp = [
  '',
  'Klart',
  'L&auml;tt molnighet',
  'Halvklart',
  'Molningt',
  'Mycket moln',
  'Mulet',
  'Dimma',
  'L&auml;tta regnskurar',
  'Regnskurar',
  'Kraftiga regnskurar',
  '&Aring;skskurar',
  'L&auml;tta byar med regn och sn&ouml;',
  'Byar av regn och sn&ouml;',
  'Kraftiga byar av regn och sn&ouml;',
  'L&auml;tta sn&ouml;byar',
  'Sn&ouml;byar',
  'Kraftiga sn&ouml;byar',
  'L&auml;tt regn',
  'Regn',
  'Kraftigt regn',
  '&Aring;ska',
  'L&auml;tt sn&ouml;blandat regn',
  'Sn&ouml;blandat regn',
  'Kraftigt sn&ouml;blandat regn',
  'L&auml;tt sn&ouml;fall',
  'M&aring;ttligt sn&ouml;fall',
  'Ymnigt sn&ouml;fall'
];
const mittObjekt = {
  styrka: 5,
  storlek: 'XL',
  varianter: { colors: ['red', 'green', 'blue'] }
};

// const objektStyrkan = mittObjekt.styrka;
// const firstColorInObject = mittObjekt.varianter.colors[2]; // blue
// console.log(firstColorInObject);

const listan = document.getElementById('lista');

//array for temp

let diagramTemp =[];

//array for time

let diagramTime =[];

fetch(url)
  .then(response => response.json())
  .then((vaderJson) => {
    const tidsSerie = vaderJson.timeSeries;
    tidsSerie.forEach((tidpunkt) => {
      const { validTime, parameters } = tidpunkt;
      const vadersymbol = parameters.find(parameterObjekt => parameterObjekt.name === 'Wsymb2').values[0];
      const temperatur = parameters.find(parameterObjekt => parameterObjekt.name === 't').values[0];
      const vindstyrka = parameters.find(parameterObjekt => parameterObjekt.name === 'ws').values[0];
      const byvind = parameters.find(parameterObjekt => parameterObjekt.name === 'gust').values[0];
      const lokalTid = new Date(validTime);
      const listObjekt = document.createElement('li');
      diagramTemp.push(temperatur);
      diagramTime.push(lokalTid);

      listObjekt.innerHTML = `<h3><img src="bilder/${vadersymbol}.png" alt="${vadertyp[vadersymbol]}" /> ${temperatur}°C</h3>
      <p>${lokalTid.getDate()} ${months[lokalTid.getMonth()]} kl. ${lokalTid.getHours()}</p>
      <p>Vindstyrka: ${vindstyrka}(${byvind})</p>`;
      listan.appendChild(listObjekt);
    });
  });

const ctx = document.getElementById('myChart');
const myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: diagramTime, //tid
    datasets: [
      {
        label: 'Temp (°C)',
        data: diagramTemp, //tempuratur
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }
});

console.log(diagramTemp);
