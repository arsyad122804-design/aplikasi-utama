Add-Type -AssemblyName System.Drawing

$targetDir = "d:\aplikasi utama\icons"
if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir | Out-Null
}

function Create-Icon {
    param (
        [int]$size,
        [string]$filename
    )
    $bmp = New-Object System.Drawing.Bitmap($size, $size)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    # Enable high quality rendering
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    
    # Background - Indigo color (#4F46E5 = R:79, G:70, B:229)
    $color = [System.Drawing.Color]::FromArgb(255, 79, 70, 229)
    $brush = New-Object System.Drawing.SolidBrush($color)
    
    # Draw a rounded rect / circle for the background
    $rect = New-Object System.Drawing.Rectangle(0, 0, $size, $size)
    $g.FillEllipse($brush, $rect)
    
    # Draw text 'U' in the center
    $fontSize = $size * 0.45
    $font = New-Object System.Drawing.Font("Segoe UI", $fontSize, [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    
    $textSize = $g.MeasureString("U", $font)
    
    # Precision offset calculation to center 'U' visually
    $x = ($size - $textSize.Width) / 2
    # Adjust y offset for Segoe UI vertical alignment
    $y = ($size - $textSize.Height) / 2 + ($size * 0.02)
    
    $g.DrawString("U", $font, $textBrush, $x, $y)
    
    # Save to path
    $path = Join-Path $targetDir $filename
    $bmp.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Clean up
    $textBrush.Dispose()
    $font.Dispose()
    $brush.Dispose()
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Success: Generated $path"
}

Create-Icon -size 512 -filename "icon-512.png"
Create-Icon -size 192 -filename "icon-192.png"
Create-Icon -size 180 -filename "apple-touch-icon.png"
