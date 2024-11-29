import { useState, useEffect} from 'react'
import countryService from './services/countries'

const FilterForm = ({filter, handleFilterChange}) => (
<div>
  find countries: <input value = {filter} onChange={handleFilterChange}/>
</div>
)

const CountryList = ({countries, handleShow}) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length === 1) {
    return <CountryDetails country={countries[0]} />
  }

  return (
    <ul>
      {countries.map(country => (
        <div key={country.name.common}>
          {country.name.common}{' '}
          <button onClick={() => handleShow(country.name.common)}>show</button>
        </div>
      ))}
    </ul>
  )
}

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (country && country.capital) {
      countryService
        .getWeather(country.capital[0])
        .then(result => {
          setWeather(result)
        });
    }
  }, [country])

  if (!country || weather === null) return null

  return (
    <div>
      <h2>Weather in {country.capital[0]}</h2>
      <p>Temperature: {weather.main.temp} celcius</p>
      <img alt="weather icon" src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
      <p>Wind: {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryDetails = ({ country }) => {
  return (
    <div>
      <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}</p>
      <h3>Languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img
        src={country.flags.svg}
        width="200"
      />
      </div>
      <Weather country={country}/>
    </div>
  )
}

const App = () => {

  const [countries, setuserData] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)

useEffect(() => {
  countryService
    .getAll()
    .then(data => {
      setuserData(data)
})
  }, [])

    const handleFilterChange = (event) => {
      setFilter(event.target.value)
      setSelectedCountry(null)
    }

    const handleShow = (countryName) => {
      const country = countries.find(c => c.name.common === countryName)
      setSelectedCountry(country)
    }
    
    const countriesToShow = filter
    ? countries.filter(country =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
      )
    : []


    return (
      <div>
        <FilterForm filter={filter} handleFilterChange={handleFilterChange} />
        {selectedCountry ? (
          <div>
          <CountryDetails country={selectedCountry} />
          </div>
        ) : (
          <CountryList countries={countriesToShow} handleShow={handleShow}/>
        )}
      </div> 
    )
  }
export default App