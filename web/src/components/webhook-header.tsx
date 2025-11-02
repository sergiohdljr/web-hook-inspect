export const WebhookHeader = () => {
	return (
		<div className='flex h-full flex-col'>
						<div className='space-y-4 border-b border-zinc-800 p-6'>
							<div className='flex items-center gap-3'>
								<span className='px-3 py-1 rounded-lg border font-mono text-sm font-semibold border-zinc-600 bg-zinc-800 text-zinc-100' >POST</span>
								<span className='text-lg font-medium text-zinc-300' >/video/status</span>
							</div>
							<div className='flex items-center gap-2' >
								<div className='flex items-center gap-2 text-xs text-zinc-400' >
									<span>FROM IP</span>
									<span className='font-mono underline underline-offset-4'>127.0.0.1</span>
								</div>
								<span className='w-px h-4 bg-zinc-700' />
								<div className='flex items-center gap-2 text-sm text-zinc-400' >
									<span>AT</span>
									<span>April 18th, 2025</span>
								</div>
							   
							</div>
						</div>
					</div>
	)
}