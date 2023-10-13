import py3langid as langid
import time

def detect_language(text, source_lang):
    try:
        startTime = time.time()
        detected_lang = langid.classify(text)
        endTime = time.time()
        elapsedTime = endTime - startTime
        # return detected_lang
        translationResult = { 
            'detectedLang': detected_lang[0], 
            'confidence': float(detected_lang[1]), 
            'originalText': text,
            'processingTimeMs': float(elapsedTime),
            'language': 'python',
            'sourceLang': source_lang
        }
        return translationResult
    except Exception as e:
        return str(e)


# text = 'nueve'
# # identified language and probability
# res = langid.classify(text)
# print(res)
# # unpack the result tuple in variables
# lang, prob = langid.classify(text)
# # all potential languages
# langid.rank(text)

