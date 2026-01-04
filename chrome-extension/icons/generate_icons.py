# Icon Generator Script
# Since we can't easily convert SVG to PNG without external tools,
# you can use one of these methods:

# Method 1: Use an online converter
# - Go to https://cloudconvert.com/svg-to-png
# - Upload icon128.svg
# - Convert to 128x128, 48x48, and 16x16 PNG files

# Method 2: Use ImageMagick (if installed)
# convert -background none icon128.svg -resize 128x128 icon128.png
# convert -background none icon128.svg -resize 48x48 icon48.png
# convert -background none icon128.svg -resize 16x16 icon16.png

# Method 3: Use Python with cairosvg (install: pip install cairosvg)
try:
    import cairosvg
    import os
    
    icon_dir = os.path.dirname(__file__)
    svg_file = os.path.join(icon_dir, 'icon128.svg')
    
    # Generate PNG icons at different sizes
    sizes = [16, 48, 128]
    for size in sizes:
        output_file = os.path.join(icon_dir, f'icon{size}.png')
        cairosvg.svg2png(
            url=svg_file,
            write_to=output_file,
            output_width=size,
            output_height=size
        )
        print(f'Generated icon{size}.png')
    
    print('All icons generated successfully!')
    
except ImportError:
    print('cairosvg not installed. Install it with: pip install cairosvg')
    print('Or use Method 1 or 2 above to create icons manually.')
