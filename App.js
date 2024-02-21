import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, KeyboardAvoidingView } from "react-native";

export default App = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [showTitle, setShowTitle] = useState(true);

  const API_KEY = '8f83306b34ee432289f231638241902';

  const getWeather = async () => {
    try {
      const res = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&days=1&aqi=no&alerts=no`);
      const data = await res.json();
      setWeatherData(data);
    } catch (error) {
      setError('Error al encontrar los datos de la ciudad');
    }
  };

  useEffect(() => {
    city ? getWeather : setWeatherData(null);
  }, [city]);

  // Definir la imagen de fondo basada en la condición del clima
  const getBackgroundImage = () => {
    if (!weatherData || !weatherData.current || !weatherData.current.condition || !weatherData.current.condition.text) {
      return require('./background/default.png');
    }
  
    const { current } = weatherData;
    const { text } = current.condition;
  
    if (text.includes('rain') || text.includes('drizzle') || text.includes('Drizzle')) return require('./background/Rainy.png');
    if (text.includes('cloudy') || text.includes('Cloudy')) return require('./background/Cloudy.png');
    if (text.includes('thunderstorm')) return require('./background/Thunder.png');
    if (text.includes('clear') || text.includes('Clear') || text.includes('sunny') || text.includes('Sunny'))  return require('./background/Clear.png');
    if (text.includes('snow') || text.includes('Snow')) return require('./background/Snow.png');
  
    return require('./background/default.png');
  };

  const handlePress = () => {
    setShowTitle(false);
    getWeather();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ImageBackground source={getBackgroundImage()} style={styles.container}>
        <View style={styles.overlay}>
          {showTitle && <Text style={styles.title}>Welcome to Weather App! </Text>}
          {weatherData && (
            <View style={styles.weatherContainer}>
              <Text style={styles.title2}>{weatherData.location.name},{weatherData.location.country}</Text>
              <Text style={styles.temperature}>{weatherData.current.temp_c}°C</Text>
              <Text style={styles.condition}>{weatherData.current.condition.text}</Text>
            </View>
          )}
          <TextInput
            style={styles.input}
            placeholder="Enter city name"
            value={city}
            onChangeText={(text) => setCity(text)}
          />
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Text style={styles.buttonText}>Get Weather </Text>
          </TouchableOpacity>
          {error && <Text>{error}</Text>}
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: 'black',
  },
  input: {
    height: 40,
    width: "80%",
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    color: 'white',
    backgroundColor: 'cornflowerblue',
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    marginBottom: 30,
    color: 'gray',
  },
  buttonText: {
    color: "white",
  },
  temperature: {
    color: "white",
    fontSize: 100,
    marginBottom: 20,
    alignSelf: "center",
    textAlign: "center",
  },
  weatherContainer: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  condition: {
    marginBottom: 50,
    color: "white",
  },
  title2: {
    color: "white",
    fontSize: 24,
    marginBottom: 20,
  },
});