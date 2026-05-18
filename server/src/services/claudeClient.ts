import Anthropic from '@anthropic-ai/sdk';
import { env } from '../env.js';

const anthropic = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

export const claudeClient = {
  async complete(prompt: string): Promise<string> {
    const message = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 4096,
      thinking: { type: 'adaptive' },
      messages: [{ role: 'user', content: prompt }],
    });

    return message.content
      .flatMap((block) => (block.type === 'text' ? [block.text] : []))
      .join('\n');
  },
};
