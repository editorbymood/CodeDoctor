'use client';

import { useMemo } from 'react';
import { diffLines } from 'diff';
import styles from './DiffViewer.module.css';

interface DiffViewerProps {
    originalCode: string;
    refactoredCode: string;
    language: string;
}

export default function DiffViewer({ originalCode, refactoredCode }: DiffViewerProps) {
    const diffResult = useMemo(() => {
        const changes = diffLines(originalCode, refactoredCode);

        const leftLines: { num: number; content: string; type: 'removed' | 'unchanged' | 'empty' }[] = [];
        const rightLines: { num: number; content: string; type: 'added' | 'unchanged' | 'empty' }[] = [];

        let leftNum = 1;
        let rightNum = 1;

        changes.forEach(change => {
            const lines = change.value.split('\n');
            // Remove last empty element if string ends with newline
            if (lines[lines.length - 1] === '') lines.pop();

            if (change.added) {
                lines.forEach(line => {
                    leftLines.push({ num: 0, content: '', type: 'empty' });
                    rightLines.push({ num: rightNum++, content: line, type: 'added' });
                });
            } else if (change.removed) {
                lines.forEach(line => {
                    leftLines.push({ num: leftNum++, content: line, type: 'removed' });
                    rightLines.push({ num: 0, content: '', type: 'empty' });
                });
            } else {
                lines.forEach(line => {
                    leftLines.push({ num: leftNum++, content: line, type: 'unchanged' });
                    rightLines.push({ num: rightNum++, content: line, type: 'unchanged' });
                });
            }
        });

        return { leftLines, rightLines };
    }, [originalCode, refactoredCode]);

    return (
        <div className={styles.diffContainer}>
            <div className={styles.diffHeaders}>
                <div className={styles.diffHeaderLeft}>
                    <span className={styles.headerIcon}>📄</span> Original
                </div>
                <div className={styles.diffHeaderRight}>
                    <span className={styles.headerIcon}>✨</span> Refactored
                </div>
            </div>
            <div className={styles.diffBody}>
                <div className={styles.diffPane}>
                    {diffResult.leftLines.map((line, i) => (
                        <div
                            key={`l-${i}`}
                            className={`${styles.diffLine} ${styles[line.type]}`}
                        >
                            <span className={styles.lineNum}>
                                {line.num > 0 ? line.num : ''}
                            </span>
                            <span className={styles.lineSign}>
                                {line.type === 'removed' ? '−' : ' '}
                            </span>
                            <code className={styles.lineCode}>{line.content}</code>
                        </div>
                    ))}
                </div>
                <div className={styles.diffDivider}></div>
                <div className={styles.diffPane}>
                    {diffResult.rightLines.map((line, i) => (
                        <div
                            key={`r-${i}`}
                            className={`${styles.diffLine} ${styles[line.type]}`}
                        >
                            <span className={styles.lineNum}>
                                {line.num > 0 ? line.num : ''}
                            </span>
                            <span className={styles.lineSign}>
                                {line.type === 'added' ? '+' : ' '}
                            </span>
                            <code className={styles.lineCode}>{line.content}</code>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
