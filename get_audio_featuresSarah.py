import os
from dotenv import load_dotenv 
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

load_dotenv(dotenv_path='spotifyCredSarah.env')
CLIENT_ID = os.getenv('SPOTIPY_CLIENT_ID')
CLIENT_SECRET = os.getenv('SPOTIPY_CLIENT_SECRET')

spotify = spotipy.Spotify(
    client_credentials_manager=SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
)

# def get_song_uri(song, artist=None): 
#     return spotify.search(q=song, limit=1)['tracks']['items'][0]['uri']

def get_features(song):
    return spotify.audio_features(spotify.search(q=song, limit=1)['tracks']['items'][0]['uri'])[0]