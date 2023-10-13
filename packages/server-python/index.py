import http.server
import socketserver
import json
from langdetect_function import detect_language as detect_langdetect
from langid_function import detect_language as detect_langid
from urllib.parse import urlparse, parse_qs

class MyHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL to extract query parameters
        url_parts = urlparse(self.path)
        query_params = parse_qs(url_parts.query)

        # Check if the "text" parameter is present in the query
        if 'text' in query_params:
            text_value = query_params['text'][0]
            source_lang = query_params['sourceLang'][0]
            
            langdetect_result = detect_langdetect(text_value, source_lang)
            langid_result = detect_langid(text_value, source_lang)

            response_message = {
                'langdetect': langdetect_result,
                'langid': langid_result,
            }
            print('Response Message:', response_message)
            static_response = {
                'langdetect': 'langdetect_result',
                'langid': 'langid_result',
            }
            print('static_response:', static_response)
            # Send the HTTP response with the response_message as JSON
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(static_response).encode('utf-8'))
        else:
            response_message = "No 'text' parameter found in the query."
            # Send the response
            self.send_response(200)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(response_message.encode('utf-8'))

# Set the port you want to listen on
port = 5000

# Create the server and bind it to the specified port
with socketserver.TCPServer(("", port), MyHandler) as httpd:
    print(f"Serving at port {port}")
    # Start the server, this will run indefinitely until you stop it manually
    httpd.serve_forever()





#  how to send as plain text

# Create a plain text response message
# response_text = f"Langdetect Result: {langdetect_result},\nLangid Result: {langid_result}"
# Send the HTTP response with the response_message as JSON
# self.send_response(200)
# self.send_header('Content-type', 'text/plain')
# self.end_headers()
# self.wfile.write(response_message.encode('utf-8'))