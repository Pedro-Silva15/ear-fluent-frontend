import './Song.css'
import songData from '../../songExample.json'
import { WordSong } from '../WordSong/WordSong'
import React from 'react'

export function Song() {
    const songLyrics = songData.lyrics

    const filterWords = (words: string[]) => {
        return words.filter(word => {
            if (!word.trim()) return false;
            if (word.match(/^\(+\)$|^\($|^\)$/)) return false;
            return true;
        });
    };

    const renderWord = (word: string, key: string) => {
        const match = word.match(/^(\(*)(.*?)([?!,.\):]*)$/);
        if (!match) return word;

        const [, openParens, cleanWord, closePunctuation] = match;

        return (
            <span key={key}>
                {openParens}
                <WordSong word={cleanWord} wordKey={key} />
                {closePunctuation}
            </span>
        );
    };

    return (
        <>
            <h1>Song Lyrics</h1>
            <br />
            <div className="song-lyrics">
                {songLyrics.split('\n').map((line, lineIndex) => {
                    if (line.trim() === '') {
                        return (
                            <React.Fragment key={lineIndex}>
                                <br />
                            </React.Fragment>
                        );
                    }

                    return (
                        <div key={lineIndex}>
                            {filterWords(line.split(' ')).map((word, wordIndex) => (
                                <>
                                    {renderWord(word, `${lineIndex}-${wordIndex}`)}
                                    {' '}
                                </>
                            ))}
                        </div>
                    );
                })}
            </div>
        </>
    );
}