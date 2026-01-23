import { View,Text } from 'react-native';
import { fetchHealth } from '@/services/api';
import { useState,useEffect } from 'react';
export default function HomeScreen() {
  const [healthData,setHealthData] = useState<any>(null);
  const [isLoading,setIsLoading] = useState(true);
  const [error,setError] = useState<string|null>(null);

  useEffect(() => {
  fetchHealth().then((data) => {
    console.log("Health API response:", data);
    setHealthData(data);
    setIsLoading(false);
  })
  .catch(()=>{
    setError("Failed to reach backend");
    setIsLoading(false);
  });
}, []);

  return (
  <View>
    <Text>Welcome</Text>
    {isLoading && <Text>Loading backend...</Text>}
    {error && <Text>{error}</Text>}
    {healthData && <Text> {JSON.stringify(healthData)}</Text>}
  </View>
);
}
