const cityInput=document.querySelector(".city-Input")
const searchBtn=document.querySelector(".search-Btn");

const notFoundSection=document.querySelector(".not-Found");
const searchCitySection=document.querySelector(".search-city");
const weatherInfoSection=document.querySelector(".weather-Info");
const countryText=document.querySelector(".country-Text");
const tempText=document.querySelector(".temp-Text");
const conditionText=document.querySelector(".condition-Text");
const humidityValueText=document.querySelector(".humidity-Value-Text");
const windValueText=document.querySelector(".wind-Value-Text");
const weatherSummeryImg=document.querySelector(".weather-Summery-Img");
const currentDataTex=document.querySelector(".current-Data-Tex");
const forecastItemsContainer=document.querySelector(".forecast-Items-Container");



const apiKey='88ebb1320849d0db99549099a69dd89f';


searchBtn.addEventListener("click",()=>{
    
    if(cityInput.value.trim() !=""){
   updateWeatherInfo(cityInput.value);
    cityInput.value="";
    cityInput.blur();
    }
})
cityInput.addEventListener("keydown",(event)=>{
    if(event.key=='Enter' && cityInput.value.trim() !=""){
        updateWeatherInfo(cityInput.value);
    cityInput.value="";
    cityInput.blur();
    }

})

async function getFetchData(endPoint,city){
    const apiUrl=`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
    const response= await fetch(apiUrl)
     return response.json();

}

function getWeatherIcon(id){
    if(id<=232) return "thunder.png";
    if(id<=321) return "cloudy-day.png";
    if(id<=531) return "rainy.png";
    if(id<=622) return "wind.png";
    if(id<=781) return "atmospher.png";
    if(id<=800) return "sun.png";
    else return "cloudy.png"


}
function getCurrentData(){
    const CurrentData=new Date();
    const options={
        weekday:"short",
        day:"2-digit",
        month:"short"
    }
    return CurrentData.toLocaleDateString('en-GB',options);
}

async function updateWeatherInfo(city){
      
    const weatherData=await getFetchData('weather',city);
    //console.log(weatherData);

    if(weatherData.cod!=200){
      showDisplaySection(notFoundSection);
        return;
    }
  

    const {
      name:country,
      main:{ temp,humidity},
      weather:[{id,main}],
      wind:{speed}
    }=weatherData;

    countryText.textContent=country;
    tempText.textContent=Math.round(temp)+ " °C";
    conditionText.textContent=main;
    humidityValueText.textContent=humidity+"%";
    windValueText.textContent=speed+" M/s";

    currentDataTex.textContent=getCurrentData();

    weatherSummeryImg.src=`state/${getWeatherIcon(id)}`
    await updateForecastInfo(city);

      showDisplaySection(weatherInfoSection);

}
async function updateForecastInfo(city){
    const forecastData= await getFetchData('forecast',city);
    //console.log(forecastData);
    const timeTaken="12:00:00";
    const todayDate=new Date().toISOString().split("T")[0];

    forecastItemsContainer.innerHTML=''

    forecastData.list.forEach(forecastWeather=>{
       // console.log(forecastData);
       if(forecastWeather.dt_txt.includes(timeTaken)&&
                    !forecastWeather.dt_txt.includes(todayDate)){
                    //console.log(forecastData);
                    updateForecastItems(forecastWeather)
       }
    })
}
function updateForecastItems(weatherData){
    const{
        dt_txt:date,
        weather:[{ id}],
        main:{temp}
    }=weatherData

const dataTaken=new Date(date)
const dataOptions={
    day:'2-digit',
    month:'short',
}
const dataResult=dataTaken.toLocaleDateString('en-US',dataOptions)
    const forecastItem=`
    <div class="forecast-Item">
            <h5 class="forecast-Item-date regular-Text">${dataResult}</h5>
            <img src="state/${getWeatherIcon(id)}"  class="forecast-Item-Img">
            <h5 class="forecast-Item-Temp">${Math.round(temp)} °C</h5>
        </div>
    `
forecastItemsContainer.insertAdjacentHTML("beforeend",forecastItem)
}

function showDisplaySection(section){
    [weatherInfoSection,searchCitySection,notFoundSection]
    .forEach(section=>section.style.display="none")

    section.style.display="flex";

}