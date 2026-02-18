import { mqttClient } from '../infrastructure/config/mqtt';
import { logger } from '../infrastructure/logger';

export class MqttService {

    private readonly dataTopic = 'iot/sensors/#';
    private readonly responseTopic = 'EQ_RESP/#';

    constructor() {
        this.initialize();
    }

    private initialize(): void {
        mqttClient.on('connect', () => {
            logger.info('MQTT connected');
            this.subscribeToTopics();
        });

        mqttClient.on('message', (topic, message) => {
            this.handleMessage(topic, message.toString());
        });

        mqttClient.on('error', (err) => {
            logger.error(err, 'MQTT error');
        });
    }

    private subscribeToTopics(): void {
        const topics = [
            this.dataTopic,
            this.responseTopic
        ];

        mqttClient.subscribe(topics, (err) => {
            if (err) {
                logger.error(err, 'Failed to subscribe to topics');
            } else {
                logger.info(`Subscribed to topics: ${topics.join(', ')}`);
            }
        });
    }

    private handleMessage(topic: string, message: string): void {
        try {
            const parsed = JSON.parse(message);

            if (topic.startsWith('iot/sensors')) {
                this.handleSensorData(parsed);
            } else if (topic.startsWith('EQ_RESP')) {
                this.handleRpcResponse(parsed);
            } else {
                logger.warn(`Unhandled topic: ${topic}`);
            }

        } catch (error) {
            logger.error(error, `Invalid JSON from topic ${topic}`);
        }
    }

    private handleSensorData(data: any): void {
        logger.info(`Sensor Data Received from ${data.uuid}`);

        if (data.uuid) {
            this.publishRpc(data.uuid, {
                message: 'data received successfully',
                status: 'success',
                timestamp: new Date().toISOString()
            });
        }
    }

    private handleRpcResponse(data: any): void {
        logger.info('RPC Response received');
        logger.debug(data);
    }

    public publishRpc(uuid: string, payload: object): void {
        const topic = `EQ_RPC/${uuid}`;

        mqttClient.publish(
            topic,
            JSON.stringify(payload),
            { retain: true },
            (err) => {
                if (err) {
                    logger.error(err, `Failed to publish RPC to ${uuid}`);
                } else {
                    logger.info(`RPC sent to ${uuid}`);
                }
            }
        );
    }
}
