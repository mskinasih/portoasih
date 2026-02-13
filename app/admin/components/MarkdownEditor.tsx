'use client';

import { useState, useRef } from 'react';
import {
    Bold,
    Italic,
    Link as LinkIcon,
    Image as ImageIcon,
    List,
    Heading1,
    Heading2,
    Quote,
    Code,
    Eye,
    Edit2
} from 'lucide-react';
import { clsx } from 'clsx';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    rows?: number;
}

export default function MarkdownEditor({ value, onChange, placeholder, className, rows = 12 }: MarkdownEditorProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isPreview, setIsPreview] = useState(false);

    const insertSyntax = (prefix: string, suffix: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const before = value.substring(0, start);
        const after = value.substring(end);

        const newValue = `${before}${prefix}${selectedText}${suffix}${after}`;

        onChange(newValue);

        // Restore focus and selection
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            insertSyntax(`![Image description](${url})`);
        }
        // Reset input so same file can be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleLinkClick = () => {
        const url = prompt('Enter URL:');
        if (url) {
            insertSyntax('[Link text](', `${url})`);
        }
    };

    return (
        <div className={clsx("border border-primary/10 rounded-lg overflow-hidden bg-white/50", className)}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-primary/10 bg-white/40 overflow-x-auto">
                <button title="Bold" onClick={() => insertSyntax('**', '**')} className="p-2 text-primary/60 hover:text-primary hover:bg-primary/5 rounded transition-colors shrink-0">
                    <Bold size={18} />
                </button>
                <button title="Italic" onClick={() => insertSyntax('*', '*')} className="p-2 text-primary/60 hover:text-primary hover:bg-primary/5 rounded transition-colors shrink-0">
                    <Italic size={18} />
                </button>
                <div className="w-px h-6 bg-primary/10 mx-1 shrink-0"></div>
                <button title="Heading 1" onClick={() => insertSyntax('# ')} className="p-2 text-primary/60 hover:text-primary hover:bg-primary/5 rounded transition-colors shrink-0">
                    <Heading1 size={18} />
                </button>
                <button title="Heading 2" onClick={() => insertSyntax('## ')} className="p-2 text-primary/60 hover:text-primary hover:bg-primary/5 rounded transition-colors shrink-0">
                    <Heading2 size={18} />
                </button>
                <div className="w-px h-6 bg-primary/10 mx-1 shrink-0"></div>
                <button title="List" onClick={() => insertSyntax('- ')} className="p-2 text-primary/60 hover:text-primary hover:bg-primary/5 rounded transition-colors shrink-0">
                    <List size={18} />
                </button>
                <button title="Quote" onClick={() => insertSyntax('> ')} className="p-2 text-primary/60 hover:text-primary hover:bg-primary/5 rounded transition-colors shrink-0">
                    <Quote size={18} />
                </button>
                <button title="Code Block" onClick={() => insertSyntax('```\n', '\n```')} className="p-2 text-primary/60 hover:text-primary hover:bg-primary/5 rounded transition-colors shrink-0">
                    <Code size={18} />
                </button>
                <div className="w-px h-6 bg-primary/10 mx-1 shrink-0"></div>
                <button title="Link" onClick={handleLinkClick} className="p-2 text-primary/60 hover:text-primary hover:bg-primary/5 rounded transition-colors shrink-0">
                    <LinkIcon size={18} />
                </button>
                <button title="Image" onClick={handleImageClick} className="p-2 text-primary/60 hover:text-primary hover:bg-primary/5 rounded transition-colors shrink-0">
                    <ImageIcon size={18} />
                </button>

                <div className="flex-1"></div>

                <button
                    onClick={() => setIsPreview(!isPreview)}
                    className={clsx(
                        "p-2 rounded transition-colors flex items-center gap-1.5",
                        isPreview ? "bg-primary text-white" : "text-primary/60 hover:text-primary hover:bg-primary/5"
                    )}
                    title={isPreview ? "Edit Mode" : "Preview Mode"}
                >
                    {isPreview ? <Edit2 size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {/* Editor / Preview Area */}
            <div className="relative">
                {isPreview ? (
                    <div
                        className="w-full px-4 py-3 min-h-[300px] prose prose-invert max-w-none overflow-y-auto custom-scrollbar bg-white/30"
                        style={{ height: rows * 24 + 'px' }}
                    >
                        {/* Simple Preview Render - For now just displaying raw text with line breaks, 
                            ideally we'd use react-markdown here but we want to avoid deps for now */}
                        <div className="whitespace-pre-wrap font-serif text-primary">
                            {value || <span className="text-primary/30 italic">Nothing to preview</span>}
                        </div>
                        <p className="text-xs text-primary/40 mt-4 border-t border-primary/10 pt-2 text-center">
                            (Markdown preview is simplified. Actual post will render with full formatting.)
                        </p>
                    </div>
                ) : (
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full bg-transparent px-4 py-3 focus:outline-none transition-all placeholder:text-primary/30 resize-none font-mono text-sm leading-relaxed"
                        placeholder={placeholder}
                        rows={rows}
                    ></textarea>
                )}
            </div>
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
                accept="image/*"
            />
        </div>
    );
}
