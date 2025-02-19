import { Server } from 'lucide-react';

export const Header: React.FC = () => {
	return (
		<div className="max-w-7xl mx-auto flex items-center justify-between mb-12">
			<h1 className="text-4xl font-black text-white flex items-center gap-3">
				<Server className="h-10 w-10 text-purple-400" />
				PiCase
			</h1>
		</div>
	);
};
