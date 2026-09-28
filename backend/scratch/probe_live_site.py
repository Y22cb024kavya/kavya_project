import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

url = "https://voktaa.com/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx) as resp:
    html = resp.read().decode('utf-8')

js_files = re.findall(r'src="(/static/js/[^"]+)"', html)
print("JS files on live website:", js_files)

for js in js_files:
    js_url = f"https://voktaa.com{js}"
    req_js = urllib.request.Request(js_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req_js, context=ctx) as resp_js:
        content = resp_js.read().decode('utf-8')
        print(f"\n=== File: {js_url} (Length: {len(content)}) ===")
        print("Contains 'api.voktaa.com':", "api.voktaa.com" in content)
        print("Contains '/api/auth/login':", "/api/auth/login" in content)
        
        matches = [m.start() for m in re.finditer(r'/api/auth/login', content)]
        for i in matches:
            print("  Context:", repr(content[max(0, i-70):min(len(content), i+70)]))
