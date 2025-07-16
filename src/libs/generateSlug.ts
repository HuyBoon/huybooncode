import slugify from 'slugify';

export function generateSlug(title: string) {
    const normalized = title
        .replace(/–|—|−/g, '-') // thay thế en-dash, em-dash, minus sign thành -
        .trim();

    return slugify(normalized, {
        lower: true,
        locale: 'vi',
        strict: false // giữ các ký tự có dấu tiếng Việt
    });
}