const isLocalhost = Boolean(
	window.location.hostname === 'localhost' ||
		window.location.hostname === '[::1]' ||
		window.location.hostname.match(
			/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
		)
)

export const SERVER_URL = isLocalhost
	? 'http://localhost:3030/'
	: 'https://oyster-hat.cyclic.app/'
export const SSE = new EventSource(`${SERVER_URL}stream`, {
	withCredentials: true
})
