"""
Image Resizer for Hero Carousel
Resizes all images in gallery folder to 1920x600px (Hero section size)
"""

from PIL import Image
import os
from pathlib import Path

# Configuration
GALLERY_PATH = Path("public/images/gallery")
TARGET_WIDTH = 1920
TARGET_HEIGHT = 600
QUALITY = 85  # JPEG quality (1-100)

def resize_image(image_path, output_path, width, height):
    """
    Resize image to target dimensions with center crop
    """
    try:
        # Open image
        img = Image.open(image_path)
        
        # Convert to RGB if necessary (for PNG with transparency)
        if img.mode in ('RGBA', 'LA', 'P'):
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Calculate aspect ratios
        img_aspect = img.width / img.height
        target_aspect = width / height
        
        # Crop to target aspect ratio (center crop)
        if img_aspect > target_aspect:
            # Image is wider, crop width
            new_width = int(img.height * target_aspect)
            left = (img.width - new_width) // 2
            img = img.crop((left, 0, left + new_width, img.height))
        else:
            # Image is taller, crop height
            new_height = int(img.width / target_aspect)
            top = (img.height - new_height) // 2
            img = img.crop((0, top, img.width, top + new_height))
        
        # Resize to target dimensions
        img = img.resize((width, height), Image.Resampling.LANCZOS)
        
        # Save with optimization
        img.save(output_path, 'JPEG', quality=QUALITY, optimize=True)
        
        return True
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return False

def main():
    """
    Process all images in gallery folder
    """
    if not GALLERY_PATH.exists():
        print(f"Error: Gallery path not found: {GALLERY_PATH}")
        return
    
    # Get all image files
    image_extensions = {'.jpg', '.jpeg', '.png', '.webp'}
    image_files = [
        f for f in GALLERY_PATH.iterdir() 
        if f.suffix.lower() in image_extensions
    ]
    
    if not image_files:
        print("No images found in gallery folder")
        return
    
    print(f"Found {len(image_files)} images to resize")
    print(f"Target size: {TARGET_WIDTH}x{TARGET_HEIGHT}px")
    print("-" * 50)
    
    success_count = 0
    
    for image_file in image_files:
        print(f"Processing: {image_file.name}...", end=" ")
        
        # Create backup folder if it doesn't exist
        backup_path = GALLERY_PATH / "originals"
        backup_path.mkdir(exist_ok=True)
        
        # Backup original if not already backed up
        backup_file = backup_path / image_file.name
        if not backup_file.exists():
            import shutil
            shutil.copy2(image_file, backup_file)
        
        # Resize image
        if resize_image(image_file, image_file, TARGET_WIDTH, TARGET_HEIGHT):
            file_size = image_file.stat().st_size / 1024  # KB
            print(f"✓ Done ({file_size:.1f} KB)")
            success_count += 1
        else:
            print("✗ Failed")
    
    print("-" * 50)
    print(f"Completed: {success_count}/{len(image_files)} images resized")
    print(f"Original images backed up to: {backup_path}")

if __name__ == "__main__":
    main()
