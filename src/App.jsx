import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Features from './components/Features.jsx'
import Pricing from './components/Pricing.jsx'
import CtaBand from './components/CtaBand.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <CtaBand />
      </main>
      <Footer />
    </>
  )
}
