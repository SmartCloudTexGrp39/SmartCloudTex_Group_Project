import hashlib
import io

def generate_file_hash(file_bytes: bytes) -> str:
    """Generates a SHA-256 hash for the given file contents."""
    sha256_hash = hashlib.sha256()
    sha256_hash.update(file_bytes)
    return sha256_hash.hexdigest()
