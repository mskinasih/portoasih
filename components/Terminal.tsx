'use client';

import Typewriter from 'typewriter-effect';

const codeString =
    '<span style="color: #ff7b72; font-weight: bold;">class</span> <span style="color: #d2a8ff; font-weight: bold;">Developer</span><span style="color: #e6edf3;">:</span><br/>' +
    '<br/>' +
    '    <span style="color: #ff7b72; font-weight: bold;">def</span> <span style="color: #d2a8ff; font-weight: bold;">__init__</span><span style="color: #79c0ff;">(</span><span style="color: #79c0ff; font-style: italic;">self</span><span style="color: #79c0ff;">):</span><br/>' +
    '        <span style="color: #79c0ff; font-style: italic;">self</span><span style="color: #e6edf3;">.</span><span style="color: #e6edf3;">name</span> <span style="color: #ff7b72;">=</span> <span style="color: #a5d6ff;">"Mutiara Sekar Kinasih"</span><br/>' +
    '        <span style="color: #79c0ff; font-style: italic;">self</span><span style="color: #e6edf3;">.</span><span style="color: #e6edf3;">role</span> <span style="color: #ff7b72;">=</span> <span style="color: #a5d6ff;">"Junior Full-Stack Developer"</span><br/>' +
    '        <span style="color: #79c0ff; font-style: italic;">self</span><span style="color: #e6edf3;">.</span><span style="color: #e6edf3;">focus</span> <span style="color: #ff7b72;">=</span> <span style="color: #e6edf3;">[</span><span style="color: #e3b341;">"Technology"</span><span style="color: #e6edf3;">, </span><span style="color: #e3b341;">"Education"</span><span style="color: #e6edf3;">, </span><span style="color: #e3b341;">"Data"</span><span style="color: #e6edf3;">]</span><br/>' +
    '<br/>' +
    '    <span style="color: #ff7b72; font-weight: bold;">def</span> <span style="color: #d2a8ff; font-weight: bold;">build</span><span style="color: #79c0ff;">(</span><span style="color: #79c0ff; font-style: italic;">self</span><span style="color: #79c0ff;">):</span><br/>' +
    '        <span style="color: #ff7b72; font-weight: bold;">return</span> <span style="color: #a5d6ff;">"Bridging technology and education through scalable systems"</span>';

export default function Terminal() {
    return (
        <div className="w-fit max-w-full bg-primary rounded-xl p-1 shadow-2xl text-left overflow-hidden hero-terminal-container border border-white/5 font-mono text-xs md:text-sm leading-relaxed transform hover:scale-[1.01] transition-transform duration-500">
            <div className="flex gap-2 px-4 py-3 border-b border-white/5 bg-primary/50">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                <div className="ml-2 text-xs text-white/30 font-sans">developer.py</div>
            </div>
            <div className="p-8 overflow-x-auto min-h-[300px] relative">
                {/* Ghost element to maintain width */}
                <div
                    className="invisible whitespace-pre font-mono"
                    dangerouslySetInnerHTML={{ __html: codeString }}
                    aria-hidden="true"
                />
                {/* Actual typewriter effect overlaid */}
                <div className="absolute top-8 left-8 whitespace-pre font-mono">
                    <Typewriter
                        options={{
                            delay: 50,
                            cursor: '█',
                            loop: false,
                        }}
                        onInit={(typewriter) => {
                            typewriter
                                .typeString(codeString)
                                .start();
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
