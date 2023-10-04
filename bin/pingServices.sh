#!/bin/bash

ping https://languagedetectionpython.onrender.com
ping https://languagedetectionexpress.onrender.com
ping https://languagedetectioncomparison.onrender.com

# deployHooks
# client
https://api.render.com/deploy/srv-cke3hhtjhfbs73el8brg?key=f3gQanez5Fo
# express
https://api.render.com/deploy/srv-cke2mkkgonuc739jbtgg?key=97TPHUkLnbY
# python
https://api.render.com/deploy/srv-cke2m7tjhfbs73ah08ug?key=LugJTEFTUDE

{
  langdetect: {
    detectedLang: 'cy',
    confidence: null,
    originalText: 'wedding45',
    processingTimeMs: 0.0029976367950439453,
    language: 'python'
  },
  langid: {
    detectedLang: 'en',
    confidence: 0.7132644653320312,
    originalText: 'wedding45',
    processingTimeMs: 0.18051552772521973,
    language: 'python'
  }
}