import { appsApi, coreV1Api } from '@/lib/api';
import { DeploymentType, EventType, NodeType, PodType } from '@/types/k3s';

export async function getPods(): Promise<PodType[]> {
	const pods = await coreV1Api.listNamespacedPod({ namespace: process.env.NAMESPACE || 'default' });
	return pods.items.map((pod) => ({
		name: pod.metadata?.name || '',
		status: pod.status?.phase || '',
		age: new Date(pod.metadata?.creationTimestamp ?? ''),
		node: pod.spec?.nodeName || '',
	}));
}

export async function getNodes(): Promise<NodeType[]> {
	const nodes = await coreV1Api.listNode();
	const pods = await getPods();
	return [
		...nodes.items.map((node) => ({
			id: node.metadata?.uid || '',
			name: node.metadata?.name || '',
			role: node.metadata?.labels?.['kubernetes.io/role'] || '',
			status: node.status?.conditions?.find((condition) => condition.type === 'Ready')?.status || '',
			pods: pods.filter((pod) => pod.node === node.metadata?.name),
		})),
		...nodes.items.map((node) => ({
			id: node.metadata?.uid || '',
			name: node.metadata?.name || '',
			role: node.metadata?.labels?.['kubernetes.io/role'] || '',
			status: 'Unknown',
			pods: pods.filter((pod) => pod.node === node.metadata?.name),
		})),
	];
}

export async function getDeployments(): Promise<DeploymentType[]> {
	const deployments = await appsApi.listNamespacedDeployment({ namespace: process.env.NAMESPACE || 'default' });
	return deployments.items.map((deployment) => ({
		name: deployment.metadata?.name || '',
		replicas: deployment.status?.replicas || 0,
		availableReplicas: deployment.status?.availableReplicas || 0,
		unavailableReplicas: deployment.status?.unavailableReplicas || 0,
		age: new Date(deployment.metadata?.creationTimestamp ?? ''),
	}));
}

export async function getEvents(): Promise<EventType[]> {
	const events = await coreV1Api.listEventForAllNamespaces();
	return events.items
		.sort((a, b) => new Date(b.lastTimestamp || '').getTime() - new Date(a.lastTimestamp || '').getTime())
		.slice(0, 100)
		.map((event) => ({
			eventType: event.type || '',
			resource: event.involvedObject?.kind || '',
			name: event.involvedObject?.name || '',
			status: event.reason || '',
			message: event.message || '',
			date: new Date(event.lastTimestamp || ''),
		}));
}
