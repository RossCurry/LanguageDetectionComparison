import py3langid as langid

def detect_language(text):
    try:
        detected_lang = langid.classify(text)
        return detected_lang
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

