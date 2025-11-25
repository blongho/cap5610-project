# evaluation.py
from typing import Dict
from rouge_score import rouge_scorer
import sacrebleu


def compute_rouge(system_summary: str, reference_summary: str) -> Dict[str, float]:
    """
    Compute ROUGE-1, ROUGE-2, ROUGE-L F1 scores.
    Returns a dict with float scores in [0, 1].
    """
    scorer = rouge_scorer.RougeScorer(["rouge1", "rouge2", "rougeL"], use_stemmer=True)

    scores = scorer.score(reference_summary, system_summary)

    return {
        "rouge1": scores["rouge1"].fmeasure,
        "rouge2": scores["rouge2"].fmeasure,
        "rougeL": scores["rougeL"].fmeasure,
    }


def compute_bleu(system_summary: str, reference_summary: str) -> float:
    """
    Compute corpus-level BLEU for a single hypothesis/reference pair.
    Returns a BLEU score in [0, 100].
    """
    bleu = sacrebleu.corpus_bleu(
        [system_summary],
        [[reference_summary]],
    )
    return bleu.score
