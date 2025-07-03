import { useState } from 'react'
import { Shuffle, Pointer } from 'lucide-react'
import { useSong } from '../../contexts/SongContext'
import './WordHideOptions.css'

interface WordHideOptionsProps {
    onModeChange: (mode: 'choose' | 'random') => void
    currentMode: 'choose' | 'random'
}

export function WordHideOptions({ onModeChange, currentMode }: WordHideOptionsProps) {
    const [randomCount, setRandomCount] = useState<string>('1')
    const { hideWordsRandomly, clearAllHiddenWords } = useSong()

    const handleRandomHide = () => {
        const count = parseInt(randomCount);
        if (count > 0) {
            hideWordsRandomly(count)
            onModeChange('random')
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRandomCount(e.target.value);
    };

    const handleInputBlur = () => {
        const count = parseInt(randomCount);
        if (isNaN(count) || count < 1) {
            setRandomCount('1');
        } else if (count > 100) {
            setRandomCount('100');
        }
    };

    const handleChooseMode = () => {
        clearAllHiddenWords()
        onModeChange('choose')
    }

    const handleRandomModeClick = () => {
        if (currentMode !== 'random') {
            onModeChange('random')
        }
    }

    const handleChooseModeClick = () => {
        if (currentMode !== 'choose') {
            handleChooseMode()
        }
    }

    return (
        <div className="word-hide-options">
            <h3>Choose how to hide words:</h3>

            <div className="hide-options">
                <div
                    className={`option ${currentMode === 'random' ? 'active' : currentMode === 'choose' ? 'inactive' : ''}`}
                    onClick={handleRandomModeClick}
                >
                    <div className="option-header">
                        <Shuffle size={20} />
                        <span className="option-title">Hide words randomly</span>
                    </div>
                    <div className="option-content">
                        <div className="random-input-group">
                            <label htmlFor="randomCount">Number of words:</label>
                            <input
                                type="number"
                                id="randomCount"
                                min="1"
                                max="100"
                                value={randomCount}
                                onChange={handleInputChange}
                                onBlur={handleInputBlur}
                                className="random-count-input"
                                disabled={currentMode === 'choose'}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={(e) => {
                                if (currentMode !== 'choose') {
                                    e.stopPropagation();
                                    handleRandomHide();
                                }
                            }}
                            className="apply-random-btn"
                            disabled={currentMode === 'choose'}
                        >
                            <Shuffle size={16} />
                            Apply Random Hide
                        </button>
                    </div>
                </div>

                <div
                    className={`option ${currentMode === 'choose' ? 'active' : currentMode === 'random' ? 'inactive' : ''}`}
                    onClick={handleChooseModeClick}
                >
                    <div className="option-header">
                        <Pointer size={20} />
                        <span className="option-title">I want to choose</span>
                    </div>
                    <div className="option-content">
                        <p className="option-description">
                            Click on any word in the lyrics to hide it manually.
                        </p>
                        <button
                            type="button"
                            onClick={(e) => {
                                if (currentMode !== 'random') {
                                    e.stopPropagation();
                                    handleChooseMode();
                                }
                            }}
                            className="apply-choose-btn"
                            disabled={currentMode === 'random'}
                        >
                            <Pointer size={16} />
                            Enable Manual Selection
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
