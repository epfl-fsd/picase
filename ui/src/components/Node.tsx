import { cn } from '@/lib/utils';
import { NodeType } from '@/types/k3s';
import { Card, CardContent } from './ui/card';
import { Pod } from './Pod';

export const Node: React.FC<{ node: NodeType; size: number }> = ({ node, size }) => {
	const getNodeColor = (status: string) => {
		if (status === 'Down' || status === 'Unknown') return 'bg-red-500';
		return 'bg-green-500';
	};

	return (
		<Card className={cn(getNodeColor(node.status), 'border-0 shadow-xl overflow-y-auto h-[calc(50vh-4rem)]')}>
			<CardContent className="p-6">
				<div className="text-white">
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-bold truncate w-full" title={node.name}>
							{node.name}
						</h2>
					</div>
					<div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
						{node.pods.map((pod, idx) => (
							<Pod key={'Pod' + idx} pod={pod} node={node} />
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
