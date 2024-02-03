import React from 'react';
import ThreeScene from './ThreeScene';

function App() {

  let images = [];
  for (let i = 1; i <= 189; i++) {
    images.push(`${process.env.PUBLIC_URL}/images/image${i}.png`);
  }
  


  return (
    <div className="App">
       <ThreeScene images={images} />
    </div>
  );
}

export default App;
