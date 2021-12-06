export default function defaultGuildIcon(ac: string) {
	const bg = 'https://api.alexflipnote.dev/color/image/5865F2'
	return `https://textoverimage.moesif.com/image?image_url=${encodeURIComponent(
		bg
	)}&text=${encodeURIComponent(ac)}&y_align=middle&x_align=center`
}
