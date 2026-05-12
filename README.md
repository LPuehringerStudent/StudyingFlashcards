# Flashcard Trainer

A simple, browser-based flashcard training app. Load your cards from a JSON file, paste them directly, or pick from the built-in repository — then flip, shuffle, and navigate through them with mouse or keyboard.

## Usage

1. Open `index.html` in any modern web browser.
2. Load flashcards via:
   * **Repository file** — choose from the dropdown (e.g. `flashcards/Banm3SecondTest.json`)
   * **Paste JSON** — copy-paste your card data into the textarea
   * **Upload a file** — select a local `.json` or `.txt` file
3. Click **Start Training** to begin.
4. Controls during training:
   * **Flip** — click the card or press `Space`
   * **Next / Previous** — buttons or `ArrowRight` / `ArrowLeft`
   * **Shuffle** — randomize card order
   * **Edit Cards** — go back to modify the input

## Flashcard Syntax

Flashcards must be provided as a **JSON array** of objects. Each object must contain exactly two fields:

| Field      | Type   | Description                              |
|------------|--------|------------------------------------------|
| `question` | string | The text shown on the front of the card  |
| `answer`   | string | The text revealed when the card is flipped |

### Minimal example

```json
[
  { "question": "What is the capital of France?", "answer": "Paris" },
  { "question": "What is 2 + 2?", "answer": "4" }
]
```

### Rules

* The top-level value must be an array (`[ ... ]`).
* Every object in the array must have both a `question` and an `answer` field.
* Values must be valid JSON strings (use double quotes for keys and string values).
* The app does not support markdown or HTML inside cards — plain text only.

### File storage

You can store deck files anywhere and load them via copy-paste or file upload. If you want a deck to appear in the repository dropdown, place a `.json` file under the `flashcards/` directory and add its path to the `<select>` element in `index.html`.
