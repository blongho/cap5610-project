import fitz  
from io import BytesIO
import re


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extracts raw text from PDF bytes."""
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    texts = []
    for page in doc:
        texts.append(page.get_text())
    doc.close()
    return "\n".join(texts)


SECTION_HEADINGS = [
    "abstract",
    "introduction",
    "related work",
    "methodology",
    "methods",
    "experiments",
    "results",
    "discussion",
    "conclusion",
]


def split_into_sections(raw_text: str) -> dict[str, str]:
    """
    Naive section splitter based on headings in all caps or Title Case.
    """
    text = raw_text
    sections = {}
    # Create a regex to find headings
    pattern = re.compile(
        r"^\s*(\d+\.?\s+)?(" + "|".join(SECTION_HEADINGS) + r")\s*$",
        re.IGNORECASE | re.MULTILINE,
    )

    matches = list(pattern.finditer(text))
    if not matches:
        return {"full": text}

    for i, m in enumerate(matches):
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        heading = m.group(2).lower()
        sections[heading] = text[start:end].strip()

    return sections
