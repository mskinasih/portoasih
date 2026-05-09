'use client';

export default function Experience() {
    return (
        <section className="mb-32" id="achievements">
            <h2 className="font-serif text-3xl font-bold mb-12 flex items-center gap-4">
                <span className="h-px w-12 bg-primary/20"></span>
                Jejak Langkah
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Experience Column */}
                <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-accent-dark mb-8 pl-8">Pengalaman</h3>
                    <div className="space-y-12 border-l border-primary/10 pl-8 relative">
                        <div className="relative">
                            <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background-light"></div>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-accent-dark/60 mb-1 block">2025 – 2026</span>
                            <h4 className="text-md font-bold">Magang Full-Stack Developer</h4>
                            <span className="text-xs font-semibold text-accent-dark/80 block mb-1">PT Aksa Digital Group</span>
                            <p className="text-sm opacity-70">Mengembangkan dan memelihara aplikasi web, membangun RESTful API, dan mengelola database relasional.</p>
                        </div>
                        <div className="relative">
                            <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background-light"></div>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-accent-dark/60 mb-1 block">2025 – Sekarang</span>
                            <h4 className="text-md font-bold">Tutor Matematika & Fisika Tingkat SMP</h4>
                            <p className="text-sm opacity-70">Memberikan bimbingan pemecahan masalah yang terstruktur dan memperkuat kemampuan berpikir analitis siswa.</p>
                        </div>
                    </div>
                </div>

                {/* Education Column */}
                <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-accent-dark mb-8 pl-8">Pendidikan</h3>
                    <div className="space-y-12 border-l border-primary/10 pl-8 relative">
                        <div className="relative">
                            <div className="absolute -left-[37px] top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background-light"></div>
                            <span className="text-[10px] uppercase tracking-widest font-bold text-accent-dark/60 mb-1 block">2022 – 2026</span>
                            <h4 className="text-md font-bold">SMK Negeri 2 Depok Sleman</h4>
                            <p className="text-sm opacity-70 mt-1">Jurusan Sistem Informasi, Jaringan & Aplikasi (SIJA)</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
