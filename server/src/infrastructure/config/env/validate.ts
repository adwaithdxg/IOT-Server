export function validateEnv(config: Record<string, any>): void {
  const required = [
    "PORT",
    "MQTT_BROKER_URL",
    "MQTT_USERNAME",
    "MQTT_PASSWORD"
  ];

  for (const key of required) {
    if (!config[key]) throw new Error(`Missing required environment variable: ${key}`);
  }
}
