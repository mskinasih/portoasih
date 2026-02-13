import { clsx } from 'clsx';

const achievements = [
    {
        title: "Google Data Analytics",
        institution: "Coursera",
        description: "Professional Certificate focused on R, SQL, and Tableau.",
        date: "DEC 2022",
        image: "[Image]"
    },
    {
        title: "Full-Stack Web Dev",
        institution: "Udacity NanoDegree",
        description: "Advanced specialization in React and Cloud Architecture.",
        date: "JUN 2023",
        image: "[Image]"
    },
    {
        title: "Dean's List Award",
        institution: "University Honors",
        description: "Recognized for academic excellence in Computer Science.",
        date: "2018 — 2021",
        image: "[Image]"
    }
];

export default function Awards() {
    // Logic: If data length > 3, use slider. Otherwise, use grid.
    const isSlider = achievements.length > 3;

    return (
        <section className="mb-32" id="awards">
            <h2 className="font-serif text-3xl font-bold mb-12 flex items-center gap-4">
                <span className="h-px w-12 bg-primary/20"></span>
                Key Achievements
            </h2>

            <div className={clsx(
                "gap-6",
                isSlider
                    ? "flex overflow-x-auto snap-x snap-mandatory pb-6 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide"
                    : "grid grid-cols-1 md:grid-cols-3"
            )}>
                {achievements.map((item, index) => (
                    <div
                        key={index}
                        className={clsx(
                            "group border border-primary/5 rounded-xl bg-white/30 hover:shadow-lg transition-all overflow-hidden flex flex-col",
                            isSlider && "flex-none w-[85vw] md:w-[350px] snap-center"
                        )}
                    >
                        <div className="aspect-video w-full bg-accent-dark/5 overflow-hidden flex items-center justify-center text-accent-dark/20 bg-gray-100">
                            {/* Placeholder for Image */}
                            <span className="text-xs font-mono">{item.image}</span>
                        </div>
                        <div className="p-6">
                            <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                            <p className="text-[10px] uppercase tracking-wider text-accent-dark font-bold mb-3">{item.institution}</p>
                            <p className="text-xs opacity-60">{item.description}</p>
                            <p className="text-[10px] mt-4 opacity-40 font-mono">{item.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
