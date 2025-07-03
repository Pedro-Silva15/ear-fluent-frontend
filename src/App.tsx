import './App.css'
import { Song } from './Components/Song/Song.tsx'
import { SongForm } from './Components/SongForm/SongForm.tsx'
import { WordHideOptions } from './Components/WordHideOptions/WordHideOptions.tsx'
import { SongProvider, useSong } from './contexts/SongContext'
import { useState, useEffect, useRef } from 'react'

function AppContent() {
  const [showSong, setShowSong] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [songData, setSongData] = useState<{ artistName: string; songName: string } | null>(null)
  const [key, setKey] = useState(0) // Força re-renderização
  const [hideMode, setHideMode] = useState<'choose' | 'random'>('choose')
  const { clearAllHiddenWords } = useSong()
  const songFormRef = useRef<HTMLDivElement>(null)

  // Função para scroll suave para o topo
  const scrollToTop = () => {
    if (songFormRef.current) {
      songFormRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    } else {
      // Fallback para scroll para o topo da página
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  // Efeito para fazer scroll quando a música aparecer
  useEffect(() => {
    if (showSong) {
      // Delay maior para permitir que as transições CSS completem
      setTimeout(() => {
        scrollToTop()
      }, 300)
    }
  }, [showSong])

  const handleSongSubmit = (data: { artistName: string; songName: string }) => {
    console.log('Song data:', data)
    setSongData(data)
    setShowSong(true)
    setHasSearched(true)
  }

  const handleDownload = () => {
    if (songData) {
      console.log('Downloading song:', songData)
      alert(`Downloading: ${songData.songName} - ${songData.artistName}`)
    }
  }

  const handleReset = () => {
    clearAllHiddenWords()
  }

  const handleNewSearch = () => {
    setShowSong(false)
    setSongData(null)
    setHasSearched(false)
    setHideMode('choose')
    setKey(prev => prev + 1)
  }

  const handleModeChange = (mode: 'choose' | 'random') => {
    setHideMode(mode)
  }

  return (
    <>
      <div ref={songFormRef} className="song-form-wrapper">
        <SongForm
          key={key}
          onSubmit={handleSongSubmit}
          onDownload={handleDownload}
          onReset={handleReset}
          onNewSearch={handleNewSearch}
          showDownload={showSong}
          showClearChanges={showSong}
          isSearched={hasSearched}
        />
      </div>
      {showSong && (
        <>
          <WordHideOptions
            key={key}
            onModeChange={handleModeChange}
            currentMode={hideMode}
          />
          <Song />
        </>
      )}
    </>
  )
}

export function App() {
  return (
    <SongProvider>
      <AppContent />
    </SongProvider>
  )
}
