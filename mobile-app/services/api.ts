const BASE_URL = "https://car-lease-loan-ai-assistant.onrender.com";

export async function fetchHealth() {
  const response = await fetch(`${BASE_URL}/health`);
  return response.json();
}
