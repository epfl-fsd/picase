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
}
