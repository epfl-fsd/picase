'use client';

import { useRef } from 'react';
import { Server, Package, Layers, Cloud, Globe, FileText, Lock, Briefcase, Puzzle, Copy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EventType } from '@/types/k3s';

export const EventsViewer: React.FC<{ events: EventType[] }> = ({ events }) => {
	const scrollAreaRef = useRef<HTMLDivElement>(null);

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'error':
			case 'failed':
				return 'bg-red-500 hover:bg-red-500';
			case 'warning':
				return 'bg-yellow-500 hover:bg-yellow-500';
			case 'normal':
			case 'success':
				return 'bg-blue-500 hover:bg-blue-500';
			case 'pending':
				return 'bg-blue-500 hover:bg-blue-500';
			default:
				return 'bg-gray-500 hover:bg-gray-500';
		}
	};

	return (
		<ScrollArea className="h-full" ref={scrollAreaRef}>
			{events.length === 0 ? (
				<div className="h-full flex items-center justify-center">
					<p className="text-gray-400">Loading events...</p>
				</div>
			) : events.length === 0 ? (
				<div className="h-full flex items-center justify-center">
					<p className="text-gray-400">No events found</p>
				</div>
			) : (
				<div className="flex flex-col gap-2 h-full">
					{events.map((event, index) => (
						<div key={'event' + index} className="rounded-md p-3 border border-gray-700 transition-all cursor-pointer">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2">
									<div className={cn('w-2 h-2 rounded-full', getStatusColor(event.eventType))}></div>
									<Badge variant="outline" className="text-sm px-2 py-1 flex gap-1.5">
										{event.resource === 'Node' && <Server className="h-4 w-4" />}
										{event.resource === 'Pod' && <Package className="h-4 w-4" />}
										{event.resource === 'Deployment' && <Layers className="h-4 w-4" />}
										{event.resource === 'ReplicaSet' && <Copy className="h-4 w-4" />}
										{event.resource === 'Service' && <Cloud className="h-4 w-4" />}
										{event.resource === 'Ingress' && <Globe className="h-4 w-4" />}
										{event.resource === 'ConfigMap' && <FileText className="h-4 w-4" />}
										{event.resource === 'Secret' && <Lock className="h-4 w-4" />}
										{event.resource === 'Job' && <Briefcase className="h-4 w-4" />}
										{event.resource === 'Addon' && <Puzzle className="h-4 w-4" />}
										<p className="font-bold truncate max-w-[12svw]">{event.name}</p>
									</Badge>
								</div>
								<Badge className={cn(getStatusColor(event.eventType), 'text-white uppercase text-xs px-2')}>{event.status}</Badge>
							</div>

							{event.message && <div className="mt-2 font-mono text-sm">{event.message}</div>}
							{event.date && <div className="mt-1 text-xs text-gray-400">{event.date.toLocaleString()}</div>}
						</div>
					))}
				</div>
			)}
		</ScrollArea>
	);
};
