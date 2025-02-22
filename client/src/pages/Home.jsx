import React from 'react'
import Header from '../components/Header'
import Steps from '../components/Steps'
import Description from '../components/Description'
import Testimonials from '../components/Testimonials'
import GenButton from '../components/GenButton'

const Home = () => {
  return (
    <div>
     <Header/>
     <Steps/>
     <Description/>
     <Testimonials/>
     <GenButton/>
    </div>
  )
}

export default Home