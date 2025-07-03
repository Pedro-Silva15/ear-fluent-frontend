import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
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
    clearAllHiddenWords: () => void;
    hideWordsRandomly: (count: number) => void;
}

const SongContext = createContext<SongContextType | undefined>(undefined);

export function SongProvider({ children }: { children: ReactNode }) {
    const [wordsData, setWordsData] = useState<Map<string, WordData>>(new Map());

    const toggleWord = useCallback((wordKey: string, originalWord: string) => {
        setWordsData(prev => {
            const newMap = new Map(prev);
            const existing = newMap.get(wordKey);

            if (existing) {
                newMap.set(wordKey, { ...existing, isHidden: !existing.isHidden });
            } else {
                newMap.set(wordKey, { key: wordKey, word: originalWord, isHidden: true });
            }

            return newMap;
        });
    }, []);

    const getModifiedText = useCallback((): string => {
        return generateCompleteModifiedText(wordsData);
    }, [wordsData]);

    const clearAllHiddenWords = useCallback(() => {
        setWordsData(new Map());
    }, []);

    const hideWordsRandomly = useCallback((count: number) => {
        // Primeiro limpa todas as palavras escondidas
        setWordsData(new Map());

        // Coleta todas as palavras válidas da música
        const allWords: { key: string; word: string }[] = [];
        const lines = songData.lyrics.split('\n');

        lines.forEach((line, lineIndex) => {
            if (line.trim() === '') return;

            const words = line.split(' ');
            words.forEach((word, wordIndex) => {
                if (!word.trim()) return;
                if (word.match(/^\(+\)$|^\($|^\)$/)) return;

                // Extrai a palavra limpa (sem pontuação)
                const match = word.match(/^(\(*)(.*?)([?!,.\):]*)$/);
                if (match) {
                    const [, , cleanWord] = match;
                    if (cleanWord.length > 0) {
                        allWords.push({
                            key: `${lineIndex}-${wordIndex}`,
                            word: cleanWord
                        });
                    }
                }
            });
        });

        // Seleciona palavras aleatórias para esconder
        const wordsToHide = Math.min(count, allWords.length);
        const shuffled = [...allWords].sort(() => Math.random() - 0.5);
        const selectedWords = shuffled.slice(0, wordsToHide);

        // Cria o novo mapa com as palavras selecionadas escondidas
        const newMap = new Map<string, WordData>();
        selectedWords.forEach(({ key, word }) => {
            newMap.set(key, { key, word, isHidden: true });
        });

        setWordsData(newMap);
    }, []);

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
        <SongContext.Provider value={{ wordsData, toggleWord, getModifiedText, clearAllHiddenWords, hideWordsRandomly }}>
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
