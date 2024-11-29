import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getWeather = (city) => {
    const apiKey = import.meta.env.VITE_API_KEY
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    const request = axios.get(weatherUrl)
    return request.then(response => response.data)
}

export default {getAll, getWeather}