import hashlib
import os
import hmac

def hash_password(password: str) -> str:
    """Hash password using PBKDF2 with SHA-256 and random 16-byte salt."""
    salt = os.urandom(16)
    kdf = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000)
    return f"{salt.hex()}:{kdf.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify password against salt:hash format."""
    try:
        salt_hex, key_hex = hashed_password.split(":")
        salt = bytes.fromhex(salt_hex)
        expected_key = bytes.fromhex(key_hex)
        key = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt, 100000)
        return hmac.compare_digest(key, expected_key)
    except Exception:
        return False
