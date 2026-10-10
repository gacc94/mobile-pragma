/**
 * Commitlint configuration aligned with Conventional Commits
 * and emoji validation per commit type.
 */
const TYPE_EMOJI_MAP = {
    feat: ['✨', ':sparkles:'],
    fix: ['🐛', ':bug:'],
    docs: ['📝', ':memo:'],
    style: ['💄', ':lipstick:'],
    refactor: ['♻️', '♻', ':recycle:'],
    perf: ['⚡️', '⚡', ':zap:'],
    test: ['✅', ':white_check_mark:'],
    build: ['📦️', '📦', ':package:'],
    ci: ['👷', ':construction_worker:'],
    chore: ['🔧', ':wrench:'],
    revert: ['⏪️', '⏪', ':rewind:'],
};

/**
 * Concise plugin to validate that each commit type includes its corresponding emoji.
 */
const commitlintPluginTypeEmoji = {
    rules: {
        'type-emoji': (parsed) => {
            const { type, header, raw } = parsed;
            if (!type) {
                return [true];
            }

            const allowedEmojis = TYPE_EMOJI_MAP[type];
            if (!allowedEmojis) {
                return [true];
            }

            const text = raw || header || '';
            const hasValidEmoji = allowedEmojis.some((emoji) => text.includes(emoji));

            if (!hasValidEmoji) {
                return [
                    false,
                    `Commit of type "${type}" must include its corresponding emoji: ${allowedEmojis[0]} (${allowedEmojis[1]})`,
                ];
            }

            return [true];
        },
    },
};

module.exports = {
    extends: ['@commitlint/config-conventional'],
    parserPreset: {
        parserOpts: {
            // Supports both "<emoji> <type>(<scope>): <subject>" and "<type>(<scope>): <emoji> <subject>"
            headerPattern: /^(?:(?::\w+:|[\p{Emoji}\u200d\uFE0F]+)\s+)?(\w+)(?:\((.*)\))?!?: (.*)$/u,
            headerCorrespondence: ['type', 'scope', 'subject'],
        },
    },
    plugins: [commitlintPluginTypeEmoji],
    rules: {
        'type-emoji': [2, 'always'],
        'subject-case': [0],
    },
};
