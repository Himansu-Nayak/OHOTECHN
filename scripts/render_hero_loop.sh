#!/bin/bash
set -e
INPUT="/opt/oho-tech/source/public/images/hero-surreal-office.jpg"
OUTPUT="/opt/oho-tech/source/public/videos/hero-surreal-office.mp4"
mkdir -p /opt/oho-tech/source/public/videos

echo "Starting ffmpeg render of 8s (192 frames @ 24fps) seamless loop..."
ffmpeg -y -loop 1 -i "$INPUT" \
  -filter_complex "zoompan=z='1.0+0.035*(0.5-0.5*cos(2*PI*on/192))':x='(iw-iw/zoom)/2+5*sin(2*PI*on/192)':y='(ih-ih/zoom)/2+1.5*sin(4*PI*on/192)':d=192:s=1376x768:fps=24" \
  -t 8 -c:v libx264 -pix_fmt yuv420p -crf 17 -preset slow -movflags +faststart "$OUTPUT"

chown -R ohotech:ohotech /opt/oho-tech/source/public/videos
echo "RENDER_SUCCESS: $OUTPUT generated"
ls -lh "$OUTPUT"
