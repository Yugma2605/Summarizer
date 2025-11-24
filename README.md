# Zypher Multi-Format Summarizer

![Deno](https://img.shields.io/badge/Deno-v1.x-white?logo=deno&style=flat-square)
![Gemini](https://img.shields.io/badge/Google%20Gemini-2.0%20Flash-blue?style=flat-square)
![Zypher](https://img.shields.io/badge/Agent-Zypher-purple?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript&style=flat-square)

**Zypher Multi-Format Summarizer** is an AI-powered document processing tool designed for efficiency and speed. Built using **Zypher**, **Gemini 2.0 Flash**, and **Deno**, this tool automatically scans folders, extracts text from multiple file types, and generates clean, structured Markdown summaries.

This tool is ideal for **students, researchers, software developers, and analysts** who need to process large volumes of documents quickly without reading every line.

---

## 🚀 Features

### 1. Multi-Format Support
The agent seamlessly extracts and processes content from a wide variety of file types:
- 📄 **Documents:** `.pdf`, `.docx`, `.txt`, `.md`, `.markdown`
- 📊 **Data:** `.csv`, `.json`

### 2. Automatic Summarization
For every file processed, the agent generates a `.summary.md` file containing:
- A short paragraph overview
- Key bullet points (4-6 items)
- Suggested categorization tags (3-6 tags)

### 3. Intelligent Architecture
- **Powered by Zypher:** Ensures consistent agent execution, structured event-based streaming, and easy LLM integration
- **Powered by Gemini 2.0 Flash:** Delivers low-latency, high-quality responses perfect for real-time processing
- **Modular Codebase:** Clean separation of concerns (extraction, summarization, file system utilities)
- **Automatic Folder Processing:** Recursively processes all supported files in a directory
- **Smart Text Truncation:** Handles large files by intelligently truncating content while preserving context

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Deno** (v1.0 or higher)
   - Installation: [Deno Installation Guide](https://deno.land/manual/getting_started/installation)
   - Verify installation: `deno --version`

2. **Google Gemini API Key**
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - You'll need this to configure the environment

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Summarizer
```

### 2. Configure Environment Variables

Create a `.env` file in the root of the project:

```bash
# .env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

**Important:** Replace `your_google_gemini_api_key_here` with your actual Google Gemini API key.

### 3. Dependencies

No manual installation is required! Deno handles dependencies automatically via URL imports and JSR (JavaScript Registry). The project uses:

- `@corespeed/zypher` - Agent framework
- `jsr:@std/dotenv/load` - Environment variable loading
- `jsr:@pdf/pdftext@1.3.2` - PDF text extraction
- Deno standard library modules for file system operations

---

## 🎯 Usage

### Basic Usage

Process all supported files in the current directory:

```bash
deno run --allow-read --allow-write --allow-env --allow-net src/main.ts
```

### Process a Specific Folder

To process files in a specific folder, provide the folder path as an argument:

```bash
deno run --allow-read --allow-write --allow-env --allow-net src/main.ts documents
```

Or with an absolute path:

```bash
deno run --allow-read --allow-write --allow-env --allow-net src/main.ts /path/to/your/documents
```

### Permissions Explained

The required Deno permissions are:
- `--allow-read`: Read files from the input directory
- `--allow-write`: Write summary files to the output directory
- `--allow-env`: Access environment variables (for API key)
- `--allow-net`: Make API calls to Google Gemini

### Example Workflow

1. **Prepare your documents:**
   ```bash
   # Create a documents folder (or use existing one)
   mkdir documents
   
   # Add your files
   cp your-file.pdf documents/
   cp your-data.json documents/
   ```

2. **Run the summarizer:**
   ```bash
   deno run -A src/main.ts /documents
   ```

3. **Check the results:**
   ```bash
   # Summaries are saved in the 'summaries' folder
   ls summaries/
   # You'll see files like: your-file.pdf.summary.md
   ```

---

## 📂 Project Structure

```
Summarizer/
├── src/
│   ├── main.ts                    # Entry point
│   ├── config.ts                  # Configuration and environment variables
│   ├── types.ts                   # TypeScript type definitions
│   ├── paths.ts                   # Path resolution utilities
│   │
│   ├── extract/                   # File extraction modules
│   │   ├── extract_text.ts        # Main extraction router
│   │   ├── extract_pdf.ts         # PDF extraction
│   │   ├── extract_docx.ts        # DOCX extraction
│   │   ├── extract_txt_md.ts      # Text and Markdown extraction
│   │   ├── extract_json.ts        # JSON extraction
│   │   └── extract_csv.ts         # CSV extraction
│   │
│   ├── processing/                # File processing orchestration
│   │   ├── process_file.ts        # Process individual files
│   │   └── process_folder.ts      # Process entire folders
│   │
│   └── summarizer/                # AI summarization logic
│       ├── agent.ts               # Zypher agent creation
│       ├── prompt.ts              # Prompt engineering
│       └── run_agent.ts           # Agent execution
│
├── documents/                     # Input folder (place your files here)
├── summaries/                     # Output folder (generated summaries)
├── cache/                         # Cache directory (auto-generated)
│   └── files/
├── .env                           # Environment variables (create this)
└── README.md                     
```

---

## 📄 Supported File Formats

| Format | Extension | Description |
|--------|-----------|-------------|
| **PDF** | `.pdf` | Extracts text from PDF documents |
| **Word** | `.docx` | Extracts text from Microsoft Word documents |
| **Text** | `.txt` | Plain text files |
| **Markdown** | `.md`, `.markdown` | Markdown formatted documents |
| **JSON** | `.json` | JSON data files (API responses, configs, etc.) |
| **CSV** | `.csv` | Comma-separated values data files |

---

## 📝 Output Format

Each processed file generates a `.summary.md` file with the following structure:

```markdown
Summary: [One short paragraph describing the document]

Key Points:
- [Point 1]
- [Point 2]
- [Point 3]
- [Point 4]
- [Point 5]

Suggested Tags:
- [tag1]
- [tag2]
- [tag3]
- [tag4]
```

**Output Location:** All summaries are saved in the `summaries/` folder with the naming pattern: `[original-filename].[extension].summary.md`

---

## ⚙️ Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Your Google Gemini API key |

### Customization

You can modify the following in `src/config.ts`:

- **Allowed Extensions:** Modify the `ALLOWED_EXT` set to add/remove supported file types
- **Output Directory:** Change `OUTPUT_BASE` to customize where summaries are saved
- **Text Truncation:** Adjust truncation limits in `src/summarizer/prompt.ts` (currently 120,000 characters)

### Model Selection

The default model is `gemini-2.0-flash`. You can change this in `src/summarizer/run_agent.ts`:

```typescript
const result = await runAgent(agent, prompt, "gemini-2.0-flash-exp"); // or another model
```

---

## 🔍 How It Works

1. **Input Processing:** The tool scans the specified directory (or current directory) recursively
2. **File Detection:** Identifies files with supported extensions, skipping `node_modules`, `.git`, and `summaries` folders
3. **Text Extraction:** Uses format-specific extractors to pull text content from each file
4. **Content Truncation:** Large files (>120,000 chars) are truncated to fit API limits while preserving context
5. **AI Summarization:** Zypher agent sends content to Gemini 2.0 Flash with a structured prompt
6. **Streaming Response:** Processes the streaming response in real-time
7. **Output Generation:** Saves formatted Markdown summaries to the `summaries/` folder

---

## 🐛 Troubleshooting

### Common Issues

**1. "Missing environment variable: GEMINI_API_KEY"**
   - **Solution:** Create a `.env` file in the project root with your API key

**2. "PDF extraction failed"**
   - **Solution:** Ensure the PDF is not corrupted or password-protected. Some complex PDFs may not extract perfectly.

**3. "No supported files found"**
   - **Solution:** Check that your files have the correct extensions (`.pdf`, `.docx`, `.txt`, `.md`, `.json`, `.csv`)


### Debug Mode

To see more detailed output, the tool already logs:
- Files being processed
- Extraction warnings
- Summary save locations

---

## 📚 Dependencies

This project uses:

- **Deno Runtime** - Modern JavaScript/TypeScript runtime
- **@corespeed/zypher** - Agent framework for LLM interactions
- **Google Gemini 2.0 Flash** - AI model for summarization
- **JSR Packages** - JavaScript Registry packages for PDF and environment handling

All dependencies are managed automatically by Deno - no `package.json` or `node_modules` required!

---

**Happy Summarizing! 🎉**
