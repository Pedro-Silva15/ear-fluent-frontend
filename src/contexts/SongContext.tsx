import { createContext, useContext, useState, type ReactNode } from 'react';
import songData from '../songExample.json';

interface WordData {
    key: string;
    word: string;
    isHidden: boolean;
}

interface SongContextType {
    wordsData: Map<string, WordData>;
    toggleWord: (wordKey: string, originalWord: string) => void;
    getModifiedText: () => string;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

export function SongProvider({ children }: { children: ReactNode }) {
    const [wordsData, setWordsData] = useState<Map<string, WordData>>(new Map());

    const toggleWord = (wordKey: string, originalWord: string) => {
        setWordsData(prev => {
            const newMap = new Map(prev);
            const existing = newMap.get(wordKey);

            if (existing) {
                newMap.set(wordKey, { ...existing, isHidden: !existing.isHidden });
            } else {
                newMap.set(wordKey, { key: wordKey, word: originalWord, isHidden: true });
            }

            const completeModifiedText = generateCompleteModifiedText(newMap);
            console.clear();
            console.log(completeModifiedText);

            return newMap;
        });
    };

    const getModifiedText = (): string => {
        return generateCompleteModifiedText(wordsData);
    };

    const generateCompleteModifiedText = (data: Map<string, WordData>): string => {
        const originalText = songData.lyrics;
        let modifiedText = '';

        const lines = originalText.split('\n');

        lines.forEach((line, lineIndex) => {
            if (line.trim() === '') {
                modifiedText += '\n';
                return;
            }

            const words = line.split(' ');
            const modifiedWords = words.map((word, wordIndex) => {
                const wordKey = `${lineIndex}-${wordIndex}`;
                const wordDataEntry = data.get(wordKey);

                if (wordDataEntry && wordDataEntry.isHidden) {
                    const match = word.match(/^(\(*)(.*?)([?!,.\):]*)$/);
                    if (match) {
                        const [, openParens, cleanWord, closePunctuation] = match;
                        return `${openParens}${'_'.repeat(cleanWord.length)}${closePunctuation}`;
                    }
                    return '_'.repeat(word.length);
                }

                return word;
            });

            modifiedText += modifiedWords.join(' ');
            if (lineIndex < lines.length - 1) {
                modifiedText += '\n';
            }
        });

        return modifiedText;
    };

    return (
        <SongContext.Provider value={{ wordsData, toggleWord, getModifiedText }}>
            {children}
        </SongContext.Provider>
    );
}

export function useSong() {
    const context = useContext(SongContext);
    if (context === undefined) {
        throw new Error('useSong must be used within a SongProvider');
    }
    return context;
}
