import mqtt from 'mqtt';
import { logger } from '../logger';
import envConfig from './env';

const MQTT_BROKER_URL = envConfig.MQTT_BROKER_URL;

export const mqttClient = mqtt.connect(MQTT_BROKER_URL, {
    username: envConfig.MQTT_USERNAME,
    password: envConfig.MQTT_PASSWORD,
    reconnectPeriod: 1000,
});

mqttClient.on('connect', () => {
    logger.info('Connected to MQTT Broker');
});

mqttClient.on('error', (err) => {
    logger.error(err, 'MQTT Connection Error:');
});
