import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';

interface CheckboxProps extends RadixCheckbox.CheckboxProps {}
		

export const Checkbox = (props: CheckboxProps) => {
	return (
		<RadixCheckbox.Root className="size-4 shrink-0 items-center rounded border border-zinc-600
         bg-zinc-800 transition-colors hover:border-zinc-500 focus-visible:outline-none focus-visible:ring-2}
          focus-visible:ring-zinc-600 data-[state=checked]:border-indigo-600 data-[state=checked]:bg-indigo-600 
          " {...props}>
			<RadixCheckbox.Indicator className="flex items-center justify-center text-zinc-900">
				<CheckIcon className="size-3" />
			</RadixCheckbox.Indicator>
		</RadixCheckbox.Root>
	);
};
