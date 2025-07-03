import './Song.css'
import songData from '../../songExample.json'
import { WordSong } from '../WordSong/WordSong'
import React, { memo } from 'react'

export const Song = memo(function Song() {
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
        <div className="song-container">
            <div className="song-header">
                <h1 className="song-title">{songData.songTitle}</h1>
                <h2 className="song-artist">{songData.artistName}</h2>
            </div>
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
                                <React.Fragment key={`${lineIndex}-${wordIndex}`}>
                                    {renderWord(word, `${lineIndex}-${wordIndex}`)}
                                    {' '}
                                </React.Fragment>
                            ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});