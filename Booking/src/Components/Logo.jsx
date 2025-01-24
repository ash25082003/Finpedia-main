import React from 'react'

function Logo({ width = '100px' }) {
  return (
    <div>
      <img 
        src="https://wellness.iitr.ac.in/wp-content/uploads/2019/02/cropped-wc-new-01-1-3.png" 
        alt="Wellness Council Logo" 
        style={{ width }} 
      />
    </div>
  )
}

export default Logo
