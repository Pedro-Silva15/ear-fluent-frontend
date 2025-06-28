import './App.css'
import { Song } from './Components/Song/Song.tsx'
import { SongForm } from './Components/SongForm/SongForm.tsx'
import { SongProvider } from './contexts/SongContext'
import { useState } from 'react'

export function App() {
  const [showSong, setShowSong] = useState(false)
  const [songData, setSongData] = useState<{ artistName: string; songName: string } | null>(null)

  const handleSongSubmit = (data: { artistName: string; songName: string }) => {
    console.log('Song data:', data)
    setSongData(data)
    setShowSong(true)
  }

  const handleDownload = () => {
    if (songData) {
      console.log('Downloading song:', songData)
      alert(`Downloading: ${songData.songName} - ${songData.artistName}`)
    }
  }

  const handleReset = () => {
    setShowSong(false)
    setSongData(null)
  }

  return (
    <SongProvider>
      <SongForm
        onSubmit={handleSongSubmit}
        onDownload={handleDownload}
        onReset={handleReset}
        showDownload={showSong}
      />
      {showSong && <Song />}
    </SongProvider>
  )
}
