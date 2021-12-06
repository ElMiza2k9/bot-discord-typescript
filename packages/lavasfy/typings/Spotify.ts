export interface SpotifyArtist {
	name: string
	uri: string
}

export interface SpotifyAlbum {
	artists: SpotifyArtist[]
	name: string
	tracks: {
		items: SpotifyTrack[]
		next: string | null
		previous: string | null
	}
}

export interface SpotifyPlaylist {
	name: string
	tracks: {
		items: Array<{ track: SpotifyTrack }>
		next: string | null
		previous: string | null
	}
}

export interface SpotifyArtistTracks {
	tracks: Array<{ track: SpotifyTrack }>
}

export interface SpotifyTrack {
	album: any
	images: any
	artists: SpotifyArtist[]
	duration_ms: number
	external_urls: {
		spotify: string
	}
	id: string
	name: string
	thumbnail?: string
}
