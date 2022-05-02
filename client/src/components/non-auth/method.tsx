import React from 'react';
const Method:React.FC<{steps:string[]}> = ({ steps }) => {
  return (
    <div className='ingredients-container'>
      <h2 className='title'>Method</h2>

      {steps.map((step, i) => (
        <div key={i} className='ingredient'>
          <p className='ingredient-title'>{step}</p>
        </div>
      ))}
    </div>
  );
};

export default Method;
