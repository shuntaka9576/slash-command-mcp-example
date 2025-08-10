#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	GetPromptRequestSchema,
	ListPromptsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { commitPrompt } from "./prompts/commit.ts";

const server = new Server(
	{
		name: "slash-command-mcp-example",
		version: "1.0.0",
	},
	{
		capabilities: {
			prompts: {},
		},
	},
);

server.setRequestHandler(ListPromptsRequestSchema, async () => {
	return {
		prompts: [
			{
				name: "commit",
				description: "Conventional Commitタイプからコミットメッセージを生成",
				arguments: [
					{
						name: "type",
						description:
							"Conventional Commitタイプ (feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert)",
						required: true,
					},
					{
						name: "description",
						description: "コミットの詳細説明",
						required: false,
					},
				],
			},
		],
	};
});

server.setRequestHandler(GetPromptRequestSchema, async (request) => {
	const { name, arguments: args } = request.params;

	if (name === "commit") {
		const type = args?.type as string;
		const description = args?.description as string | undefined;

		if (!type) {
			throw new Error("Conventional Commitタイプが必要です");
		}

		return commitPrompt(type, description);
	}

	throw new Error(`プロンプト "${name}" が見つかりません`);
});

async function main() {
	const transport = new StdioServerTransport();
	await server.connect(transport);
	console.error("MCP server started");
}

main().catch((error) => {
	console.error("Server error:", error);
	process.exit(1);
});
