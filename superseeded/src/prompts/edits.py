
def create_edits_prompt(feedback, draft):
    """Format the question prompt to compile the original draft followed by suggested edits."""
    return f"""
    ========================================
    Original Draft:
    {draft}

    ========================================

    Feedback:
    {feedback}

    ========================================

    Your task is to review the original draft and suggest specific edits. 
    Please list your suggested edits in a clear and organized manner after the feedback. 
    For each suggested edit, reference the part of the original draft it applies to, and provide a clear description or example of the change. 
    This structured approach will  help track changes more efficiently.

    For all suggested edits, please use the following format:
    Original chunk of writing: <writing>
    Suggested edit: <edit>
    Reasoning: <reason>

    ========================================
    Edits:
    """
