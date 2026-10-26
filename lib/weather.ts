export type Sky = "clear" | "cloudy" | "fog" | "rain" | "storm";

export type Weather = {
  /** Rounded °C. */
  temp: number;
  sky: Sky;
  day: boolean;
  /** Plain words for screen readers and the hover title, e.g. "Light rain". */
  words: string;
};

/** WMO weather codes, folded into a few skies and plain words. */
function describe(code: number): { sky: Sky; words: string } {
  if (code === 0) return { sky: "clear", words: "Clear" };
  if (code <= 2) return { sky: "cloudy", words: "Partly cloudy" };
  if (code === 3) return { sky: "cloudy", words: "Overcast" };
  if (code <= 48) return { sky: "fog", words: "Fog" };
  if (code <= 55) return { sky: "rain", words: "Drizzle" };
  if (code <= 65 || (code >= 80 && code <= 82)) return { sky: "rain", words: code === 61 || code === 80 ? "Light rain" : "Rain" };
  if (code >= 95) return { sky: "storm", words: "Thunderstorm" };
  return { sky: "cloudy", words: "Cloudy" };
}

/** Current weather in Chennai from Open-Meteo (no key). Null if it doesn't answer. */
export async function getWeather(): Promise<Weather | null> {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=13.08&longitude=80.27&current=temperature_2m,weather_code,is_day",
      { next: { revalidate: 900 } },
    );
    if (!res.ok) return null;
    const { current } = (await res.json()) as { current?: { temperature_2m: number; weather_code: number; is_day: number } };
    if (!current) return null;
    return { temp: Math.round(current.temperature_2m), day: current.is_day === 1, ...describe(current.weather_code) };
  } catch {
    return null;
  }
}
