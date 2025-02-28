import { cn } from '@/lib/utils';
import { NodeType, PodType } from '@/types/k3s';

export const Pod: React.FC<{ pod: PodType; node: NodeType }> = ({ pod, node }) => {
	const getPodStatusColor = (status: string, nodeStatus: string) => {
		if (nodeStatus === 'false' || nodeStatus === 'Unknown') {
			return 'bg-white/10';
		}

		switch (status) {
			case 'Running':
				return 'bg-emerald-400';
			case 'Starting':
				return 'bg-yellow-400';
			case 'CrashLoopBackOff':
				return 'bg-red-600';
			default:
				return 'bg-white/10';
		}
	};

	return (
		<div className={cn('bg-white/10 rounded-lg aspect-square flex flex-col items-center justify-center p-3', getPodStatusColor(pod.status, node.status))}>
			<span className="text-xs uppercase font-bold truncate w-full text-center" title={pod.name}>
				{pod.name}
			</span>
			<span className={'text-xs text-gray-100'}>{node.status === 'false' || node.status === 'Unknown' ? 'Down' : pod.status}</span>
		</div>
	);
};
