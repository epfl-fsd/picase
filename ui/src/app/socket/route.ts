import { WebSocket, WebSocketServer } from 'ws';
import { watchApi } from '@/lib/api';
import { getDeployments, getEvents, getNodes } from '@/services/k3s';
import type { IncomingMessage } from 'node:http';

export function GET(): Response {
	return new Response('Upgrade Required', {
		status: 426,
		headers: new Headers({
			Connection: 'Upgrade',
			Upgrade: 'websocket',
		}),
	});
}

export async function SOCKET(client: WebSocket, _request: IncomingMessage, server: WebSocketServer): Promise<() => void> {
	try {
		const nodes = await getNodes();
		const deployments = await getDeployments();
		const events = await getEvents();
		client.send(JSON.stringify({ type: 'INIT', nodes, deployments, events }));
	} catch (err) {
		console.error('Error getting initial data:', err);
		client.send(JSON.stringify({ type: 'ERROR', message: 'Failed to retrieve initial cluster data' }));
	}

	const podWatcher = await createWatcher(`/api/v1/namespaces/${process.env.NAMESPACE}/pods`, 'Pod', server);
	const nodeWatcher = await createWatcher('/api/v1/nodes', 'Node', server);
	const eventWatcher = await createWatcher('/api/v1/events', 'Event', server);

	client.on('message', async (message: Buffer) => {
		try {
			const data = JSON.parse(message.toString());
			if (data.type === 'REQUEST_REFRESH') {
				const nodes = await getNodes();
				const deployments = await getDeployments();
				const events = await getEvents();
				client.send(JSON.stringify({ type: 'UPDATE', nodes, deployments, events }));
			}
		} catch (err) {
			console.error('Error processing client message:', err);
		}
	});

	return () => {
		podWatcher.abort();
		nodeWatcher.abort();
		eventWatcher.abort();
	};
}

function createWatcher(endpoint: string, resourceType: string, server: WebSocketServer) {
	return watchApi.watch(
		endpoint,
		{},
		async (type: string, obj: any) => {
			try {
				if (resourceType === 'Event') {
					const events = await getEvents();
					broadcastEvent(server, { type: 'EVENT', events });
					return;
				} else {
					const nodes = await getNodes();
					const deployments = await getDeployments();
					broadcastEvent(server, { type: 'UPDATE', nodes, deployments });
				}
			} catch (err) {
				console.error(`Error getting data after ${resourceType.toLowerCase()} event:`, err);
			}
		},
		(err: Error) => console.error(`${resourceType} Watch Error:`, err)
	);
}

function broadcastEvent(server: WebSocketServer, message: Record<string, any>) {
	const eventMessage = JSON.stringify(message);
	for (const client of server.clients) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(eventMessage);
		}
	}
}
