import React, { useEffect, useState } from "react";

export default function ProgressBar({value, animation, color, rounded, text, size}) {

	const [progress, setProgress] = useState(0);
	
	useEffect( () => setProgress(value),
  	[value]
	)
	const height = {
		'xs': 'h-2',
		'sm': 'h-3',
		'md': 'h-4',
		'lg': 'h-6',
		'xl': 'h-8',
		'2xl': 'h-10',
		'3xl': 'h-12'
	}
  return (
    <>
			{text == 'top' ? <div className="m-auto w-full text-center">{progress}%</div> : undefined}
			<div className="flex items-center">
				{text == 'left' ? <span className="mr-2">{progress}%</span> : undefined}
				<div className="relative w-full">
					<div className={`overflow-hidden ${height[size]} text-xs flex ${rounded ? 'rounded-full' : ''} bg-${color}-200`}>
						<div
								style={{ width: `${animation ? progress : value}%` }}
								className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-${color}-500 
								${animation ? 'transition-[width] duration-700 ease-out' : ''}`}
						>{text == 'center' ? <span>{progress}%</span> : undefined}</div>
					</div>
				</div>
				{text == 'right' ? <span className="ml-2">{progress}%</span> : undefined}
			</div>
			{text == 'bottom' ? <div className="m-auto w-full text-center">{progress}%</div> : undefined}
    </>
  );
}
