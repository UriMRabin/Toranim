// Student data - same as in frontend but server-side
export const STUDENTS_DATA = [
    // --- Sinai ---
    // 13:30-19:00
    ...['סהר כהן', 'נעה קנר', 'גל פרחי', 'גיא ליבל'].map(name => createStudent(name, 'Sinai', '13:30', '19:00')),
    // 15:00-18:00
    ...['יאיר מיכלין', 'רועי שילה', 'ליה שלומי איינשטיין', 'רוני רגב', 'זוהר סיקרי'].map(name => createStudent(name, 'Sinai', '15:00', '18:00')),
    // 13:00-17:00
    ...['מיכל רייש', 'ירדן הדס', 'עדי ברקאי', 'שחף שנהר', 'נטע כדורי'].map(name => createStudent(name, 'Sinai', '13:00', '17:00')),
    // 16:00-19:00
    ...['לירי אבל', 'גל ציפרוט', 'אלמגור בן ציון', 'עמרי דגן שגב', 'טליה גורדון'].map(name => createStudent(name, 'Sinai', '16:00', '19:00')),

    // --- Ziv ---
    // 13:30-17:00
    ...['יוני בן עזר', 'מתן דותן', 'שי לרנר', 'נועה ליפשיץ', 'זוהר ארזי'].map(name => createStudent(name, 'Ziv', '13:30', '17:00')),
    // 15:00-19:30
    ...['שירה רוזנפלד', 'טליה פרנקו', 'נדב שמואל הדגס', 'דניאל מרזל', 'תומר שגיא'].map(name => createStudent(name, 'Ziv', '15:00', '19:30')),
    // 16:00-19:00
    ...['אריאל אוזן', 'יובל אטר', 'רוני רז', 'נועם יעקב'].map(name => createStudent(name, 'Ziv', '16:00', '19:00')),
    // 13:30-18:00
    ...['ליהיא קולר', 'רותם לוי', 'זואי רבינוביץ', 'רוני חלפון'].map(name => createStudent(name, 'Ziv', '13:30', '18:00')),

    // --- Nvia ---
    // 16:00-19:00
    ...['אורי רוזן', 'שהם גרסל', 'יעל אשבל', 'רוני גור'].map(name => createStudent(name, 'Nvia', '16:00', '19:00')),
    // 16:00-19:00 (Second group same time)
    ...['סול רייזר', 'חוף ארבל שחם', 'תמרה שטייניץ', 'מיכאלה פרידמן'].map(name => createStudent(name, 'Nvia', '16:00', '19:00')),
    // 14:30-17:30
    ...['טליה ואקנין', 'ליה שדה', 'יהודה פולק', 'נדב בר-דב', 'דורי גולד'].map(name => createStudent(name, 'Nvia', '14:30', '17:30')),
    // 13:30-18:00
    ...['יונתן פאר', 'עמרי כרמלי', 'מיקה צדיק'].map(name => createStudent(name, 'Nvia', '13:30', '18:00')),
];

function createStudent(name, group, start, end) {
    return {
        id: name.trim(),
        name: name.trim(),
        group,
        volunteeringHours: { start, end }
    };
}

export function getStudentsByGroup(group) {
    return STUDENTS_DATA.filter(s => s.group === group);
}
