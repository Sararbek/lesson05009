const cityName = document.querySelector(".cityName")
const cityTemp = document.querySelector(".cityTemp")
const mainImg = document.querySelector(".mainImg")
const leftForecatsWrapperEl = document.querySelector(".content__showForcast__forecastHours")
const possWeatherEl = document.querySelector(".possWeather")

const realFeelEl = document.querySelector(".realFeel")
const windEl = document.querySelector(".wind")
const chanceOREL = document.querySelector(".chaceOR")
const UVEl = document.querySelector(".UVin")

const rightForecastWrapperEl = document.querySelector(".content__rightwrap__days")

const  BASE_URL = "https://api.weatherapi.com/v1/forecast.json?key=c3a6dc4386cc49e7ba0155411242212&q=Tashkent&days=10&aqi=yes&alerts=yes"
                  
async function fetchData() {
    try{
        const response = await fetch(`${BASE_URL}`)
        if(!response.ok){
            throw new Error(`Error: ${response.status}`)
        }

        const respondedData = await response.json()
        console.log(respondedData)
        createMainTemppicture(respondedData)
        showForecats(respondedData.forecast)
        showForecastDays(respondedData.forecast)
    }catch(err){
        console.log(err.message)
    }finally{

    }
}

window.onload = () => {
    fetchData()
}

function createMainTemppicture(data){
    cityName.textContent = data.location.name
    cityTemp.textContent = data.current.temp_c + "°"
    mainImg.src = data.current.condition.icon 
}

function showForecats(data){
    data.forecastday[0].hour.forEach(eachHour => {

        const specialHour = eachHour.time_epoch
        const date = new Date(specialHour * 1000)

        if(Date.now() >= date){
            possWeatherEl.textContent = `Chance of rain: ${eachHour.chance_of_rain}%`
            realFeelEl.textContent = eachHour.feelslike_c
            windEl.textContent = eachHour.wind_kph + " km/h"
            chanceOREL.textContent = eachHour.chance_of_rain + " %"
            UVEl.textContent = eachHour.uv
        }

        if(Date.now() <= date){
            const forecastDayEl = document.createElement("li")
        forecastDayEl.innerHTML = `
            <span>${date.getHours().length == 1 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() + "0"}</span>
            <span><img src=${eachHour.condition.icon}></span>
            <span>${eachHour.temp_c} °</span>
        `
        leftForecatsWrapperEl.appendChild(forecastDayEl)
        }
    })
}

function showForecastDays(data){
    const weekdays = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ]
    data.forecastday.forEach(eachDay => {
        const liEl = document.createElement("li")
        liEl.innerHTML = `
            <span>${new Date().getDay() === new Date(eachDay.date_epoch * 1000).getDay() ? "Today" : weekdays[new Date(eachDay.date_epoch * 1000).getDay()]}</span>
            <p><span><img src=${eachDay.day.condition.icon}></span> <span>Sunny</span></p>
            <p><span>${eachDay.day.maxtemp_c}</span>/${eachDay.day.mintemp_c}</p>
        `
        rightForecastWrapperEl.appendChild(liEl)
    })
}
