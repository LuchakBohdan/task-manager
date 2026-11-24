// Weather Manager — real weather + condensation droplets on the glass
// Uses Open-Meteo (free, no API key required)
'use strict';

class WeatherManager {
    constructor() {
        this.layer = null;
        this.backdrop = null;
        this.weather = null;
        this.cacheKey = 'tm_weather_v2';
        this.fallback = { lat: 50.4501, lon: 30.5234 }; // Kyiv
        this.refreshMs = 30 * 60 * 1000;

        this.init();
    }

    init() {
        this.ensureLayer();
        this.ensureBackdrop();
        this.applyCache();
        this.fetchWeather();
        window.setInterval(() => this.fetchWeather(), this.refreshMs);
        let resizeTimer = null;
        window.addEventListener('resize', () => {
            if (!this.weather) return;
            clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => this.renderBackdrop(), 250);
        });
    }

    ensureLayer() {
        let layer = document.querySelector('.rain-layer');
        if (!layer) {
            layer = document.createElement('div');
            layer.className = 'rain-layer';
            layer.setAttribute('aria-hidden', 'true');
            document.body.appendChild(layer);
        }
        this.layer = layer;
    }

    ensureBackdrop() {
        let backdrop = document.querySelector('.rain-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'rain-backdrop';
            backdrop.setAttribute('aria-hidden', 'true');
            document.body.insertBefore(backdrop, document.body.firstChild);
        }
        this.backdrop = backdrop;
    }

    applyCache() {
        try {
            const cached = JSON.parse(localStorage.getItem(this.cacheKey) || 'null');
            if (cached && cached.data && Date.now() - cached.ts < 3 * 60 * 60 * 1000) {
                this.applyWeather(cached.data);
            }
        } catch (err) {
            /* ignore broken cache */
        }
    }

    async fetchWeather() {
        const position = await this.getPosition();

        try {
            const url = new URL('https://api.open-meteo.com/v1/forecast');
            url.searchParams.set('latitude', position.lat.toFixed(4));
            url.searchParams.set('longitude', position.lon.toFixed(4));
            url.searchParams.set(
                'current',
                'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m'
            );
            url.searchParams.set('daily', 'precipitation_probability_max');
            url.searchParams.set('forecast_days', '1');
            url.searchParams.set('timezone', 'auto');

            const response = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = await response.json();
            if (!data || !data.current) throw new Error('No current weather data');

            this.applyWeather(data);

            try {
                localStorage.setItem(this.cacheKey, JSON.stringify({ data, ts: Date.now() }));
            } catch (err) {
                /* storage may be full or blocked — not critical */
            }
        } catch (err) {
            console.warn('Weather fetch failed:', err);
            if (!this.weather) this.renderUnavailable();
        }
    }

    getPosition() {
        return new Promise((resolve) => {
            if (!('geolocation' in navigator)) {
                resolve(this.fallback);
                return;
            }

            let settled = false;
            const finish = (coords) => {
                if (settled) return;
                settled = true;
                resolve(coords);
            };

            const timer = window.setTimeout(() => finish(this.fallback), 9000);

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    window.clearTimeout(timer);
                    finish({ lat: pos.coords.latitude, lon: pos.coords.longitude });
                },
                () => {
                    window.clearTimeout(timer);
                    finish(this.fallback);
                },
                { timeout: 8000, maximumAge: 15 * 60 * 1000 }
            );
        });
    }

    /* ---------- weather description ---------- */

    describe(code) {
        // WMO weather interpretation codes
        const table = {
            0:  { key: 'clear',   icon: '☀️', descKey: 'weatherClearSky',        level: 0 },
            1:  { key: 'clear',   icon: '🌤️', descKey: 'weatherMostlyClear',     level: 0 },
            2:  { key: 'clouds',  icon: '⛅', descKey: 'weatherPartlyCloudy',    level: 0 },
            3:  { key: 'clouds',  icon: '☁️', descKey: 'weatherOvercast',         level: 0 },
            45: { key: 'fog',     icon: '🌫️', descKey: 'weatherFog',              level: 1 },
            48: { key: 'fog',     icon: '🌫️', descKey: 'weatherRimeFog',         level: 1 },
            51: { key: 'drizzle', icon: '🌦️', descKey: 'weatherLightDrizzle',    level: 1 },
            53: { key: 'drizzle', icon: '🌦️', descKey: 'weatherDrizzle',          level: 1 },
            55: { key: 'drizzle', icon: '🌦️', descKey: 'weatherDenseDrizzle',    level: 2 },
            56: { key: 'drizzle', icon: '🌧️', descKey: 'weatherFreezingDrizzle', level: 1 },
            57: { key: 'drizzle', icon: '🌧️', descKey: 'weatherFreezingDrizzleDense', level: 2 },
            61: { key: 'rain',    icon: '🌧️', descKey: 'weatherLightRain',       level: 1 },
            63: { key: 'rain',    icon: '🌧️', descKey: 'weatherRain',             level: 2 },
            65: { key: 'rain',    icon: '🌧️', descKey: 'weatherHeavyRain',       level: 3 },
            66: { key: 'rain',    icon: '🌧️', descKey: 'weatherFreezingRain',    level: 2 },
            67: { key: 'rain',    icon: '🌧️', descKey: 'weatherFreezingRain',    level: 3 },
            71: { key: 'snow',    icon: '🌨️', descKey: 'weatherLightSnow',       level: 1 },
            73: { key: 'snow',    icon: '🌨️', descKey: 'weatherSnow',             level: 2 },
            75: { key: 'snow',    icon: '❄️', descKey: 'weatherHeavySnow',       level: 3 },
            77: { key: 'snow',    icon: '❄️', descKey: 'weatherSnowGrains',      level: 1 },
            80: { key: 'rain',    icon: '🌧️', descKey: 'weatherLightShowers',    level: 1 },
            81: { key: 'rain',    icon: '🌧️', descKey: 'weatherRainShowers',     level: 2 },
            82: { key: 'rain',    icon: '⛈️', descKey: 'weatherHeavyShowers',    level: 3 },
            85: { key: 'snow',    icon: '🌨️', descKey: 'weatherSnowShowers',     level: 2 },
            86: { key: 'snow',    icon: '❄️', descKey: 'weatherSnowShowers',     level: 3 },
            95: { key: 'thunder', icon: '⛈️', descKey: 'weatherThunderstorm',     level: 3 },
            96: { key: 'thunder', icon: '⛈️', descKey: 'weatherThunderstormHail', level: 3 },
            99: { key: 'thunder', icon: '⛈️', descKey: 'weatherThunderstormHail', level: 3 }
        };

        return table[code] || { key: 'clear', icon: '☀️', descKey: 'weatherClearSky', level: 0 };
    }

    /* ---------- apply ---------- */

    applyWeather(data) {
        const current = data.current;
        if (!current || typeof current.weather_code !== 'number') return;

        const info = this.describe(current.weather_code);
        const precipitation = Number(current.precipitation) || 0;
        const rainProbability = Number(data.daily?.precipitation_probability_max?.[0]) || 0;
        const humidity = Number(current.relative_humidity_2m) || 0;

        let level = info.level;

        // Overcast but dry with likely rain later / very humid air:
        // a few condensation droplets appear on the glass.
        if (level === 0 && info.key !== 'clear' && (rainProbability >= 55 || humidity >= 92)) {
            level = 1;
        }
        if (level === 0 && precipitation > 0) {
            level = 1;
        }

        this.weather = {
            ...info,
            level,
            temperature: Math.round(Number(current.temperature_2m)),
            humidity,
            wind: Math.round(Number(current.wind_speed_10m)),
            rainProbability
        };

        document.body.dataset.weather = info.key;
        this.renderSubtitle();
        this.renderDroplets();
        this.renderBackdrop();
    }

    renderSubtitle() {
        const subtitle = document.querySelector('.subtitle');
        if (!subtitle || !this.weather) return;

        const w = this.weather;
        subtitle.textContent = [
            `${w.icon} ${w.temperature}°C`,
            t(w.descKey),
            `${w.humidity}% ${t('humidity')}`,
            `${w.wind} km/h ${t('wind')}`
        ].join('  ·  ');
    }

    renderUnavailable() {
        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            subtitle.textContent = t('weatherUnavailable');
        }
    }

    renderDroplets() {
        if (this.layer) this.layer.innerHTML = '';
        // Surface droplets are intentionally disabled: rain/snow live
        // behind the glass only, as requested.
    }

    renderBackdrop() {
        if (!this.backdrop) return;
        this.backdrop.innerHTML = '';
        if (!this.weather) return;

        const { level, key } = this.weather;
        if (level <= 0) {
            this.backdrop.classList.remove('rain', 'snow');
            return;
        }

        const isSnow = key === 'snow';
        const isRain = key === 'rain' || key === 'drizzle' || key === 'thunder';
        this.backdrop.classList.toggle('rain', isRain);
        this.backdrop.classList.toggle('snow', isSnow);
        if (!isSnow && !isRain) return;

        const wind = Math.max(0, Math.min(40, this.weather.wind || 0));
        const tilt = isSnow ? (wind * 0.35) : (wind * 0.65);
        this.backdrop.style.setProperty('--rain-tilt', `${tilt.toFixed(1)}deg`);

        const rand = (min, max) => min + Math.random() * (max - min);
        const width = window.innerWidth || 1920;
        const count = isSnow
            ? Math.min(40, Math.max(16, Math.round(width / 30 * (0.7 + level * 0.25))))
            : Math.min(60, Math.max(20, Math.round(width / 24 * (0.55 + level * 0.3))));

        for (let i = 0; i < count; i++) {
            if (isSnow) {
                const flake = document.createElement('span');
                flake.className = 'backdrop-flake';
                const size = rand(2, 6.5);
                flake.style.left = `${rand(0, 100).toFixed(2)}%`;
                flake.style.setProperty('--size', `${size.toFixed(2)}px`);
                flake.style.setProperty('--drift', `${rand(-55, 55).toFixed(1)}px`);
                flake.style.setProperty('--fall', `${window.innerHeight + 40}px`);
                flake.style.setProperty('--dur', `${rand(3.2, 7.5).toFixed(2)}s`);
                flake.style.setProperty('--delay', `${(-rand(0, 6)).toFixed(2)}s`);
                this.backdrop.appendChild(flake);
            } else {
                const drop = document.createElement('span');
                drop.className = 'backdrop-drop';
                drop.style.left = `${rand(0, 100).toFixed(2)}%`;
                drop.style.setProperty('--h', `${rand(9, 24).toFixed(1)}px`);
                drop.style.width = `${rand(0.8, 1.7).toFixed(2)}px`;
                drop.style.setProperty('--fall', `${window.innerHeight + 90}px`);
                drop.style.setProperty('--dur', `${rand(0.55, 1.15).toFixed(2)}s`);
                drop.style.setProperty('--delay', `${(-rand(0, 1.1)).toFixed(2)}s`);
                this.backdrop.appendChild(drop);
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.weatherApp) {
        window.weatherApp = new WeatherManager();
    }
});
