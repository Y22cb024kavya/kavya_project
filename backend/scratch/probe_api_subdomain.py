import urllib.request
import urllib.error
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    'https://api.voktaa.com/',
    'https://api.voktaa.com/api/health',
    'https://api.voktaa.com/health',
    'http://api.voktaa.com/api/health'
]

for url in urls:
    print(f"=== TESTING: {url} ===")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            body = resp.read().decode('utf-8', errors='ignore')
            ct = resp.headers.get('Content-Type')
            print(f"Status: {resp.status}")
            print(f"Content-Type: {ct}")
            print(f"Body Prefix: {body[:300]}\n")
    except urllib.error.HTTPError as e:
        body = e.read().decode('utf-8', errors='ignore')
        ct = e.headers.get('Content-Type')
        print(f"HTTP Error {e.code}")
        print(f"Content-Type: {ct}")
        print(f"Body Prefix: {body[:300]}\n")
    except Exception as e:
        print(f"Error: {type(e).__name__} - {e}\n")
