import sys
import os

cwd = os.path.dirname(__file__)
if cwd not in sys.path:
    sys.path.insert(0, cwd)

try:
    from a2wsgi import ASGIMiddleware
    from server import app
    application = ASGIMiddleware(app)
except Exception as err:
    def application(environ, start_response):
        status = '500 Internal Server Error'
        output = f'Hostinger Passenger WSGI Startup Error: {err}'.encode('utf-8')
        response_headers = [('Content-type', 'text/plain'), ('Content-Length', str(len(output)))]
        start_response(status, response_headers)
        return [output]
