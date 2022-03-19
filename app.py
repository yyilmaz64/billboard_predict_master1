import os
# from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect
import pickle
from auxFunctionsSarah import *




# engine = create_engine('postgres://postgres:sQLsdh1511@localhost:5433/billboard_songs', echo=False)
# postgres credentials
# load_dotenv('postgresCred.env')
# POSTGRES_ID = os.getenv('POSTGRES_ID')
# POSTGRES_PASSWORD = os.getenv('POSTGRES_PASSWORD')

POSTGRES_ID = os.environ['POSTGRES_ID']
POSTGRES_PASSWORD = os.environ['POSTGRES_PASSWORD']

# create engine to connect to postgres db 'billboard_songs'
engine = create_engine(f'postgres://{POSTGRES_ID}:{POSTGRES_PASSWORD}@localhost:5433/billboard_songs')


Base = automap_base()
Base.prepare(engine, reflect=True)

connection = engine.connect()

model = pickle.load(open('models/LogRegW2021.sav','rb'))

app = Flask(__name__)

TopSongs = connection.execute("""SELECT * FROM latest_data;""")
song_titles = []
bbData = []

for row in TopSongs:
    my_dict = {
        "song":row[0],
        "performer": row[1],
        "chart_position": row[2],
        "previous_position": row[3],
        "peak": row[4],
        "weeks_on_chart": row[5],
        "hitTF": row[6],
        "id": row[7],
        "danceability": row[8],
        "energy": row[9],
        "key": row[10],
        "loudness": row[11],
        "mode": row[12],
        "speechiness": row[13],
        "acousticness": row[14],
        "instrumentalness": row[15],
        "liveness": row[16],
        "valence": row[17],
        "tempo": row[18],
        "duratin_ms": row[19],
        "time_signature": row[20]
    }
    bbData.append(my_dict)
    song_titles.append(row[0])

bbData.append({'columns': ["song", "performer", "chart_position", "previous_position", "peak", "weeks_on_chart", "hitTF", "id", "danceability", "energy", "key", "loudness", "mode", "speechiness", "acousticness", "instrumentalness", "liveness", "valence", "tempo", "duratin_ms", "time_signature"]})


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/sunburstbubble')
def sunbubblevalues():
    result = connection.execute("""SELECT * FROM data_cleaned;""")
    print(result)
    songData = []
    for row in result:
        my_dict = {
            "title":row[0],
            "artist": row[1],
            "genre": row[2],
            "genre_num": row[3],
            "subgenre": row[4],
            "year": row[5],
            "bpm": row[6],
            "nrgy": row[7],
            "dnce": row[8],
            "dB": row[9],
            "live": row[10],
            "val": row[11],
            "dur": row[12],
            "acous": row[13],
            "spch": row[14],
            "pop": row[15]
        }
        songData.append(my_dict)
        print(row)
    songData.append({'columns': ["title", "artist", "genre", "genre_num", "subgenre", "year", "bpm", "nrgy", "dnce", "dB", "live", "val", "dur", "acous", "spch", "pop"]})
    return(jsonify(songData))

@app.route('/heatmap')
def heatmapvalues():
    result = connection.execute("""SELECT * FROM corr_heatmap_vals;""")
    data = []
    for row in result:
        my_dict = {
            "feat1":row[0],
            "feat2": row[1],
            "vals": row[2]
        }
        data.append(my_dict)
        print(row)
    return(jsonify(data))

@app.route('/bar')
def barvalues():
    result = connection.execute("""SELECT * FROM year_table;""")
    data = []
    for row in result:
        my_dict = {
            "year":row[0],
            "nrgy": row[1],
            "dnce": row[2],
            "val": row[3],
            "pop": row[4]
        }
        data.append(my_dict)
        print(row)
    return(jsonify(data))

@app.route('/tracks')
def tracks():
    return render_template("tracks.html")
    
@app.route('/billboard_songs')
def songs():
    for song in TopSongs:
        song_titles.append(song[0])

    return jsonify(song_titles)

@app.route('/predict', methods=['POST'])
def predict():
    print(len(bbData))
    print(bbData[0])
    predictText = ''
    for users_input_song in request.form.values():
        if users_input_song in song_titles:
            print('if statement')
            print(users_input_song)
            # get other cols of data to for model 
            song_info = getInfo(users_input_song, bbData)
            # for m in song_info:
            prediction = model.predict(song_info)

            if prediction == 0:
                predictText = f'{users_input_song} is likely to not be a hit!'
                return render_template('index.html', text = predictText)
            elif prediction == 1:
                predictText = f'{users_input_song} is likely to be a hit!'
                return render_template('index.html', text = predictText)

        else:
            print('else statement')
            print(users_input_song)
            features = get_features(users_input_song)
            new_pt = makeNewPoint(features)
            prediction = model.predict(new_pt)

            if prediction == 0:
                predictText = f'{users_input_song} is likely to not be a hit!'
                return render_template('index.html', text = predictText)
            elif prediction == 1:
                predictText = f'{users_input_song} is likely to be a hit!'
                return render_template('index.html', text = predictText)

if __name__ == "__main__":
    # app.run(threaded=True, port=int(os.environ.get('PORT', 33507)))
    app.run()
