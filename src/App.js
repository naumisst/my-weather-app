import React, { useState } from 'react';

const API_KEY = "b8fa0605c6097f20c99e76898d7478cc";

function App() {
  const [city, setCity] = useState('');
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState('');

  const fetchForecast = async () => {
    if (!city) return;
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    const data = await res.json();
    if (data.cod !== "200") {
      setError(data.message);
      setForecast([]);
      return;
    }
    setError('');
    const grouped = {};

    data.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });

    const result = Object.keys(grouped).slice(0, 5).map(date => {
      const items = grouped[date];
      const temps = items.map(i => i.main.temp);
      const weatherMid = items[Math.floor(items.length/2)].weather[0];
      return {
        date,
        min: Math.min(...temps),
        max: Math.max(...temps),
        condition: weatherMid.main,
        icon: weatherMid.icon
      };
    });
    setForecast(result);
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>5‑Day Weather Forecast</h1>
      <input
        placeholder="City..."
        value={city}
        onChange={e => setCity(e.target.value)}
      />
      <button onClick={fetchForecast}>Get Forecast</button>
      {error && <p style={{color:'red'}}>{error}</p>}
      <div>
        {forecast.map(f => (
          <div key={f.date} style={{border:'1px solid #ccc', margin:'1rem 0', padding:'1rem'}}>
            <strong>{f.date}</strong><br/>
            <img
              src={`https://openweathermap.org/img/wn/${f.icon}@2x.png`}
              alt={f.condition}
            /><br/>
            {f.condition} | {f.min.toFixed(1)}°C - {f.max.toFixed(1)}°C
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
