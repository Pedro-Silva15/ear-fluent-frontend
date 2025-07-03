import React, { useState } from 'react'
import { Search, Download, Eraser } from 'lucide-react'
import './SongForm.css'

interface SongFormData {
    artistName: string
    songName: string
}

interface SongFormProps {
    onSubmit?: (data: SongFormData) => void
    onDownload?: (data: SongFormData) => void
    onReset?: () => void
    onNewSearch?: () => void
    showDownload?: boolean
    showClearChanges?: boolean
    isSearched?: boolean
}

export function SongForm({ onSubmit, onDownload, onReset, onNewSearch, showDownload = false, showClearChanges = false, isSearched = false }: SongFormProps) {
    const [formData, setFormData] = useState<SongFormData>({
        artistName: '',
        songName: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (onSubmit) {
            onSubmit(formData)
        }
    }

    const handleReset = () => {
        setFormData({
            artistName: '',
            songName: ''
        })
        if (onReset) {
            onReset()
        }
    }

    const handleDownload = () => {
        if (onDownload) {
            onDownload(formData)
        }
    }

    const handleNewSearch = () => {
        if (onNewSearch) {
            onNewSearch()
        }
        setFormData({
            artistName: '',
            songName: ''
        })
    }

    return (
        <div className={`song-form-container ${isSearched ? 'edit-mode' : ''}`}>
            <h2>{isSearched ? 'Edit Music' : 'Search Music'}</h2>
            <form onSubmit={handleSubmit} className="song-form">

                {!isSearched && (
                    <>
                        <div className="form-group">
                            <label htmlFor="songName">Song Name:</label>
                            <input
                                type="text"
                                id="songName"
                                name="songName"
                                value={formData.songName}
                                onChange={handleInputChange}
                                placeholder="21 Questions"
                                autoComplete="off"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="artistName">Artist Name:</label>
                            <input
                                type="text"
                                id="artistName"
                                name="artistName"
                                value={formData.artistName}
                                onChange={handleInputChange}
                                placeholder="50 Cent"
                                autoComplete="off"
                            />
                        </div>
                    </>
                )}

                <div className="form-actions">
                    {isSearched ? (
                        <button type="button" onClick={handleNewSearch} className="submit-btn">
                            <Search size={16} />
                            New Search
                        </button>
                    ) : (
                        <button type="submit" className="submit-btn">
                            <Search size={16} />
                            Search
                        </button>
                    )}
                    {showDownload && (
                        <button type="button" onClick={handleDownload} className="download-btn">
                            <Download size={16} />
                            Download
                        </button>
                    )}
                    {showClearChanges && (
                        <button type="button" onClick={handleReset} className="reset-btn">
                            <Eraser size={16} />
                            Clear changes
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}
