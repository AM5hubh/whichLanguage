import express from "express";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

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
        model: "typesafe/jev-1.13",
        state: input,
        questions: {
          whichLanguage: {
            type: "choice",
            instructions:
              "Which programming language is the best fit for building this project?",
            criteria: {
              javascript_typescript:
                "Choose JavaScript or TypeScript for full-stack web development, React, Next.js, and Node.js applications.",
              python:
                "Choose Python for AI/ML, LLM integrations, RAG pipelines, automation, and FastAPI or Django backends.",
              java: "Choose Java for enterprise applications, large-scale backends, and JVM-based systems.",
              cpp: "Choose C++ for performance-critical applications, systems programming, and game engines.",
              csharp:
                "Choose C# for .NET applications, enterprise backends, Windows software, and Unity games.",
              go: "Choose Go for cloud-native applications, microservices, networking, and concurrent backend services.",
              rust: "Choose Rust for systems programming, performance-sensitive applications, and memory-safe services.",
              dart: "Choose Dart for cross-platform applications built with Flutter.",
              kotlin:
                "Choose Kotlin for modern Android applications and JVM-based services.",
              swift: "Choose Swift for native Apple-platform applications.",
              php: "Choose PHP for Laravel, WordPress, and server-rendered web applications.",
              sql: "Choose SQL for database queries, relational data management, and analytics; it is generally complementary to a primary programming language.",
              solidity:
                "Choose Solidity for Ethereum-compatible smart contracts and decentralized applications.",
              multiple_languages:
                "Choose multiple languages when different project components benefit from different ecosystems, such as TypeScript for the frontend and Python for AI services.",
            },
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

    console.log("Jev result:", result);

    return res.json(result);
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
