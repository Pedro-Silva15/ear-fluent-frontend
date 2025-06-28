import './WordSong.css'
import { useState } from 'react'
import { useSong } from '../../contexts/SongContext'

interface WordSongProps {
    word: string;
    wordKey: string;
}

export function WordSong({ word, wordKey }: WordSongProps) {
    const [isHidden, setIsHidden] = useState(false);
    const { toggleWord } = useSong();

    const handleClick = () => {
        setIsHidden(!isHidden);
        toggleWord(wordKey, word);
    };

    const getDisplayWord = () => {
        if (isHidden) {
            return '_'.repeat(Math.ceil(word.length * 1.5));
        }
        return word;
    };

    return (
        <span
            className="word-song"
            onClick={handleClick}
            style={{ cursor: 'pointer' }}
        >
            {getDisplayWord()}
        </span>
    );
}