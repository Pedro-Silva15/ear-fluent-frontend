import './WordSong.css'
import { useSong } from '../../contexts/SongContext'
import { memo } from 'react'

interface WordSongProps {
    word: string;
    wordKey: string;
}

export const WordSong = memo(function WordSong({ word, wordKey }: WordSongProps) {
    const { toggleWord, wordsData } = useSong();

    // Verificar diretamente do contexto se a palavra está oculta
    const wordData = wordsData.get(wordKey);
    const isHidden = wordData?.isHidden || false;

    const handleClick = () => {
        toggleWord(wordKey, word);
    };

    const getDisplayWord = () => {
        if (isHidden) {
            return '_'.repeat(word.length);
        }
        return word;
    };

    return (
        <span
            className="word-song"
            onClick={handleClick}
        >
            {getDisplayWord()}
        </span>
    );
});