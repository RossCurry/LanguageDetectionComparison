from langdetect import detect
import time

def detect_language(text):
    try:
        startTime = time.time()
        detected_lang = detect(text)
        endTime = time.time()
        elapsedTime = endTime - startTime
        # return detected_lang
        translationResult = { 
            'detectedLang': detected_lang, 
            'confidence': None, 
            'originalText': text,
            'processingTimeMs': float(elapsedTime),
            'language': 'python'
        }
        return translationResult
    except Exception as e:
        return str(e)

# Example usage:
# input_text = "This is a sample text in English."
# result = detect_language(input_text)
# print(f"Detected Language: {result}")
