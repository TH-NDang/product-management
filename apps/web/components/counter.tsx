import { decrement, increment } from "@/lib/features/counter/counter-slice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { RootState } from "@/lib/store";
import React from "react";

export function Counter() {
	const count = useAppSelector((state: RootState) => state.counter.value);
	const dispatch = useAppDispatch();

	return (
		<div>
			<div>
				<button
					type="button"
					aria-label="Increment value"
					onClick={() => dispatch(increment())}
				>
					Increment
				</button>
				<span>{count}</span>
				<button
					type="button"
					aria-label="Decrement value"
					onClick={() => dispatch(decrement())}
				>
					Decrement
				</button>
			</div>
		</div>
	);
}
