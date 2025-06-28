import './App.css'
import { Song } from './Components/Song/Song.tsx'
import { SongProvider } from './contexts/SongContext'

export function App() {

  return (
    <SongProvider>
      <Song />
    </SongProvider>
  )
}
