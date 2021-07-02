import React, {useState, useEffect} from 'react'

export default function FilterConfig({countries, userCountries, handleChange}) {

  useEffect((e) => {

  }, userCountries)
  return (
    <div>
      <form>
    {Array.from(countries).map(_ => 
      <>
      <label>{_}
      <input
        type="checkbox"
        key={_ ? _ : 'Unknown'}
        name={_ ? _ : 'Unknown'}
        onChange={handleChange}
        checked={userCountries.has(_)}
      />
      </label>
      </>
    )}
      </form>
    </div>
  )
}