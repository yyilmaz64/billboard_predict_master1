import os
# from dotenv import load_dotenv 
import spotipy
import joblib
from spotipy.oauth2 import SpotifyClientCredentials
import pandas as pd 
import numpy as np
from sklearn.preprocessing import MinMaxScaler

# load_dotenv(dotenv_path='spotifyCredSarah.env')
# CLIENT_ID = os.getenv('SPOTIPY_CLIENT_ID')
# CLIENT_SECRET = os.getenv('SPOTIPY_CLIENT_SECRET')

CLIENT_ID = os.environ['SPOTIPY_CLIENT_ID']
CLIENT_SECRET = os.environ['SPOTIPY_CLIENT_SECRET']

spotify = spotipy.Spotify(
    client_credentials_manager=SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET)
)

def get_features(song):
    return spotify.audio_features(spotify.search(q=song, limit=1)['tracks']['items'][0]['uri'])[0]

# extract info from billboard list
def getInfo(song, SongList):
    # create empty dict
    return_entry = {}
    # iterate through song list dict
    for row in SongList:
        # iterate through keys in a row
        for k in row.keys():
            # if the song matches row['song']...
            if row[k] == song:
                # ... create a dictionary of the row
                return_entry = {k: row[k] for k in row if k not in ['song', 'performer', 'id', 'hitTF']}
    # create a df out of the return_entry dict
    REdf = pd.DataFrame(return_entry, [0])
    # change cols order
    REdf = REdf[["chart_position", "previous_position", "peak", "weeks_on_chart", "danceability", 
        "energy", "key", "loudness", "mode", "speechiness", "acousticness", "instrumentalness", 
        "liveness", "valence", "tempo", "duratin_ms", "time_signature"]]

    REdf = REdf.select_dtypes(['int', 'float']).values

    # load a trained scaler
    scaler = joblib.load('models/scaler.gz')    
    # transform the data based on the scaler
    X = scaler.transform(REdf)

    # return the processed array
    return X
                

def makeNewPoint(features):
    
    data = pd.DataFrame(features, [0])
    data = data.assign(column_new_1=0.0, column_new_2=0.0, column_new_3=0.0, column_new_4=0.0)
    
    data = data[['column_new_1', 'column_new_2', 'column_new_3',
       'column_new_4', 'danceability', 'energy', 'key', 'loudness', 'mode', 'speechiness',
       'acousticness', 'instrumentalness', 'liveness', 'valence', 'tempo',
       'type', 'id', 'uri', 'track_href', 'analysis_url', 'duration_ms',
       'time_signature']]

    data = data.select_dtypes(['int', 'float']).values
    
    scaler = joblib.load('models/scaler.gz')    
    X = scaler.transform(data)

    # fill in the blank not on billboard hits 
    return X