import { useState, useEffect} from 'react'
import countryService from './services.js/countries'

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

const CountryDetails = ({ country, apiKey, weather}) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>Capital: {country.capital[0]}</p>
      <p>Area: {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img
        src={country.flags.svg}
        alt={`Flag of ${country.name.common}`}
        width="150"
      />
      <h3>Weather in {country.capital[0]}</h3>
      {/* <p>temperature {weather.main.temp} Celcius</p> */}
    </div>
  )
}

const App = () => {

  const [countries, setuserData] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const apiKey = import.meta.env.VITE_API_KEY
  const [weather, setWeather] = useState([])

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
          <CountryDetails country={selectedCountry} />
        ) : (
          <CountryList countries={countriesToShow} handleShow={handleShow} />
        )}
      </div> 
    )
  }
export default App