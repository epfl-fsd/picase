import { cn } from '@/lib/utils';
import { PodType } from '@/types/k3s';

export const Pod: React.FC<{ pod: PodType }> = ({ pod }) => {
	const getPodStatusColor = (status: string) => {
		switch (status) {
			case 'Running':
				return 'bg-emerald-400';
			case 'Starting':
				return 'bg-yellow-400';
			default:
				return 'bg-white/10';
		}
	};

	return (
		<div className={cn('bg-white/10 rounded-lg aspect-square flex flex-col items-center justify-center', getPodStatusColor(pod.status))}>
			<span className="text-sm uppercase font-bold">{pod.name}</span>
		</div>
	);
};
