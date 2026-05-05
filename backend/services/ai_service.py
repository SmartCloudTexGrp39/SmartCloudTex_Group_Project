import io
try:
    import pdfplumber
except ImportError:
    pdfplumber = None

try:
    from transformers import pipeline
    # Load zero-shot classification pipeline
    # NOTE: In production, load this once globally or asynchronously so it doesn't block startup
    # Using a lightweight model for MVP
    classifier = pipeline("zero-shot-classification", model="valhalla/distilbart-mnli-12-3")
except ImportError:
    classifier = None

CANDIDATE_LABELS = ["invoice", "design pattern", "supplier contract", "financial report", "employee record", "shipping document"]

def generate_keyword_tags(filename: str, text: str) -> list[str]:
    """Lightweight fallback for tagging when AI models are unavailable."""
    keywords = {
        "Invoice": ["invoice", "billing", "payment", "amount", "tax", "bill", "receipt", "total"],
        "Design": ["design", "pattern", "fabric", "textile", "sketch", "color", "texture", "motif", "print", "weave"],
        "Contract": ["contract", "agreement", "legal", "terms", "signed", "policy", "clause", "witness"],
        "Report": ["report", "financial", "analysis", "data", "summary", "monthly", "quarterly", "annual", "audit"],
        "Shipping": ["shipping", "delivery", "tracking", "logistics", "freight", "courier", "export", "import", "customs"],
        "Vendor": ["vendor", "supplier", "factory", "manufacturing", "production", "raw material", "source"],
        "Inventory": ["stock", "inventory", "warehouse", "sku", "quantity", "unit", "batch", "reorder"],
        "Customer": ["client", "customer", "order", "purchase", "buyer", "retail", "wholesale"],
        "Compliance": ["cert", "certification", "iso", "standard", "compliance", "regulation", "quality control", "qc"]
    }
    tags = []
    content = (filename + " " + text).lower()
    for tag, keys in keywords.items():
        if any(k in content for k in keys):
            tags.append(tag)
    return tags if tags else ["General"]

def extract_text_from_bytes(file_bytes: bytes, mime_type: str) -> str:
    """Extracts text from various file formats for NLP processing."""
    text = ""
    if mime_type == "application/pdf" and pdfplumber:
        try:
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text += page_text + "\n"
        except Exception as e:
            print(f"Error extracting PDF text: {str(e)}")
    elif mime_type == "text/plain":
        text = file_bytes.decode('utf-8', errors='ignore')
    
    return text[:2000] # Limit to first 2000 characters for performance

def generate_ai_tags(file_bytes: bytes, filename: str, mime_type: str) -> list[str]:
    """Uses zero-shot classification to categorize documents based on their text."""
    if not classifier:
        print("NLP Classifier not loaded. Using keyword-based fallback.")
        text = extract_text_from_bytes(file_bytes, mime_type)
        return generate_keyword_tags(filename, text)

    text = extract_text_from_bytes(file_bytes, mime_type)
    
    # Fallback to filename if no text could be extracted
    target_text = text if text.strip() else filename
    
    try:
        results = classifier(target_text, candidate_labels=CANDIDATE_LABELS)
        # Get labels with confidence > 30%
        tags = [label for label, score in zip(results['labels'], results['scores']) if score > 0.3]
        print(f"AI tagged '{filename}' as: {tags}")
        return tags
    except Exception as e:
        print(f"NLP classification failed: {str(e)}")
        return []
