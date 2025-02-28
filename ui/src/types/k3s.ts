export interface NodeType {
	id: string;
	name: string;
	role: string;
	status: string;
	pods: PodType[];
}

export interface PodType {
	name: string;
	status: string;
	age: Date;
	node: string;
}

export interface EventType {
	eventType: string;
	resource: string;
	name: string;
	status: string;
	message: string;
	date: Date;
}

export interface DeploymentType {
	name: string;
	replicas: number;
	availableReplicas: number;
	unavailableReplicas: number;
	age: Date;
}
