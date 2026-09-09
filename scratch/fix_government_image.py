from PIL import Image, ImageDraw, ImageFilter
import numpy as np

img = Image.open('frontend/public/serve_government_clean.jpg').convert('RGB')
w, h = img.size

# Convert to numpy array for image manipulation
arr = np.array(img)

# The flags sit between x=400..750 and y=110..175 above the dome structure
# Let's inspect the sky background color at y=70 across x=350..800
sky_sample = arr[50:90, 350:800]
sky_avg_color = sky_sample.mean(axis=(0, 1)).astype(int)

# Create a clean mask over the flag area (x=450 to x=720, y=100 to y=180)
# We sample sky rows from y=40..90 and fill down to y=175 smoothly
for x in range(400, 750):
    # grab column sky pixels above y=95
    sky_col = arr[40:95, x]
    avg_col_color = sky_col.mean(axis=0)
    
    for y in range(95, 178):
        # Fill with sky color gradient that smoothly matches the surrounding sky
        # Check if we are above the dome line
        # Dome top center is around x=580, y=175
        dist_to_dome = abs(x - 575)
        dome_roof_y = 175 - int(dist_to_dome * 0.05) if dist_to_dome < 60 else 178
        if y < dome_roof_y:
            # Smooth vertical blend into sky
            weight = (y - 95) / (178 - 95)
            # Sample sky from y=70
            arr[y, x] = (arr[70, x] * (1 - weight * 0.2) + avg_col_color * (weight * 0.2)).astype(np.uint8)

# Convert back to Image
cleaned = Image.fromarray(arr)
# Apply a subtle blur only over the touched sky area to make it seamlessly smooth
mask = Image.new('L', (w, h), 0)
draw = ImageDraw.Draw(mask)
draw.rectangle([400, 90, 750, 178], fill=255)

blurred = cleaned.filter(ImageFilter.GaussianBlur(radius=3))
cleaned.paste(blurred, (0, 0), mask)

cleaned.save('frontend/public/serve_government_clean.jpg', quality=95)
cleaned.save('frontend/public/serve_government.jpg', quality=95)
cleaned.save('frontend/build/serve_government_clean.jpg', quality=95)
cleaned.save('frontend/build/serve_government.jpg', quality=95)
print("Successfully removed flags from governance building image!")
