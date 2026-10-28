import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());

const allowedOrigins = [
  process.env.ALLOWED1,
  process.env.ALLOWED2,
  process.env.ALLOWED3,
  process.env.ALLOWED4,
];

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/jev", async (req, res) => {
  try {
    const { input } = req.body ?? {};

    if (!input) {
      return res.status(400).json({
        error: "Missing required field: input",
      });
    }

    const response = await fetch("https://openrouter.ai/api/alpha/decisions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        // model: "typesafe/jev-1.13",
        // model: "typesafe/jev-1.14",
        model: "~typesafe/jev-latest",
        // model: "baseten/mammoth-1:free",
        // model: "baseten/elephant-1:free",
        state: input,
        questions: {
          whichLanguage: {
            type: "score",
            instructions:
              "Which programming language is the best fit for building this project?",
            criteria: [
              {
                name: "javascript_typescript",
                description:
                  "Choose JavaScript or TypeScript for full-stack web development, React, Next.js, and Node.js applications.",
              },
              {
                name: "python",
                description:
                  "Choose Python for AI/ML, LLM integrations, RAG pipelines, automation, and FastAPI or Django backends.",
              },
              {
                name: "java",
                description:
                  "Choose Java for enterprise applications, large-scale backends, and JVM-based systems.",
              },
              {
                name: "cpp",
                description:
                  "Choose C++ for performance-critical applications, systems programming, and game engines.",
              },
              {
                name: "csharp",
                description:
                  "Choose C# for .NET applications, enterprise backends, Windows software, and Unity games.",
              },
              {
                name: "go",
                description:
                  "Choose Go for cloud-native applications, microservices, networking, and concurrent backend services.",
              },
              {
                name: "rust",
                description:
                  "Choose Rust for systems programming, performance-sensitive applications, and memory-safe services.",
              },
              {
                name: "dart",
                description:
                  "Choose Dart for cross-platform applications built with Flutter.",
              },

              {
                name: "sql",
                description:
                  "Choose SQL for database queries, relational data management, and analytics. It is generally complementary to a primary programming language.",
              },
              {
                name: "solidity",
                description:
                  "Choose Solidity for Ethereum-compatible smart contracts and decentralized applications.",
              },
            ],
          },
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("OpenRouter API error:", result);

      return res.status(response.status).json({
        error: "Decision API request failed",
        details: result,
      });
    }

    console.log("Id:", result.id);
    console.log("Provider:", result.provider);
    console.log("Model:", result.model);
    console.log("Usage:", result.usage);

    return res.json(result.answers);
  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
