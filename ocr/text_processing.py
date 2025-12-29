import re

def clean_text(text: str) -> str:
    # Remove non-ASCII characters
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)

    # Replace multiple spaces (not newlines)
    text = re.sub(r'[ \t]+', ' ', text)

    # Normalize excessive newlines
    text = re.sub(r'\n{3,}', '\n\n', text)

    return text.strip()


def handle_layout(text: str) -> str:
    lines = text.splitlines()
    formatted = []

    for line in lines:
        line = line.strip()

        # Detect headings (ALL CAPS)
        if line.isupper() and len(line) < 60:
            formatted.append("\n" + line)
        else:
            formatted.append(line)

    return "\n".join(formatted)


def validate_text(text: str) -> bool:
    return bool(text.strip()) and len(text.strip()) > 100
