import React, { useState } from "react";

export default function CheckBox({ value, color, children, onClick, className }) {
  const [state, setState] = useState(value || false)

  return (
    <div className={className}>
      <div className="flex items-center" onClick={(e) => {
          setState((state) => {
            if(onClick) onClick(!state)
            return !state
          })
        }}>
        <div className={`h-3 w-3 rounded-full border-2 mr-2`} style={{
          backgroundColor: state ? color : 'white',
          borderColor: color
        }}>
        </div>
        {children}
      </div>
    </div>
  );
}
