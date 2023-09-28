from langdetect import detect

def detect_language(text):
    try:
        detected_lang = detect(text)
        return detected_lang
    except Exception as e:
        return str(e)

# Example usage:
# input_text = "This is a sample text in English."
# result = detect_language(input_text)
# print(f"Detected Language: {result}")
