'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Node } from '@/components/Node';
import { EventType, NodeType, DeploymentType } from '@/types/k3s';
import { Server, AlertCircle, Box } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { EventsViewer } from '@/components/events';

export default function Home() {
	const socketRef = useRef<WebSocket | null>(null);
	const [nodes, setNodes] = useState<NodeType[]>([]);
	const [events, setEvents] = useState<EventType[]>([]);
	const [deployments, setDeployments] = useState<DeploymentType[]>([]);
	const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [size, setSize] = useState(2);

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
		const url = `${protocol}//${window.location.host}/socket`;

		const socket = new WebSocket(url);
		socketRef.current = socket;

		socket.onopen = () => {
			setConnectionStatus('connected');
			setErrorMessage(null);
		};

		socket.onclose = () => {
			setConnectionStatus('disconnected');
		};

		socket.onerror = () => {
			setErrorMessage('Connection error.');
		};

		socket.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);

				if (data.type === 'INIT') {
					setNodes(data.nodes || []);
					setDeployments(data.deployments || []);
					setEvents(data.events || []);
				} else if (data.type === 'UPDATE') {
					if (data.nodes) setNodes(data.nodes);
					if (data.deployments) setDeployments(data.deployments);
					if (data.events) setEvents(data.events);
				} else if (data.type === 'EVENT') {
					if (data.events) setEvents(data.events);
				} else if (data.type === 'ERROR') {
					setErrorMessage(data.message);
				}
			} catch (err) {
				console.error('Error handling WebSocket message:', err);
			}
		};

		return () => {
			socket.close();
			socketRef.current = null;
		};
	}, []);

	const handleReconnect = useCallback(() => {
		if (socketRef.current) {
			socketRef.current.close();
			socketRef.current = null;
		}
		setConnectionStatus('connecting');
	}, []);

	useEffect(() => {
		const maxPods = Math.max(...nodes.map((node) => node.pods.length));
		if (maxPods < 5) setSize(2);
		else if (maxPods < 10) setSize(3);
		else if (maxPods < 17) setSize(4);
		else setSize(5);
	}, [nodes]);

	return (
		<div className="text-white w-full h-full flex gap-4">
			<Card className="w-full p-4 border-4">
				{errorMessage && (
					<div className="flex items-center gap-2 bg-red-900/30 border-red-700 border-2 text-red-500 rounded-md p-4">
						<AlertCircle className="text-red-500" />
						<p className="font-medium">{errorMessage}</p>
					</div>
				)}
				{connectionStatus === 'connecting' && <p className="text-center text-gray-400 py-8">Connecting to cluster...</p>}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{nodes.map((node) => (
						<Node key={node.id} node={node} size={size} />
					))}
				</div>
			</Card>
			<div className="flex flex-col gap-4 w-1/3">
				<Card className="h-24 w-full p-4 border-4 text-4xl font-black flex items-center gap-3">
					<Server className="h-10 w-10 text-primary" />
					PiCase
				</Card>
				{deployments.length !== 0 && (
					<Card className="w-full p-4 border-4 flex flex-col gap-2 justify-between items-center">
						{deployments.map((deployment, index) => (
							<div key={'deployment' + index} className={cn('rounded-md p-3 px-5 flex justify-between items-center w-full', deployment.availableReplicas < deployment.replicas ? 'bg-red-500' : 'bg-green-500')}>
								<div className="flex items-center gap-2">
									<Box className="h-7 w-7" />
									<span className="font-bold">{deployment.name}</span>
								</div>
								<p className="font-bold">
									{deployment.availableReplicas}/{deployment.replicas}
								</p>
							</div>
						))}
					</Card>
				)}
				<Card className="w-full p-4 border-4 overflow-hidden h-full">
					<EventsViewer events={events} />
				</Card>
			</div>
		</div>
	);
}
