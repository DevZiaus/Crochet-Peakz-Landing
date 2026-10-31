export const CONTACT_TOPICS = {
    general: 'A general hello',
    custom: 'A custom piece',
    patterns: 'Patterns & guides',
    stock: 'A store question',
} as const;

export type ContactTopic = keyof typeof CONTACT_TOPICS;

export function isContactTopic(value: string): value is ContactTopic {
    return Object.prototype.hasOwnProperty.call(CONTACT_TOPICS, value);
}
