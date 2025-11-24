import os
from pydantic import BaseModel
from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL", "https://api.groq.com/openai/v1"),
)

MODEL = os.getenv("OPENAI_MODEL", "openai/gpt-oss-120b")


class LLMResponse(BaseModel):
    text: str


def summarize_baseline(text: str, section_name: str | None = None) -> LLMResponse:
    section_info = f" for the {section_name} section" if section_name else ""
    prompt = f"""
You are an expert research assistant.

Summarize the following research paper text{section_info} clearly and concisely.
Focus on the key ideas, contributions, and main findings.

Text:
{text}
"""
    completion = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=600,
    )
    return LLMResponse(text=completion.choices[0].message.content.strip())


def summarize_cot(text: str, section_name: str | None = None) -> LLMResponse:
    section_info = f" for the {section_name} section" if section_name else ""
    prompt = f"""
    You are an expert research assistant using Chain-of-Thought reasoning.

    **TASK:** Analyze the provided text. Your total response must not exceed 500 words and contains no markdown formatting. Separate sections by headings (ALL CAPS) and empy lines. 

    **INSTRUCTIONS:**
    First extract the citation of the paper as in the IEEE format. Then, provide a detailed reasoning trace ad defined below.
    1.  First, conduct a step-by-step internal analysis. Think about:
        - The core topic, claim, or contribution.
        - The key evidence, methods, or arguments used.
        - The strengths and any limitations or assumptions.
        - The broader context and implications.
    2.  Then, produce a final, concise summary that synthesizes your analysis.

    Structure your final output clearly as follows:

    Citation (IEEE Format):
    [Extracted citation in IEEE format]
    
    ## Reasoning Trace
    [Your step-by-step analysis here. Be thorough but concise.]

    ## Final Summary
    [A coherent, 3-4 sentence summary integrating your key findings.]

    Text:
    {text}

    Begin. Remember the 500-word limit for your entire response.
    """
    completion = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=900,
    )
    return LLMResponse(text=completion.choices[0].message.content.strip())
