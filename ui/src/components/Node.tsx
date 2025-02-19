import { cn } from '@/lib/utils';
import { NodeType } from '@/types/k3s';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Pod } from './Pod';

export const Node: React.FC<{ node: NodeType }> = ({ node }) => {
	const getNodeColor = (status: string) => {
		if (status === 'Down') return 'bg-red-500';
		return 'bg-green-500';
	};

	return (
		<Card className={cn(getNodeColor(node.status), 'border-0 shadow-xl overflow-hidden h-full')}>
			<CardContent className="p-6">
				<div className="text-white">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-bold">{node.name}</h2>
						<Badge className="bg-white/20">{node.status}</Badge>
					</div>

					<div className="mt-4 grid grid-cols-2 gap-3">
						{node.pods.map((pod, idx) => (
							<Pod key={'Pod' + idx} pod={pod} />
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
