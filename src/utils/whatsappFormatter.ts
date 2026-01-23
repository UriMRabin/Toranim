export const formatScheduleForWhatsApp = (schedule: any[]) => {
    if (!schedule || schedule.length === 0) return '';

    const daysHebrew = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    const today = new Date();
    const formattedDate = `${today.getDate()}/${today.getMonth() + 1}`;

    let text = `*לו"ז תורנויות - מכינת רבין (${formattedDate})* 📅\n\n`;

    schedule.forEach(day => {
        text += `*יום ${daysHebrew[day.dayOfWeek]} (${day.date.split('-').reverse().slice(0, 2).join('/')}):*\n`;

        // Sinai
        const sinai = day.assignments.Sinai;
        text += `🔵 סיני: ${sinai.main.name}`;
        if (sinai.replacements.lunch) text += ` (🍽️ ${sinai.replacements.lunch.name})`;
        if (sinai.replacements.dinner) text += ` (🌙 ${sinai.replacements.dinner.name})`;
        text += '\n';

        // Ziv
        const ziv = day.assignments.Ziv;
        text += `🟢 זיו: ${ziv.main.name}`;
        if (ziv.replacements.lunch) text += ` (🍽️ ${ziv.replacements.lunch.name})`;
        if (ziv.replacements.dinner) text += ` (🌙 ${ziv.replacements.dinner.name})`;
        text += '\n';

        // Nvia
        const nvia = day.assignments.Nvia;
        text += `🟠 נביעה: ${nvia.main.name}`;
        if (nvia.replacements.lunch) text += ` (🍽️ ${nvia.replacements.lunch.name})`;
        if (nvia.replacements.dinner) text += ` (🌙 ${nvia.replacements.dinner.name})`;
        text += '\n\n';
    });

    text += 'באהבה, צוות אח"י ❤️';
    return text;
};
