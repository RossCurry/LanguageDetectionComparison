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
            # response_message = f"You sent the following text: {text_value}"
            
            langdetect_result = detect_langdetect(text_value)
            langid_result = detect_langid(text_value)

            print('langdetect_result', langdetect_result)
            print('langid_result', langid_result, type(langid_result))
            
            response_message = {
                'text': text_value,
                'langdetect': { 'lang': langdetect_result, 'confidence': None },
                'langid': { 'lang': langid_result[0], 'confidence': float(langid_result[1]) }
            }
            
            # Send the HTTP response with the response_message as JSON
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(response_message).encode('utf-8'))
        else:
            response_message = "No 'text' parameter found in the query."
            # Send the response
            self.send_response(200)
            # self.send_header('Content-type', 'text/plain')
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            self.wfile.write(response_message.encode('utf-8'))


# Set the port you want to listen on
port = 8000

# Create the server and bind it to the specified port
with socketserver.TCPServer(("", port), MyHandler) as httpd:
    print(f"Serving at port {port}")
    # Start the server, this will run indefinitely until you stop it manually
    httpd.serve_forever()
