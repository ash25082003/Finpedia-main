import React from 'react'

function Logo({ width = '100px' }) {
  return (
    <div>
      <img 
        src="https://lh3.googleusercontent.com/a/ACg8ocIMzqSpIMzVkERQQWpFT4eJ4lwyapyXQuji_vsz9DmLScg5nzVj=s360-c-no" 
        alt="Finpedia" 
        style={{ width }} 
      />
    </div>
  )
}

export default Logo
