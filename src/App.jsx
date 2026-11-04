import ProfileCard from './components/ProfileCard.jsx'

function App() {
  return (
    <main className="page">
      <ProfileCard
        name="Анастасія"
        group="КН-313"
        technologies={['HTML', 'CSS', 'React']}
      />
    </main>
  )
}

export default App
