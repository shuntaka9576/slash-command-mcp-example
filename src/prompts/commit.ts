import type { GetPromptResult } from "@modelcontextprotocol/sdk/types.js";

const emojiMap: Record<string, string> = {
	feat: "✨",
	fix: "🐛",
	docs: "📝",
	style: "💄",
	refactor: "♻",
	perf: "⚡",
	test: "✅",
	build: "📦",
	ci: "👷",
	chore: "🔧",
	revert: "⏪",
};

const descriptionMap: Record<string, string> = {
	feat: "新機能",
	fix: "バグ修正",
	docs: "ドキュメント",
	style: "スタイル調整",
	refactor: "リファクタリング",
	perf: "パフォーマンス改善",
	test: "テスト",
	build: "ビルドシステム",
	ci: "CI設定",
	chore: "雑務",
	revert: "変更を元に戻す",
};

export function commitPrompt(
	type: string,
	customDescription?: string,
): GetPromptResult {
	const emoji = emojiMap[type] || "📝";
	const defaultDescription = descriptionMap[type] || "変更";
	const description = customDescription || defaultDescription;

	return {
		description: `Conventional Commit形式のコミットメッセージを生成`,
		messages: [
			{
				role: "user",
				content: {
					type: "text",
					text: `以下の情報を元に、Conventional Commit形式のコミットメッセージを生成してください：

タイプ: ${type}
絵文字: ${emoji}
説明: ${description}

フォーマット:
${type}: ${emoji} <簡潔な説明>

<詳細な説明（必要に応じて）>

例:
feat: ✨ ユーザー認証機能を追加
fix: 🐛 ログイン時のエラーを修正
docs: 📝 READMEを更新`,
				},
			},
			{
				role: "assistant",
				content: {
					type: "text",
					text: `${type}: ${emoji} ${description}`,
				},
			},
		],
	};
}
