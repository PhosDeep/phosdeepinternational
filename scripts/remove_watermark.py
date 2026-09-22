import glob
import os
import concurrent.futures
from PIL import Image

def process_frame(filepath):
    try:
        img = Image.open(filepath).convert("RGB")
        pixels = img.load()
        
        x1, x2 = 1690, 1785
        y1, y2 = 855, 945
        fade_y = 12

        for y in range(y1, y2 + 1):
            c1 = pixels[x1, y]
            c2 = pixels[x2, y]
            
            if y - y1 < fade_y:
                wy = (y - y1) / float(fade_y)
            elif y2 - y < fade_y:
                wy = (y2 - y) / float(fade_y)
            else:
                wy = 1.0
                
            wy = wy * wy * (3.0 - 2.0 * wy)
            
            for x in range(x1, x2 + 1):
                t = (x - x1) / float(x2 - x1)
                bg_r = (1.0 - t) * c1[0] + t * c2[0]
                bg_g = (1.0 - t) * c1[1] + t * c2[1]
                bg_b = (1.0 - t) * c1[2] + t * c2[2]
                
                orig = pixels[x, y]
                r = int(orig[0] * (1.0 - wy) + bg_r * wy)
                g = int(orig[1] * (1.0 - wy) + bg_g * wy)
                b = int(orig[2] * (1.0 - wy) + bg_b * wy)
                pixels[x, y] = (r, g, b)
                
        img.save(filepath, "JPEG", quality=90)
        return True
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    files = sorted(glob.glob("public/robot-frames/ezgif-frame-*.jpg"))
    print(f"Processing {len(files)} frames...")
    
    with concurrent.futures.ProcessPoolExecutor() as executor:
        results = list(executor.map(process_frame, files))
        
    print(f"Successfully cleaned {sum(results)} / {len(files)} frames!")

if __name__ == "__main__":
    main()
