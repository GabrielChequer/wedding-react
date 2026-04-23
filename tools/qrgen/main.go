package main

import (
	"bufio"
	"flag"
	"fmt"
	"image"
	"image/color"
	"image/draw"
	"image/png"
	"math"
	"os"
	"path/filepath"
	"strings"

	"github.com/boombuler/barcode"
	"github.com/boombuler/barcode/qr"
)

var (
	// #3b4834 — deep forest green
	fgColor = color.RGBA{R: 0x3b, G: 0x48, B: 0x34, A: 0xff}
	// warm off-white background
	bgColor = color.RGBA{R: 0xf8, G: 0xf6, B: 0xf1, A: 0xff}
)

func main() {
	var (
		urlTemplate string
		codesFlag   string
		codesFile   string
		outputDir   string
		size        int
	)

	flag.StringVar(&urlTemplate, "url", "", "URL template — use ${code} as the placeholder\n  e.g. https://example.com/?rsvp=${code}")
	flag.StringVar(&codesFlag, "codes", "", "Comma-separated list of RSVP codes")
	flag.StringVar(&codesFile, "file", "", "Path to a file with one RSVP code per line (# lines ignored)")
	flag.StringVar(&outputDir, "out", "", "Output directory (default: ~/Pictures/qrcodes)")
	flag.IntVar(&size, "size", 512, "QR module size in pixels (before frame is added)")
	flag.Parse()

	if urlTemplate == "" {
		fmt.Fprintln(os.Stderr, "Error: --url is required")
		fmt.Fprintln(os.Stderr, "\nExample:")
		fmt.Fprintln(os.Stderr, `  qrgen --url 'https://mywedding.com/?rsvp=${code}' --codes 'SMITH01,JONES02'`)
		os.Exit(1)
	}

	codes := collectCodes(codesFlag, codesFile)
	if len(codes) == 0 {
		fmt.Fprintln(os.Stderr, "Error: provide at least one code via --codes or --file")
		os.Exit(1)
	}

	if outputDir == "" {
		home, err := os.UserHomeDir()
		if err != nil {
			fatalf("cannot determine home directory: %v", err)
		}
		outputDir = filepath.Join(home, "Pictures", "qrcodes")
	}

	if err := os.MkdirAll(outputDir, 0o755); err != nil {
		fatalf("cannot create output directory %s: %v", outputDir, err)
	}

	fmt.Printf("Generating %d QR code(s) → %s\n\n", len(codes), outputDir)

	ok, fail := 0, 0
	for _, code := range codes {
		url := strings.ReplaceAll(urlTemplate, "${code}", code)
		outPath := filepath.Join(outputDir, fmt.Sprintf("qr_%s.png", sanitize(code)))

		if err := generate(url, outPath, size); err != nil {
			fmt.Fprintf(os.Stderr, "  FAIL  %s: %v\n", code, err)
			fail++
		} else {
			fmt.Printf("  OK    %s\n", code)
			ok++
		}
	}

	fmt.Printf("\nDone — %d generated, %d failed.\nFiles saved to: %s\n", ok, fail, outputDir)
}

func generate(content, outPath string, size int) error {
	// Encode at highest error correction level so it stays scannable even
	// with the decorative frame overlapping part of the quiet zone.
	raw, err := qr.Encode(content, qr.H, qr.Unicode)
	if err != nil {
		return fmt.Errorf("encode: %w", err)
	}

	scaled, err := barcode.Scale(raw, size, size)
	if err != nil {
		return fmt.Errorf("scale: %w", err)
	}

	colorized := colorize(scaled)
	framed := applyFrame(colorized)

	f, err := os.Create(outPath)
	if err != nil {
		return fmt.Errorf("create file: %w", err)
	}
	defer f.Close()

	return png.Encode(f, framed)
}

// colorize replaces the default black/white pixels with our custom palette.
func colorize(src image.Image) *image.RGBA {
	b := src.Bounds()
	dst := image.NewRGBA(b)
	for y := b.Min.Y; y < b.Max.Y; y++ {
		for x := b.Min.X; x < b.Max.X; x++ {
			r, g, bb, _ := src.At(x, y).RGBA()
			// bright pixels → background, dark pixels → foreground
			if r > 0x8000 && g > 0x8000 && bb > 0x8000 {
				dst.SetRGBA(x, y, bgColor)
			} else {
				dst.SetRGBA(x, y, fgColor)
			}
		}
	}
	return dst
}

// applyFrame wraps the QR image in a styled frame with L-bracket corner accents
// and a subtle dot-grid texture in the padding area.
func applyFrame(src image.Image) image.Image {
	const (
		padding      = 56  // space around the QR code
		border       = 5   // outer border stroke width
		accentLen    = 44  // length of each corner L-bracket arm
		accentWeight = 10  // thickness of each arm
		innerGap     = 14  // gap between QR edge and corner accents
	)

	sb := src.Bounds()
	qW, qH := sb.Dx(), sb.Dy()
	W := qW + 2*padding
	H := qH + 2*padding

	img := image.NewRGBA(image.Rect(0, 0, W, H))

	// Background fill
	fillRect(img, image.Rect(0, 0, W, H), bgColor)

	// Outer border
	drawBorder(img, image.Rect(0, 0, W, H), border, fgColor)

	// Inner subtle border (thinner, inset)
	inset := border + 6
	thinBorderCol := color.RGBA{R: fgColor.R, G: fgColor.G, B: fgColor.B, A: 60}
	drawBorderRGBA(img, image.Rect(inset, inset, W-inset, H-inset), 1, thinBorderCol)

	// Draw the QR code
	draw.Draw(img,
		image.Rect(padding, padding, padding+qW, padding+qH),
		src, sb.Min, draw.Src)

	// Corner L-bracket accents surrounding the QR code
	ax0 := padding - innerGap
	ay0 := padding - innerGap
	ax1 := padding + qW + innerGap
	ay1 := padding + qH + innerGap

	drawCorner(img, ax0, ay0, accentLen, accentWeight, topLeft)
	drawCorner(img, ax1, ay0, accentLen, accentWeight, topRight)
	drawCorner(img, ax0, ay1, accentLen, accentWeight, bottomLeft)
	drawCorner(img, ax1, ay1, accentLen, accentWeight, bottomRight)

	// Subtle dot-grid texture in the padding zone
	drawDotGrid(img, W, H, padding, qW, qH)

	return img
}

// ── Corner drawing ───────────────────────────────────────────────────────────

type cornerPos int

const (
	topLeft cornerPos = iota
	topRight
	bottomLeft
	bottomRight
)

func drawCorner(img *image.RGBA, x, y, length, weight int, pos cornerPos) {
	c := fgColor
	switch pos {
	case topLeft:
		fillRect(img, image.Rect(x, y, x+length, y+weight), c)
		fillRect(img, image.Rect(x, y, x+weight, y+length), c)
	case topRight:
		fillRect(img, image.Rect(x-length, y, x, y+weight), c)
		fillRect(img, image.Rect(x-weight, y, x, y+length), c)
	case bottomLeft:
		fillRect(img, image.Rect(x, y-length, x+weight, y), c)
		fillRect(img, image.Rect(x, y-weight, x+length, y), c)
	case bottomRight:
		fillRect(img, image.Rect(x-length, y-weight, x, y), c)
		fillRect(img, image.Rect(x-weight, y-length, x, y), c)
	}
}

// ── Dot grid ─────────────────────────────────────────────────────────────────

func drawDotGrid(img *image.RGBA, W, H, padding, qW, qH int) {
	dotCol := color.RGBA{R: fgColor.R, G: fgColor.G, B: fgColor.B, A: 40}
	spacing := 18
	radius := 1

	for py := spacing; py < H; py += spacing {
		for px := spacing; px < W; px += spacing {
			// Skip the QR code area (with a margin)
			margin := 8
			if px >= padding-margin && px <= padding+qW+margin &&
				py >= padding-margin && py <= padding+qH+margin {
				continue
			}
			drawCircle(img, px, py, radius, dotCol)
		}
	}
}

func drawCircle(img *image.RGBA, cx, cy, r int, col color.RGBA) {
	for y := cy - r; y <= cy+r; y++ {
		for x := cx - r; x <= cx+r; x++ {
			dx, dy := float64(x-cx), float64(y-cy)
			if math.Sqrt(dx*dx+dy*dy) <= float64(r) {
				blendPixel(img, x, y, col)
			}
		}
	}
}

// ── Drawing primitives ───────────────────────────────────────────────────────

func drawBorder(img *image.RGBA, r image.Rectangle, width int, col color.RGBA) {
	fillRect(img, image.Rect(r.Min.X, r.Min.Y, r.Max.X, r.Min.Y+width), col)
	fillRect(img, image.Rect(r.Min.X, r.Max.Y-width, r.Max.X, r.Max.Y), col)
	fillRect(img, image.Rect(r.Min.X, r.Min.Y, r.Min.X+width, r.Max.Y), col)
	fillRect(img, image.Rect(r.Max.X-width, r.Min.Y, r.Max.X, r.Max.Y), col)
}

func drawBorderRGBA(img *image.RGBA, r image.Rectangle, width int, col color.RGBA) {
	for _, rect := range []image.Rectangle{
		{r.Min, image.Pt(r.Max.X, r.Min.Y+width)},
		{image.Pt(r.Min.X, r.Max.Y-width), r.Max},
		{r.Min, image.Pt(r.Min.X+width, r.Max.Y)},
		{image.Pt(r.Max.X-width, r.Min.Y), r.Max},
	} {
		for y := rect.Min.Y; y < rect.Max.Y; y++ {
			for x := rect.Min.X; x < rect.Max.X; x++ {
				blendPixel(img, x, y, col)
			}
		}
	}
}

func fillRect(img *image.RGBA, r image.Rectangle, col color.RGBA) {
	draw.Draw(img, r.Intersect(img.Bounds()), &image.Uniform{col}, image.Point{}, draw.Src)
}

func blendPixel(img *image.RGBA, x, y int, col color.RGBA) {
	if !image.Pt(x, y).In(img.Bounds()) {
		return
	}
	a := float64(col.A) / 255.0
	dst := img.RGBAAt(x, y)
	dst.R = uint8(float64(col.R)*a + float64(dst.R)*(1-a))
	dst.G = uint8(float64(col.G)*a + float64(dst.G)*(1-a))
	dst.B = uint8(float64(col.B)*a + float64(dst.B)*(1-a))
	dst.A = 255
	img.SetRGBA(x, y, dst)
}

// ── Helpers ──────────────────────────────────────────────────────────────────

func collectCodes(codesFlag, codesFile string) []string {
	var codes []string

	if codesFlag != "" {
		for _, c := range strings.Split(codesFlag, ",") {
			if s := strings.TrimSpace(c); s != "" {
				codes = append(codes, s)
			}
		}
	}

	if codesFile != "" {
		f, err := os.Open(codesFile)
		if err != nil {
			fatalf("cannot open codes file: %v", err)
		}
		defer f.Close()
		sc := bufio.NewScanner(f)
		for sc.Scan() {
			line := strings.TrimSpace(sc.Text())
			if line != "" && !strings.HasPrefix(line, "#") {
				codes = append(codes, line)
			}
		}
	}

	return codes
}

func sanitize(s string) string {
	var b strings.Builder
	for _, r := range s {
		switch {
		case r >= 'a' && r <= 'z', r >= 'A' && r <= 'Z', r >= '0' && r <= '9', r == '-', r == '_':
			b.WriteRune(r)
		default:
			b.WriteRune('_')
		}
	}
	return b.String()
}

func fatalf(format string, args ...any) {
	fmt.Fprintf(os.Stderr, "Error: "+format+"\n", args...)
	os.Exit(1)
}
